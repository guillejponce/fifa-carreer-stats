import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Target, Trophy, TrendingUp, Shield, Star, CheckCircle, XCircle, Minus } from 'lucide-react';
import { getSeasons, createSeason } from '../services/seasonsService';
import { getTeams, createTeam } from '../services/teamsService';
import { getDetailedCareerStats } from '../services/statsService';
import StatsSection from './StatsSection';
import TopOpponents from './TopOpponents';
import BestMatches from './BestMatches';
import CompetitionStats from './CompetitionStats';

const Dashboard = () => {
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [detailedStats, setDetailedStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('');
  const [newClubName, setNewClubName] = useState('');
  const [newClubNation, setNewClubNation] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [clubSearchTerm, setClubSearchTerm] = useState('');
  const [isSeasonNameValid, setIsSeasonNameValid] = useState(true);
  const [isClubDropdownOpen, setIsClubDropdownOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [seasonsData, teamsData, statsData] = await Promise.all([
        getSeasons(),
        getTeams(),
        getDetailedCareerStats()
      ]);
      
      setSeasons(seasonsData);
      setTeams(teamsData);
      setDetailedStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSeason = async (e) => {
    e.preventDefault();
    if (!newSeasonName.trim()) return;

    setIsCreating(true);
    try {
      let clubId = selectedClubId;

      // Si se especificó un nuevo club, crearlo primero
      if (newClubName.trim() && !selectedClubId) {
        const newTeam = await createTeam({
          name: newClubName.trim(),
          is_national_team: false,
          nation_name: newClubNation.trim() || null
        });
        clubId = newTeam.id;
        setTeams(prev => [...prev, newTeam]);
      }

      const seasonName = newSeasonName.trim();
      const yearMatch = seasonName.match(/^(\d{4})\s*\/\s*(\d{4})$/);
      
      if (!yearMatch) {
        alert('El nombre de la temporada debe tener el formato "YYYY/YYYY" (ej: 2024/2025).');
        setIsCreating(false);
        return;
      }
      
      const startYear = parseInt(yearMatch[1], 10);
      const endYear = parseInt(yearMatch[2], 10);

      await createSeason({
        name: seasonName,
        club_id: clubId || null,
        start_year: startYear,
        end_year: endYear
      });

      // Recargar datos
      await loadData();
      
      // Limpiar formulario
      setNewSeasonName('');
      setSelectedClubId('');
      setNewClubName('');
      setNewClubNation('');
      setClubSearchTerm('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error al crear temporada:', error);
      alert('Error al crear la temporada');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <h2>Cargando dashboard...</h2>
          <p>Obteniendo estadísticas de tu carrera...</p>
        </div>
      </div>
    );
  }

  const availableClubs = teams.filter(team => !team.is_national_team);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard - Modo Carrera FIFA</h1>
        <p>Resumen completo de tu carrera profesional</p>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
          disabled={isCreating}
          style={{ marginTop: '1rem' }}
        >
          <Plus size={18} />
          Nueva Temporada
        </button>
      </div>

      {/* Estadísticas principales */}
      {detailedStats && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <StatsSection stats={detailedStats} />
        </div>
      )}

      {/* Grid de estadísticas adicionales */}
      {detailedStats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '1.5rem', 
          marginBottom: '2rem' 
        }}>
          <TopOpponents opponents={detailedStats.topOpponents} />
          <BestMatches matches={detailedStats.bestMatches} />
        </div>
      )}

      {/* Estadísticas por competición */}
      {detailedStats && detailedStats.topCompetitions.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <CompetitionStats competitions={detailedStats.topCompetitions} />
        </div>
      )}

      {/* Formulario para nueva temporada */}
      {showCreateForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <h2 className="card-title">Nueva Temporada</h2>
          </div>
          <form onSubmit={handleCreateSeason}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre de la Temporada</label>
                <input
                  type="text"
                  className={`form-input ${!isSeasonNameValid ? 'input-error' : ''}`}
                  placeholder="ej: 2024/2025"
                  value={newSeasonName}
                  onChange={(e) => {
                    setNewSeasonName(e.target.value);
                    const yearMatch = e.target.value.match(/^(\d{4})\s*\/\s*(\d{4})$/);
                    setIsSeasonNameValid(!!yearMatch || e.target.value === '');
                  }}
                  disabled={isCreating}
                  required
                />
                {!isSeasonNameValid && <p className="form-hint error">Formato requerido: YYYY/YYYY</p>}
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">Club (opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar club existente..."
                  value={clubSearchTerm}
                  onChange={(e) => {
                    setClubSearchTerm(e.target.value);
                    setSelectedClubId('');
                    if (e.target.value) setNewClubName('');
                    setIsClubDropdownOpen(true);
                  }}
                  onFocus={() => setIsClubDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsClubDropdownOpen(false), 200)} // Delay to allow click
                  disabled={isCreating}
                />
                {isClubDropdownOpen && (
                  <div 
                    className="dropdown-menu" 
                    style={{ 
                      position: 'absolute', 
                      width: '100%', 
                      maxHeight: '200px', 
                      overflowY: 'auto',
                      backgroundColor: '#2d3748', // Un color de fondo más oscuro
                      border: '1px solid #4a5568',
                      borderRadius: '0.25rem',
                      marginTop: '0.25rem',
                      zIndex: 10
                    }}
                  >
                    {availableClubs
                      .filter(team => team.name.toLowerCase().includes(clubSearchTerm.toLowerCase()))
                      .map((team) => (
                        <div
                          key={team.id}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedClubId(team.id);
                            setClubSearchTerm(team.name);
                            setIsClubDropdownOpen(false);
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            hover: {
                              backgroundColor: '#4a5568'
                            }
                          }}
                        >
                          {team.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {!selectedClubId && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">O crear nuevo club</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nombre del nuevo club"
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">País del nuevo club (opcional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ej: Inglaterra"
                    value={newClubNation}
                    onChange={(e) => setNewClubNation(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={isCreating}
              >
                {isCreating ? 'Creando...' : 'Crear Temporada'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewSeasonName('');
                  setSelectedClubId('');
                  setNewClubName('');
                  setNewClubNation('');
                  setClubSearchTerm('');
                }}
                disabled={isCreating}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de temporadas */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar size={20} style={{ marginRight: '0.5rem' }} />
            Mis Temporadas
          </h2>
          {!showCreateForm && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
              disabled={isCreating}
            >
              <Plus size={18} />
              Nueva Temporada
            </button>
          )}
        </div>

        {seasons.length === 0 ? (
          <div className="empty-state">
            <Trophy size={64} style={{ color: '#00a8cc', marginBottom: '1rem' }} />
            <h3>¡Empieza tu carrera!</h3>
            <p>Crea tu primera temporada para comenzar a registrar partidos</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
              style={{ marginTop: '1rem' }}
            >
              <Plus size={18} />
              Crear Primera Temporada
            </button>
          </div>
        ) : (
          <div className="seasons-grid">
            {seasons.map((season) => {
              const seasonStats = detailedStats?.seasonStats?.find(s => 
                s.name.includes(season.name)
              ) || { 
                matches: 0, 
                goals: 0, 
                assists: 0, 
                averageRating: 0, 
                averageMinutes: 0,
                goalsPerMatch: 0,
                assistsPerMatch: 0,
                goalsAssistsPerMatch: 0,
                wins: 0,
                draws: 0,
                losses: 0
              };

              return (
                <Link 
                  key={season.id} 
                  to={`/season/${season.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
                    {/* Header de la temporada */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      marginBottom: '1.5rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingBottom: '1rem'
                    }}>
                      <div>
                        <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>
                          {season.name}
                        </h3>
                        {season.club && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            color: '#00a8cc',
                            fontSize: '0.9rem'
                          }}>
                            <Shield size={16} />
                            <span>{season.club.name}</span>
                          </div>
                        )}
                      </div>
                      <Calendar size={24} style={{ color: '#00a8cc', opacity: 0.7 }} />
                    </div>
                    
                    {/* Estadísticas principales */}
                    <div className="season-stats" style={{ marginBottom: '1.5rem' }}>
                      <div className="season-stat">
                        <span className="stat-value">{seasonStats.matches}</span>
                        <span className="stat-label">Partidos</span>
                      </div>
                      <div className="season-stat">
                        <span className="stat-value" style={{ color: '#ffc107' }}>
                          {seasonStats.averageRating ? seasonStats.averageRating.toFixed(1) : '0.0'}
                        </span>
                        <span className="stat-label">Rating</span>
                      </div>
                      <div className="season-stat">
                        <span className="stat-value" style={{ color: '#28a745' }}>
                          {seasonStats.goals}
                        </span>
                        <span className="stat-label">Goles</span>
                        {seasonStats.goalsPerMatch > 0 && (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            color: '#8b9aa8',
                            display: 'block'
                          }}>
                            ({seasonStats.goalsPerMatch.toFixed(1)}/p)
                          </span>
                        )}
                      </div>
                      <div className="season-stat">
                        <span className="stat-value" style={{ color: '#6f42c1' }}>
                          {seasonStats.assists}
                        </span>
                        <span className="stat-label">Asistencias</span>
                        {seasonStats.assistsPerMatch > 0 && (
                          <span style={{ 
                            fontSize: '0.7rem', 
                            color: '#8b9aa8',
                            display: 'block'
                          }}>
                            ({seasonStats.assistsPerMatch.toFixed(1)}/p)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resultados de partidos */}
                    {seasonStats.matches > 0 && (
                      <div style={{ 
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#b8c5d1', 
                          marginBottom: '0.5rem',
                          fontWeight: '500'
                        }}>
                          Resultados
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              fontSize: '0.85rem'
                            }}>
                              <CheckCircle size={14} style={{ color: '#10b981' }} />
                              <span style={{ color: '#10b981', fontWeight: '500' }}>
                                {seasonStats.wins || 0}
                              </span>
                              <span style={{ color: '#8b9aa8' }}>G</span>
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              fontSize: '0.85rem'
                            }}>
                              <Minus size={14} style={{ color: '#f59e0b' }} />
                              <span style={{ color: '#f59e0b', fontWeight: '500' }}>
                                {seasonStats.draws || 0}
                              </span>
                              <span style={{ color: '#8b9aa8' }}>E</span>
                            </div>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              fontSize: '0.85rem'
                            }}>
                              <XCircle size={14} style={{ color: '#ef4444' }} />
                              <span style={{ color: '#ef4444', fontWeight: '500' }}>
                                {seasonStats.losses || 0}
                              </span>
                              <span style={{ color: '#8b9aa8' }}>P</span>
                            </div>
                          </div>
                          {seasonStats.goalsAssistsPerMatch > 0 && (
                            <div style={{ 
                              color: '#00a8cc',
                              fontSize: '0.85rem',
                              fontWeight: '500'
                            }}>
                              {seasonStats.goalsAssistsPerMatch.toFixed(1)} G+A/p
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fecha de creación */}
                    <div className="season-date">
                      Creada: {new Date(season.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 