import { motion } from 'framer-motion';
import { Target, Trophy, Shield, Zap } from 'lucide-react';

const TopOpponents = ({ opponents }) => {
  if (!opponents || opponents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Target className="w-6 h-6 mr-3 text-red-400" />
          Equipos Favoritos
        </h3>
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No hay datos disponibles</p>
          <p className="text-gray-500 text-sm mt-2">Juega más partidos para ver tus equipos favoritos</p>
        </div>
      </motion.div>
    );
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5" />;
      case 1:
        return <Target className="w-5 h-5" />;
      case 2:
        return <Zap className="w-5 h-5" />;
      default:
        return <span className="text-sm font-bold">{index + 1}</span>;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return {
          bg: 'from-yellow-500 to-yellow-600',
          text: 'text-yellow-900',
          border: 'border-yellow-400',
          glow: 'shadow-yellow-500/50'
        };
      case 1:
        return {
          bg: 'from-gray-400 to-gray-500',
          text: 'text-gray-900',
          border: 'border-gray-300',
          glow: 'shadow-gray-400/50'
        };
      case 2:
        return {
          bg: 'from-amber-600 to-amber-700',
          text: 'text-amber-100',
          border: 'border-amber-500',
          glow: 'shadow-amber-600/50'
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          text: 'text-gray-200',
          border: 'border-gray-500',
          glow: 'shadow-gray-600/30'
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
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg mr-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          Equipos Favoritos
        </h3>
        <p className="text-gray-400 text-sm">
          Equipos contra los que más goles has marcado
        </p>
      </div>
      
      <div className="space-y-4">
        {opponents.map((opponent, index) => {
          const colors = getRankColor(index);
          return (
            <motion.div
              key={opponent.team}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`
                relative bg-gradient-to-r from-gray-800/50 to-gray-900/50 
                p-4 rounded-lg border border-gray-600/50 hover:border-gray-500 
                transition-all duration-300 group hover:shadow-lg
              `}
            >
              {/* Rank Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-xl
                      bg-gradient-to-br ${colors.bg} border-2 ${colors.border}
                      ${colors.text} shadow-lg ${colors.glow}
                      transition-all duration-300
                    `}
                  >
                    {getRankIcon(index)}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">
                      {opponent.team}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-400 text-sm">
                        {opponent.goals === 1 ? '1 gol marcado' : `${opponent.goals} goles marcados`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Goals Display */}
                <div className="text-right">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-lg"
                  >
                    <span className="text-white font-bold text-2xl">
                      {opponent.goals}
                    </span>
                  </motion.div>
                  <p className="text-green-400 text-xs mt-1 font-medium">GOLES</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(opponent.goals / (opponents[0]?.goals || 1)) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                  />
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-cyan-500/10 rounded-lg transition-all duration-300 pointer-events-none" />
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
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">
            Total de equipos enfrentados: <span className="text-white font-semibold">{opponents.length}</span>
          </span>
          <span className="text-gray-400">
            Goles totales: <span className="text-green-400 font-semibold">
              {opponents.reduce((sum, opp) => sum + opp.goals, 0)}
            </span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TopOpponents; 