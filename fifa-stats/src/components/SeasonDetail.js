import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, BarChart2, Calendar, Shield, Trophy as TrophyIcon, ArrowLeft, AlertCircle, UserX, Trash2, Star } from 'lucide-react';
import { getSeasonById } from '../services/seasonsService';
import { getMatchesBySeason, createMatch } from '../services/matchesService';
import { getTrophiesBySeason, createTrophy, deleteTrophy } from '../services/trophiesService';
import { getTeams } from '../services/teamsService';
import { getCompetitions } from '../services/competitionsService';
import { getTrophyStatsBySeason } from '../services/trophiesService';
import styled from 'styled-components';
import SeasonStatsSection from './SeasonStatsSection';

const SeasonDetail = () => {
  const { seasonId } = useParams();
  const [season, setSeason] = useState(null);
  const [matches, setMatches] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const [trophyStats, setTrophyStats] = useState({ individual: 0, team: 0 });
  const [loading, setLoading] = useState(true);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [showTrophyForm, setShowTrophyForm] = useState(false);
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);

  const loadSeasonData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        seasonData, 
        matchesData, 
        trophiesData, 
        trophyStatsData,
        teamsData,
        competitionsData
      ] = await Promise.all([
        getSeasonById(seasonId),
        getMatchesBySeason(seasonId),
        getTrophiesBySeason(seasonId),
        getTrophyStatsBySeason(seasonId),
        getTeams(),
        getCompetitions()
      ]);
      
      setSeason(seasonData);
      setMatches(matchesData);
      setTrophies(trophiesData);
      setTrophyStats(trophyStatsData);
      setTeams(teamsData);
      setCompetitions(competitionsData);
      console.log('[SeasonDetail] Datos cargados:', {
        teams: teamsData.length,
        competitions: competitionsData.length,
        matches: matchesData.length,
        trophies: trophiesData.length
      });

    } catch (error) {
      console.error('Error al cargar datos de la temporada:', error);
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  useEffect(() => {
    loadSeasonData();
  }, [seasonId, loadSeasonData]);

  const handleMatchCreated = () => {
    setShowMatchForm(false);
    loadSeasonData();
  };

  const handleTrophyCreated = () => {
    setShowTrophyForm(false);
    loadSeasonData();
  }

  const handleTrophyDeleted = async (trophyId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este trofeo?')) {
      try {
        await deleteTrophy(trophyId);
        loadSeasonData();
      } catch (error) {
        console.error('Error al eliminar trofeo:', error);
        alert('No se pudo eliminar el trofeo.');
      }
    }
  }

  if (loading) {
    return <div className="loading-container">Cargando datos de la temporada...</div>;
  }

  if (!season) {
    return <div className="error-container">No se pudo cargar la temporada.</div>;
  }

  return (
    <div className="season-detail-container page-wrapper">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Volver al Dashboard
      </Link>

      <header className="season-header flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="season-title">{season.name}</h1>
          {season.club && (
            <div className="season-club">
              <Shield size={20} />
              <span>{season.club.name}</span>
            </div>
          )}
        </div>
        <div className="season-meta flex gap-4 flex-wrap md:flex-nowrap">
          <div className="meta-item">
            <Calendar size={18} />
            <span>{matches.length} Partidos</span>
          </div>
          <div className="meta-item">
            <TrophyIcon size={18} />
            <span>{trophies.length} Trofeos ({trophyStats.team} equipo, {trophyStats.individual} indiv.)</span>
          </div>
        </div>
      </header>

      <div className="actions-bar flex gap-3 my-4 flex-wrap md:flex-nowrap sticky bottom-4 md:static z-20">
        <button className="btn btn-primary" onClick={() => setShowMatchForm(true)}>
          <Plus size={18} /> Añadir Partido
        </button>
        <button className="btn btn-secondary" onClick={() => setShowTrophyForm(true)}>
          <TrophyIcon size={18} /> Añadir Trofeo
        </button>
      </div>

      <div className="season-detail-content">
        {showMatchForm ? (
          <MatchForm 
            seasonId={seasonId} 
            onMatchCreated={handleMatchCreated} 
            onCancel={() => setShowMatchForm(false)}
            teams={teams}
            competitions={competitions}
            currentTeamId={season?.club?.id}
          />
        ) : showTrophyForm ? (
          <TrophyForm
            seasonId={seasonId}
            onTrophyCreated={handleTrophyCreated}
            onCancel={() => setShowTrophyForm(false)}
            competitions={competitions.filter(c => c.level === 'club' || c.level === 'selección')}
            teams={teams}
            currentTeamId={season?.club?.id}
          />
        ) : (
          <>
            {/* Estadísticas de la temporada */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <SeasonStatsSection stats={calculateSeasonStats(matches)} />
            </div>

            <MatchesList matches={matches} />
            <TrophiesList trophies={trophies} onTrophyDeleted={handleTrophyDeleted} />
          </>
        )}
      </div>
    </div>
  );
};

// Añadir función para calcular estadísticas de la temporada
const calculateSeasonStats = (matches) => {
  const initial = {
    matches: 0,
    goals: 0,
    assists: 0,
    minutes: 0,
    ratingSum: 0,
    wins: 0,
    draws: 0,
    losses: 0,
  };

  const stats = matches.reduce((acc, match) => {
    const ps = match.player_stats?.[0] || {};
    acc.matches += 1;
    acc.goals += ps.goals || 0;
    acc.assists += ps.assists || 0;
    acc.minutes += ps.minutes_played || 0;
    acc.ratingSum += ps.rating || 0;

    const homeScore = match.home_score;
    const awayScore = match.away_score;

    if (typeof homeScore === 'number' && typeof awayScore === 'number') {
      const playerIsHome = ps.team_id
        ? ps.team_id === match.home_team_id
        : match.is_home_match;

      if (homeScore === awayScore) {
        acc.draws += 1;
      } else {
        const playerWon =
          (playerIsHome && homeScore > awayScore) ||
          (!playerIsHome && awayScore > homeScore);
        if (playerWon) {
          acc.wins += 1;
        } else {
          acc.losses += 1;
        }
      }
    }

    return acc;
  }, initial);

  return {
    ...stats,
    averageRating: stats.matches > 0 ? stats.ratingSum / stats.matches : 0,
    goalsPerMatch: stats.matches > 0 ? stats.goals / stats.matches : 0,
    assistsPerMatch: stats.matches > 0 ? stats.assists / stats.matches : 0,
    goalsAssistsPerMatch: stats.matches > 0 ? (stats.goals + stats.assists) / stats.matches : 0,
  };
};

const MatchForm = ({ seasonId, onMatchCreated, onCancel, teams, competitions, currentTeamId }) => {
  const [formData, setFormData] = useState({
    competition_id: '',
    opponent_team_id: '',
    match_date: new Date().toISOString().split('T')[0],
    is_home_match: true,
    home_score: 0,
    away_score: 0,
    minutes_played: 90,
    goals: 0,
    assists: 0,
    rating: 6.0,
  });

  const [availableOpponents, setAvailableOpponents] = useState([]);
  const [competitionSearch, setCompetitionSearch] = useState('');
  const [opponentSearch, setOpponentSearch] = useState('');
  const [showCompetitionList, setShowCompetitionList] = useState(false);
  const [showOpponentList, setShowOpponentList] = useState(false);
  
  useEffect(() => {
    if (currentTeamId) {
      setAvailableOpponents(teams.filter(t => t.id !== currentTeamId));
    } else {
      setAvailableOpponents(teams);
    }
  }, [teams, currentTeamId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar campos obligatorios
      if (!formData.competition_id || !formData.opponent_team_id) {
        alert('Debes seleccionar una competición y un equipo rival.');
        return;
      }
      // Combina los datos del formulario con las estadísticas del jugador
      const matchData = {
        competition_id: formData.competition_id,
        opponent_team_id: formData.opponent_team_id,
        match_date: formData.match_date,
        is_home_match: formData.is_home_match,
        home_score: parseInt(formData.home_score),
        away_score: parseInt(formData.away_score),
        player_team_id: currentTeamId,
      };
      
      const playerStats = {
        minutes_played: parseInt(formData.minutes_played),
        goals: parseInt(formData.goals),
        assists: parseInt(formData.assists),
        rating: parseFloat(formData.rating),
      };

      await createMatch(seasonId, matchData, playerStats);
      onMatchCreated();
    } catch (error) {
      console.error('Error al crear partido:', error);
      alert('Hubo un error al crear el partido.');
    }
  };

  return (
    <FormContainer>
      <h3 className="form-title">Añadir Nuevo Partido</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Campo de búsqueda para Competición */}
          <div className="form-group">
            <label>Competición</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={competitionSearch}
                onChange={(e) => {
                  setCompetitionSearch(e.target.value);
                  setFormData({ ...formData, competition_id: '' });
                  setShowCompetitionList(true);
                }}
                onFocus={() => setShowCompetitionList(true)}
                onBlur={() => setTimeout(() => setShowCompetitionList(false), 200)}
                placeholder="Busca una competición..."
                required={!formData.competition_id}
              />
              {showCompetitionList && (
                <div className="search-results">
                  {competitions
                    .filter(c => c.name.toLowerCase().includes(competitionSearch.toLowerCase()))
                    .map(comp => (
                      <div
                        key={comp.id}
                        className="search-item"
                        onClick={() => {
                          setFormData({ ...formData, competition_id: comp.id });
                          setCompetitionSearch(comp.name);
                          setShowCompetitionList(false);
                        }}
                      >
                        {comp.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Campo de búsqueda para Equipo Rival */}
          <div className="form-group">
            <label>Equipo Rival</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={opponentSearch}
                onChange={(e) => {
                  setOpponentSearch(e.target.value);
                  setFormData({ ...formData, opponent_team_id: '' });
                  setShowOpponentList(true);
                }}
                onFocus={() => setShowOpponentList(true)}
                onBlur={() => setTimeout(() => setShowOpponentList(false), 200)}
                placeholder="Busca un rival..."
                required={!formData.opponent_team_id}
              />
              {showOpponentList && (
                <div className="search-results">
                  {availableOpponents
                    .filter(t => t.name.toLowerCase().includes(opponentSearch.toLowerCase()))
                    .map(team => (
                      <div
                        key={team.id}
                        className="search-item"
                        onClick={() => {
                          setFormData({ ...formData, opponent_team_id: team.id });
                          setOpponentSearch(team.name);
                          setShowOpponentList(false);
                        }}
                      >
                        {team.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Fecha del Partido</label>
            <input type="date" name="match_date" value={formData.match_date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" name="is_home_match" checked={formData.is_home_match} onChange={handleChange} />
              Partido en casa
            </label>
          </div>
        </div>
        
        <h4>Resultado</h4>
        <div className="form-grid score-grid">
          <div className="form-group">
            <label>{formData.is_home_match ? 'Goles a Favor' : 'Goles Rival'}</label>
            <input type="number" name="home_score" value={formData.home_score} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>{formData.is_home_match ? 'Goles Rival' : 'Goles a Favor'}</label>
            <input type="number" name="away_score" value={formData.away_score} onChange={handleChange} />
          </div>
        </div>

        <h4>Mis Estadísticas</h4>
        <div className="form-grid stats-grid">
          <div className="form-group">
            <label>Minutos Jugados</label>
            <input type="number" name="minutes_played" value={formData.minutes_played} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Goles</label>
            <input type="number" name="goals" value={formData.goals} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Asistencias</label>
            <input type="number" name="assists" value={formData.assists} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Valoración (Rating)</label>
            <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar Partido</button>
        </div>
      </form>
    </FormContainer>
  );
};

const TrophyForm = ({ seasonId, onTrophyCreated, onCancel, competitions, teams, currentTeamId }) => {
  const [formData, setFormData] = useState({
    name: '',
    competition_id: '',
    team_id: '',
    is_individual: false,
  });

  const [competitionSearch, setCompetitionSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [showCompetitionList, setShowCompetitionList] = useState(false);
  const [showTeamList, setShowTeamList] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const trophyData = {
        name: formData.name.trim(),
        competition_id: formData.is_individual ? null : formData.competition_id,
        team_id: formData.is_individual ? null : formData.team_id,
        is_individual: formData.is_individual,
      };

      await createTrophy(seasonId, trophyData);
      onTrophyCreated();
    } catch (error) {
      console.error('Error al crear trofeo:', error);
      alert('Hubo un error al crear el trofeo.');
    }
  };

  return (
    <FormContainer>
      <h3 className="form-title">Añadir Nuevo Trofeo</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Trofeo</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Copa América, Champions League, Balón de Oro..."
            required
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" name="is_individual" checked={formData.is_individual} onChange={handleChange} />
            Premio Individual (Balón de Oro, Mejor Jugador, etc.)
          </label>
        </div>

        {!formData.is_individual && (
          <>
            <div className="form-group">
              <label>Competición</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={competitionSearch}
                  onChange={(e) => {
                    setCompetitionSearch(e.target.value);
                    setFormData({ ...formData, competition_id: '' });
                    setShowCompetitionList(true);
                  }}
                  onFocus={() => setShowCompetitionList(true)}
                  onBlur={() => setTimeout(() => setShowCompetitionList(false), 200)}
                  placeholder="Busca una competición..."
                  required={!formData.competition_id}
                />
                {showCompetitionList && (
                  <div className="search-results">
                    {competitions
                      .filter(c => c.name.toLowerCase().includes(competitionSearch.toLowerCase()))
                      .map(comp => (
                        <div
                          key={comp.id}
                          className="search-item"
                          onClick={() => {
                            setFormData({ ...formData, competition_id: comp.id });
                            setCompetitionSearch(comp.name);
                            setShowCompetitionList(false);
                          }}
                        >
                          {comp.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Equipo</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={teamSearch}
                  onChange={(e) => {
                    setTeamSearch(e.target.value);
                    setFormData({ ...formData, team_id: '' });
                    setShowTeamList(true);
                  }}
                  onFocus={() => setShowTeamList(true)}
                  onBlur={() => setTimeout(() => setShowTeamList(false), 200)}
                  placeholder="Busca un equipo..."
                  required={!formData.team_id}
                />
                {showTeamList && (
                  <div className="search-results">
                    {teams
                      .filter(t => t.name.toLowerCase().includes(teamSearch.toLowerCase()))
                      .map(team => (
                        <div
                          key={team.id}
                          className="search-item"
                          onClick={() => {
                            setFormData({ ...formData, team_id: team.id });
                            setTeamSearch(team.name);
                            setShowTeamList(false);
                          }}
                        >
                          {team.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn btn-primary">Guardar Trofeo</button>
        </div>
      </form>
    </FormContainer>
  );
};

const MatchesList = ({ matches }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <BarChart2 size={20} style={{ marginRight: '0.5rem' }} />
          Historial de Partidos
        </h2>
      </div>
      <div className="table-container overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Competición</th>
              <th>Partido</th>
              <th>Resultado</th>
              <th>Goles</th>
              <th>Asistencias</th>
              <th>Rating</th>
              <th>Minutos</th>
              <th>Tarjetas</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const playerStats = match.player_stats?.[0] || {};
              return (
                <tr key={match.id}>
                  <td>{match.competition?.name || 'N/A'}</td>
                  <td>
                    <div>
                      {match.home_team?.name || 'N/A'} vs {match.away_team?.name || 'N/A'}
                      {match.is_national_team && (
                        <span style={{ color: '#00a8cc', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                          (Selección)
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{`${match.home_score} - ${match.away_score}`}</td>
                  <td>
                    <span style={{ color: (playerStats.goals || 0) > 0 ? '#28a745' : '#b8c5d1' }}>
                      {playerStats.goals || 0}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: (playerStats.assists || 0) > 0 ? '#00a8cc' : '#b8c5d1' }}>
                      {playerStats.assists || 0}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: (playerStats.rating || 0) >= 7.5 ? '#28a745' : 
                             (playerStats.rating || 0) >= 6.5 ? '#ffc107' : '#dc3545' 
                    }}>
                      {playerStats.rating || 0}
                    </span>
                  </td>
                  <td>{playerStats.minutes_played || 0}'</td>
                  <td style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    {(playerStats.yellow_cards || 0) > 0 && (
                      <span style={{ color: '#ffc107' }}>
                        <AlertCircle size={14} /> {playerStats.yellow_cards}
                      </span>
                    )}
                    {(playerStats.red_cards || 0) > 0 && (
                      <span style={{ color: '#dc3545' }}>
                        <UserX size={14} /> {playerStats.red_cards}
                      </span>
                    )}
                    {(playerStats.yellow_cards || 0) === 0 && (playerStats.red_cards || 0) === 0 && (
                      <span style={{ color: '#b8c5d1' }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TrophiesList = ({ trophies, onTrophyDeleted }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <TrophyIcon size={20} style={{ marginRight: '0.5rem' }} />
          Trofeos de la Temporada
        </h2>
      </div>
      <div className="trophies-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {trophies.map((trophy) => (
          <div
            key={trophy.id}
            className={`relative border rounded-lg p-4 ${
              trophy.is_individual ? 'bg-yellow-100/80 border-yellow-300' : 'bg-cyan-50/80 border-cyan-200'
            }`}
          >
            <button
              onClick={() => onTrophyDeleted(trophy.id)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-700 p-1"
              title="Eliminar trofeo"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="flex items-center mb-3 gap-2">
              {trophy.is_individual ? (
                <Star size={24} style={{ color: '#ffc107', marginRight: '0.5rem' }} />
              ) : (
                <TrophyIcon size={24} style={{ color: '#00a8cc', marginRight: '0.5rem' }} />
              )}
              <h3 className="m-0 text-lg font-semibold text-gray-800">
                {trophy.name}
              </h3>
            </div>
            
            {!trophy.is_individual && trophy.competition && (
              <p className="my-1 text-sm text-gray-600">
                <strong>Competición:</strong> {trophy.competition.name}
                {trophy.competition.nation?.name && ` (${trophy.competition.nation.name})`}
              </p>
            )}
            
            {!trophy.is_individual && trophy.team && (
              <p className="my-1 text-sm text-gray-600">
                <strong>Equipo:</strong> {trophy.team.name}
                {trophy.team.nation?.name && ` (${trophy.team.nation.name})`}
              </p>
            )}
            
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
              {trophy.is_individual ? 'Premio Individual' : 'Trofeo de Equipo'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FormContainer = styled.div`
  background-color: #1a202c;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;

  .form-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #2d3748;
    padding-bottom: 1rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .score-grid { grid-template-columns: 1fr 1fr; }
  .stats-grid { grid-template-columns: repeat(4, 1fr); }

  h4 {
    font-size: 1.1rem;
    font-weight: 500;
    color: #cbd5e0;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #a0aec0;
    margin-bottom: 0.5rem;
  }

  input[type="text"],
  input[type="date"],
  input[type="number"] {
    background-color: #2d3748;
    border: 1px solid #4a5568;
    color: #fff;
    padding: 0.75rem;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .checkbox-label {
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    margin-top: auto;
  }
  
  input[type="checkbox"] {
    margin-right: 0.5rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }

  .search-results {
    position: absolute;
    width: 100%;
    background-color: #2d3748;
    border: 1px solid #4a5568;
    border-radius: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    margin-top: 4px;
  }

  .search-item {
    padding: 8px 12px;
    cursor: pointer;
    color: #e2e8f0;
  }

  .search-item:hover {
    background-color: #4a5568;
  }
`;

export default SeasonDetail; 