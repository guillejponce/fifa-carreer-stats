import { useState, useEffect } from 'react';
import { getTeams, createTeam } from '../services/teamsService';
import { getCompetitions, createCompetition } from '../services/competitionsService';
import { Plus, Users, Trophy } from 'lucide-react';

const AdminPanel = () => {
  const [teams, setTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showCompetitionForm, setShowCompetitionForm] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: '',
    is_national_team: false
  });
  const [competitionForm, setCompetitionForm] = useState({
    name: '',
    type: 'liga',
    level: 'club'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, competitionsData] = await Promise.all([
        getTeams(),
        getCompetitions()
      ]);
      setTeams(teamsData);
      setCompetitions(competitionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam(teamForm);
      setTeamForm({ name: '', is_national_team: false });
      setShowTeamForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error al crear equipo');
    }
  };

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    try {
      await createCompetition(competitionForm);
      setCompetitionForm({ name: '', type: 'liga', level: 'club' });
      setShowCompetitionForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating competition:', error);
      alert('Error al crear competición');
    }
  };

  const createSampleData = async () => {
    try {
      // Crear equipos de ejemplo con sus respectivos países
      const sampleTeams = [
        { name: 'Real Madrid', is_national_team: false, nation_name: 'España' },
        { name: 'Barcelona', is_national_team: false, nation_name: 'España' },
        { name: 'Manchester City', is_national_team: false, nation_name: 'Inglaterra' },
        { name: 'Arsenal', is_national_team: false, nation_name: 'Inglaterra' },
        { name: 'PSG', is_national_team: false, nation_name: 'Francia' },
        { name: 'Bayern Munich', is_national_team: false, nation_name: 'Alemania' },
        { name: 'España', is_national_team: true, nation_name: 'España' },
        { name: 'Inglaterra', is_national_team: true, nation_name: 'Inglaterra' },
        { name: 'Francia', is_national_team: true, nation_name: 'Francia' },
        { name: 'Alemania', is_national_team: true, nation_name: 'Alemania' }
      ];

      const sampleCompetitions = [
        { name: 'La Liga', type: 'liga', level: 'club', nation_name: 'España' },
        { name: 'Premier League', type: 'liga', level: 'club', nation_name: 'Inglaterra' },
        { name: 'Ligue 1', type: 'liga', level: 'club', nation_name: 'Francia' },
        { name: 'Bundesliga', type: 'liga', level: 'club', nation_name: 'Alemania' },
        { name: 'Champions League', type: 'continental', level: 'club' }, // Sin nación específica
        { name: 'Copa del Rey', type: 'copa', level: 'club', nation_name: 'España' },
        { name: 'FA Cup', type: 'copa', level: 'club', nation_name: 'Inglaterra' },
        { name: 'UEFA Nations League', type: 'internacional', level: 'selección' }, // Sin nación específica
        { name: 'Mundial', type: 'internacional', level: 'selección' }, // Sin nación específica
        { name: 'Eurocopa', type: 'internacional', level: 'selección' } // Sin nación específica
      ];

      console.log('Creating sample teams...');
      for (const team of sampleTeams) {
        try {
          await createTeam(team);
          console.log(`Created team: ${team.name} (${team.nation_name})`);
        } catch (error) {
          console.log(`Team ${team.name} might already exist:`, error.message);
        }
      }

      console.log('Creating sample competitions...');
      for (const competition of sampleCompetitions) {
        try {
          await createCompetition(competition);
          console.log(`Created competition: ${competition.name}`);
        } catch (error) {
          console.log(`Competition ${competition.name} might already exist:`, error.message);
        }
      }

      loadData();
      alert('Datos de ejemplo creados exitosamente');
    } catch (error) {
      console.error('Error creating sample data:', error);
      alert('Error al crear datos de ejemplo');
    }
  };

  if (loading) {
    return <div className="text-white p-6">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Panel Administrativo</h1>
        
        <div className="mb-6">
          <button
            onClick={createSampleData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Crear Datos de Ejemplo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipos */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Equipos ({teams.length})
              </h2>
              <button
                onClick={() => setShowTeamForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nuevo
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between py-2 border-b border-gray-700">
                  <span>{team.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    team.is_national_team ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {team.is_national_team ? 'Selección' : 'Club'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Competiciones */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Competiciones ({competitions.length})
              </h2>
              <button
                onClick={() => setShowCompetitionForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nueva
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {competitions.map((comp) => (
                <div key={comp.id} className="py-2 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <span>{comp.name}</span>
                    <div className="flex space-x-2">
                      <span className="text-xs px-2 py-1 rounded bg-purple-600">
                        {comp.type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-orange-600">
                        {comp.level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario de Equipo */}
        {showTeamForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">Nuevo Equipo</h3>
              <form onSubmit={handleCreateTeam}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <input
                    type="text"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={teamForm.is_national_team}
                      onChange={(e) => setTeamForm({...teamForm, is_national_team: e.target.checked})}
                      className="mr-2"
                    />
                    Es selección nacional
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTeamForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 rounded"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulario de Competición */}
        {showCompetitionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">Nueva Competición</h3>
              <form onSubmit={handleCreateCompetition}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <input
                    type="text"
                    value={competitionForm.name}
                    onChange={(e) => setCompetitionForm({...competitionForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <select
                    value={competitionForm.type}
                    onChange={(e) => setCompetitionForm({...competitionForm, type: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="liga">Liga</option>
                    <option value="copa">Copa</option>
                    <option value="continental">Continental</option>
                    <option value="internacional">Internacional</option>
                    <option value="amistoso">Amistoso</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Nivel</label>
                  <select
                    value={competitionForm.level}
                    onChange={(e) => setCompetitionForm({...competitionForm, level: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="club">Club</option>
                    <option value="selección">Selección</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCompetitionForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 rounded"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 