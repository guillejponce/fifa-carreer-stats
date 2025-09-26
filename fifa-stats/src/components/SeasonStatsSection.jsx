import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Target, Users, Plus, Star, Clock, TrendingUp, CheckCircle, Minus, XCircle } from 'lucide-react';

const SeasonStatsSection = ({ stats }) => {
  if (!stats || stats.matches === 0) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3>No hay estadísticas disponibles para esta temporada.</h3>
      </div>
    );
  }

  const formatRating = (rating) => (rating ? rating.toFixed(1) : '0.0');
  const formatRatio = (ratio) => (ratio ? ratio.toFixed(2) : '0.00');
  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const resultsData = [
    { name: 'Ganados', value: stats.wins || 0, color: '#10b981' },
    { name: 'Empatados', value: stats.draws || 0, color: '#f59e0b' },
    { name: 'Perdidos', value: stats.losses || 0, color: '#ef4444' }
  ];

  const performanceData = [
    { name: 'Goles', value: stats.goals, color: '#10b981' },
    { name: 'Asistencias', value: stats.assists, color: '#8b5cf6' },
    { name: 'Rating x10', value: Math.round(stats.averageRating * 10), color: '#f59e0b' }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
          className={`text-3xl font-bold ${color}`}
        >
          {value}
        </motion.div>
      </div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </motion.div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Estadísticas de la Temporada</h2>
        <p className="text-gray-400">Resumen de tu rendimiento esta campaña</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Partidos Jugados" value={stats.matches} icon={Calendar} color="text-blue-400" delay={0.1} />
        <StatCard
          title="Goles Marcados"
          value={stats.goals}
          subtitle={`${formatRatio(stats.goalsPerMatch)} por partido`}
          icon={Target}
          color="text-green-400"
          delay={0.2}
        />
        <StatCard
          title="Asistencias"
          value={stats.assists}
          subtitle={`${formatRatio(stats.assistsPerMatch)} por partido`}
          icon={Users}
          color="text-purple-400"
          delay={0.3}
        />
        <StatCard
          title="G+A por Partido"
          value={formatRatio(stats.goalsAssistsPerMatch)}
          icon={Plus}
          color="text-cyan-400"
          delay={0.4}
        />
        <StatCard title="Rating Promedio" value={formatRating(stats.averageRating)} icon={Star} color="text-yellow-400" delay={0.5} />
        <StatCard title="Tiempo Jugado" value={formatMinutes(stats.minutes)} icon={Clock} color="text-orange-400" delay={0.6} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results Pie */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
            Distribución de Resultados
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={resultsData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                  {resultsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        {/* Performance Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
            Rendimiento General
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={{ stroke: '#4b5563' }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={{ stroke: '#4b5563' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Results summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl border border-green-700">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-3xl font-bold text-green-400">{stats.wins}</span>
          </div>
          <h4 className="text-green-300 font-semibold mt-2">Partidos Ganados</h4>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-6 rounded-xl border border-yellow-700">
          <div className="flex items-center justify-between">
            <Minus className="w-8 h-8 text-yellow-400" />
            <span className="text-3xl font-bold text-yellow-400">{stats.draws}</span>
          </div>
          <h4 className="text-yellow-300 font-semibold mt-2">Partidos Empatados</h4>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-br from-red-900 to-red-800 p-6 rounded-xl border border-red-700">
          <div className="flex items-center justify-between">
            <XCircle className="w-8 h-8 text-red-400" />
            <span className="text-3xl font-bold text-red-400">{stats.losses}</span>
          </div>
          <h4 className="text-red-300 font-semibold mt-2">Partidos Perdidos</h4>
        </motion.div>
      </div>
    </div>
  );
};

export default SeasonStatsSection;
