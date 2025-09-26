import { motion } from 'framer-motion';
import { Trophy, Target, Users, Star, Calendar, Clock, Award, Zap } from 'lucide-react';

const CompetitionStats = ({ competitions }) => {
  if (!competitions || competitions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-3 text-blue-400" />
          Estadísticas por Competición
        </h3>
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No hay datos disponibles</p>
          <p className="text-gray-500 text-sm mt-2">Juega partidos en diferentes competiciones</p>
        </div>
      </motion.div>
    );
  }

  const formatRating = (rating) => rating ? rating.toFixed(1) : '0.0';
  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getRatingColor = (rating) => {
    if (rating >= 8.5) return 'from-green-500 to-green-600';
    if (rating >= 7.5) return 'from-yellow-500 to-yellow-600';
    if (rating >= 6.5) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getCompetitionIcon = (index) => {
    switch (index % 4) {
      case 0:
        return <Trophy className="w-5 h-5" />;
      case 1:
        return <Award className="w-5 h-5" />;
      case 2:
        return <Star className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getCompetitionColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg mr-3">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          Estadísticas por Competición
        </h3>
        <p className="text-gray-400 text-sm">
          Tu rendimiento en diferentes torneos y ligas
        </p>
      </div>
      
      <div className="space-y-6">
        {competitions.map((competition, index) => {
          const ratingColor = getRatingColor(competition.averageRating);
          const competitionColor = getCompetitionColor(index);
          
          return (
            <motion.div
              key={competition.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="relative bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-gray-600/50 hover:border-gray-500 transition-all duration-300 group hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-xl
                      bg-gradient-to-br ${competitionColor} shadow-lg
                      text-white transition-all duration-300
                    `}
                  >
                    {getCompetitionIcon(index)}
                  </motion.div>
                  
                  <div>
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">
                      {competition.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-400 text-sm">
                        {competition.matches} partidos jugados
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`bg-gradient-to-r ${ratingColor} px-4 py-2 rounded-lg shadow-lg`}
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-lg">
                      {formatRating(competition.averageRating)}
                    </span>
                  </div>
                </motion.div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-blue-500/20 p-4 rounded-lg text-center border border-blue-500/30"
                >
                  <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 font-bold text-xl">{competition.matches}</p>
                  <p className="text-blue-300 text-sm">Partidos</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-green-500/20 p-4 rounded-lg text-center border border-green-500/30"
                >
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-bold text-xl">{competition.goals}</p>
                  <p className="text-green-300 text-sm">Goles</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-purple-500/20 p-4 rounded-lg text-center border border-purple-500/30"
                >
                  <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-400 font-bold text-xl">{competition.assists}</p>
                  <p className="text-purple-300 text-sm">Asistencias</p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-orange-500/20 p-4 rounded-lg text-center border border-orange-500/30"
                >
                  <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <p className="text-orange-400 font-bold text-xl">{formatMinutes(competition.minutes)}</p>
                  <p className="text-orange-300 text-sm">Tiempo</p>
                </motion.div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Goles por partido</p>
                  <p className="text-white font-bold text-lg">
                    {competition.matches > 0 ? (competition.goals / competition.matches).toFixed(1) : '0.0'}
                  </p>
                </div>
                
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Asistencias por partido</p>
                  <p className="text-white font-bold text-lg">
                    {competition.matches > 0 ? (competition.assists / competition.matches).toFixed(1) : '0.0'}
                  </p>
                </div>
                
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="text-gray-400 text-sm">Total G+A</p>
                  <p className="text-cyan-400 font-bold text-lg">
                    {competition.goals + competition.assists}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Rendimiento</span>
                  <span className="text-gray-400 text-sm">{formatRating(competition.averageRating)}/10</span>
                </div>
                <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(competition.averageRating / 10) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r ${ratingColor} rounded-full`}
                  />
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 rounded-xl transition-all duration-300 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 pt-6 border-t border-gray-700"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-400">
              {competitions.length}
            </p>
            <p className="text-gray-400 text-sm">Competiciones</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {competitions.length > 0 ? 
                (competitions.reduce((sum, comp) => sum + comp.averageRating, 0) / competitions.length).toFixed(1) : 
                '0.0'
              }
            </p>
            <p className="text-gray-400 text-sm">Rating Promedio</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {competitions.reduce((sum, comp) => sum + comp.goals, 0)}
            </p>
            <p className="text-gray-400 text-sm">Total Goles</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">
              {competitions.reduce((sum, comp) => sum + comp.assists, 0)}
            </p>
            <p className="text-gray-400 text-sm">Total Asistencias</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompetitionStats; 