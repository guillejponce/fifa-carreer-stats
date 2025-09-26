import { motion } from 'framer-motion';
import { Star, Target, Users, Calendar, Award, Zap, TrendingUp } from 'lucide-react';

const BestMatches = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Star className="w-6 h-6 mr-3 text-yellow-400" />
          Mejores Partidos
        </h3>
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No hay datos disponibles</p>
          <p className="text-gray-500 text-sm mt-2">Juega más partidos para ver tus mejores actuaciones</p>
        </div>
      </motion.div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 9.0) return 'from-green-500 to-green-600';
    if (rating >= 8.0) return 'from-yellow-500 to-yellow-600';
    if (rating >= 7.0) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getRatingIcon = (index) => {
    switch (index) {
      case 0:
        return <Award className="w-5 h-5" />;
      case 1:
        return <Star className="w-5 h-5" />;
      case 2:
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return {
          bg: 'from-yellow-500 to-yellow-600',
          text: 'text-yellow-900',
          border: 'border-yellow-400'
        };
      case 1:
        return {
          bg: 'from-gray-400 to-gray-500',
          text: 'text-gray-900',
          border: 'border-gray-300'
        };
      case 2:
        return {
          bg: 'from-amber-600 to-amber-700',
          text: 'text-amber-100',
          border: 'border-amber-500'
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          text: 'text-gray-200',
          border: 'border-gray-500'
        };
    }
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
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-2 rounded-lg mr-3">
            <Star className="w-6 h-6 text-white" />
          </div>
          Mejores Partidos
        </h3>
        <p className="text-gray-400 text-sm">
          Tus mejores actuaciones por rating
        </p>
      </div>
      
      <div className="space-y-4">
        {matches.map((match, index) => {
          const colors = getRankColor(index);
          const ratingColor = getRatingColor(match.rating);
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="relative bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-5 rounded-xl border border-gray-600/50 hover:border-gray-500 transition-all duration-300 group hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-xl
                      bg-gradient-to-br ${colors.bg} border-2 ${colors.border}
                      ${colors.text} shadow-lg transition-all duration-300
                    `}
                  >
                    {getRatingIcon(index)}
                  </motion.div>
                  
                  {/* Match Info */}
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">
                      vs {match.opponent}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-400 text-sm font-medium">
                        {match.competition}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating Display */}
                <div className="text-right">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`bg-gradient-to-r ${ratingColor} px-4 py-2 rounded-lg shadow-lg`}
                  >
                    <span className="text-white font-bold text-2xl">
                      {match.rating}
                    </span>
                  </motion.div>
                  <p className="text-yellow-400 text-xs mt-1 font-medium">RATING</p>
                </div>
              </div>

              {/* Match Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Fecha</p>
                    <p className="text-white text-sm font-medium">{formatDate(match.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-2 rounded-lg">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Resultado</p>
                    <p className="text-white text-sm font-medium">{match.result}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-lg"
                  >
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold">{match.goals}</span>
                    <span className="text-green-300 text-sm">Goles</span>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center space-x-2 bg-purple-500/20 px-3 py-2 rounded-lg"
                  >
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 font-bold">{match.assists}</span>
                    <span className="text-purple-300 text-sm">Asistencias</span>
                  </motion.div>
                </div>

                {/* G+A Badge */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-1 rounded-full"
                >
                  <span className="text-white font-bold text-sm">
                    {match.goals + match.assists} G+A
                  </span>
                </motion.div>
              </div>

              {/* Performance Bar */}
              <div className="mt-4">
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(match.rating / 10) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r ${ratingColor} rounded-full`}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-gray-500">Rendimiento</span>
                  <span className="text-gray-400">{match.rating}/10</span>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:to-yellow-500/10 rounded-xl transition-all duration-300 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 pt-4 border-t border-gray-700"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {matches.length > 0 ? (matches.reduce((sum, match) => sum + match.rating, 0) / matches.length).toFixed(1) : '0.0'}
            </p>
            <p className="text-gray-400 text-sm">Rating Promedio</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {matches.reduce((sum, match) => sum + match.goals, 0)}
            </p>
            <p className="text-gray-400 text-sm">Goles Totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">
              {matches.reduce((sum, match) => sum + match.assists, 0)}
            </p>
            <p className="text-gray-400 text-sm">Asistencias Totales</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BestMatches; 