import { motion } from 'framer-motion';
import { Star, Target, Users, Calendar, Award } from 'lucide-react';

const BestMatches = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Mejores Partidos
          </h3>
        </div>
        <div className="empty-state">
          <Award className="w-12 h-12 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400">No hay datos de partidos</p>
          <p className="text-sm text-gray-500">Juega y registra partidos para ver tus mejores actuaciones.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 9.0) return 'text-green-400';
    if (rating >= 8.0) return 'text-yellow-400';
    if (rating >= 7.0) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          Mejores Partidos
        </h3>
        <p className="card-subtitle">Tus mejores actuaciones según el rating</p>
      </div>
      <div className="space-y-4 p-4">
        {matches.map((match, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-white text-lg">vs {match.opponent}</p>
                <p className="text-sm text-gray-400">{match.competition}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold text-2xl ${getRatingColor(match.rating)}`}>{match.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 border-t border-gray-700 pt-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm text-green-400">
                  <Target size={14} />
                  <strong>{match.goals}</strong> Goles
                </span>
                <span className="flex items-center gap-2 text-sm text-purple-400">
                  <Users size={14} />
                  <strong>{match.assists}</strong> Asist.
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                <span>{formatDate(match.date)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BestMatches; 