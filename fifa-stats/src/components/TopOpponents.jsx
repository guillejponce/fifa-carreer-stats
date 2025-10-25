import { motion } from 'framer-motion';
import { Target, Trophy, Shield } from 'lucide-react';

const TopOpponents = ({ opponents }) => {
  if (!opponents || opponents.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Target className="w-5 h-5 mr-2 text-red-400" />
            Rivales Preferidos
          </h3>
        </div>
        <div className="empty-state">
          <Shield className="w-12 h-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400">No hay datos suficientes</p>
          <p className="text-sm text-gray-500">Marca goles para ver a tus rivales preferidos.</p>
        </div>
      </div>
    );
  }

  const getRankColor = (index) => {
    if (index === 0) return 'bg-yellow-500 text-yellow-900';
    if (index === 1) return 'bg-gray-400 text-gray-900';
    if (index === 2) return 'bg-amber-600 text-amber-100';
    return 'bg-gray-700 text-gray-200';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Target className="w-5 h-5 mr-2 text-red-400" />
          Rivales Preferidos
        </h3>
        <p className="card-subtitle">Equipos a los que más goles has marcado</p>
      </div>
      <ul className="divide-y divide-gray-700">
        {opponents.map((opponent, index) => (
          <motion.li
            key={opponent.team}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3"
          >
            <div className="flex items-center gap-4">
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankColor(index)}`}
              >
                {index + 1}
              </span>
              <span className="font-medium text-white">{opponent.team}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-green-400">{opponent.goals}</span>
              <Target size={16} className="text-green-400" />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TopOpponents; 