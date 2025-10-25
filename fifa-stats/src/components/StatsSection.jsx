import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Users, Star, Clock, AlertTriangle, Calendar, CheckCircle, XCircle, Minus, Plus, TrendingUp } from 'lucide-react';

const StatsSection = ({ stats }) => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Trophy, color: '#00a8cc' },
    { id: 'club', label: 'Club', icon: Users, color: '#28a745' },
    { id: 'national', label: 'Selección', icon: Star, color: '#ffc107' }
  ];

  const formatRating = (rating) => rating ? rating.toFixed(1) : '0.0';
  const formatRatio = (ratio) => ratio ? ratio.toFixed(2) : '0.00';
  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCurrentStats = () => {
    return stats[activeTab];
  };

  const currentStats = getCurrentStats();

  // Datos para el gráfico de resultados
  const resultsData = [
    { name: 'Ganados', value: currentStats.wins || 0, color: '#10b981' },
    { name: 'Empatados', value: currentStats.draws || 0, color: '#f59e0b' },
    { name: 'Perdidos', value: currentStats.losses || 0, color: '#ef4444' }
  ];

  // Datos para el gráfico de barras de rendimiento
  const performanceData = [
    {
      name: 'Goles',
      value: activeTab === 'general' ? currentStats.totalGoals : currentStats.goals,
      color: '#10b981'
    },
    {
      name: 'Asistencias',
      value: activeTab === 'general' ? currentStats.totalAssists : currentStats.assists,
      color: '#8b5cf6'
    },
    {
      name: 'Rating x10',
      value: Math.round(currentStats.averageRating * 10),
      color: '#f59e0b'
    }
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
      {subtitle && (
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
      )}
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
      {/* Header con título */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Estadísticas de Carrera</h2>
        <p className="text-gray-400">Resumen completo de tu rendimiento</p>
      </motion.div>

      {/* Tabs mejorados */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="bg-gray-800 p-2 rounded-xl border border-gray-700 inline-flex space-x-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: tab.color }}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10 font-semibold">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Stats Grid Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Partidos Jugados"
              value={activeTab === 'general' ? currentStats.totalMatches : currentStats.matches}
              icon={Calendar}
              color="text-blue-400"
              delay={0.1}
            />
            <StatCard
              title="Goles Marcados"
              value={activeTab === 'general' ? currentStats.totalGoals : currentStats.goals}
              subtitle={`${formatRatio(currentStats.goalsPerMatch)} por partido`}
              icon={Target}
              color="text-green-400"
              delay={0.2}
            />
            <StatCard
              title="Asistencias"
              value={activeTab === 'general' ? currentStats.totalAssists : currentStats.assists}
              subtitle={`${formatRatio(currentStats.assistsPerMatch)} por partido`}
              icon={Users}
              color="text-purple-400"
              delay={0.3}
            />
            <StatCard
              title="G+A por Partido"
              value={formatRatio(currentStats.goalsAssistsPerMatch)}
              icon={Plus}
              color="text-cyan-400"
              delay={0.4}
            />
            <StatCard
              title="Rating Promedio"
              value={formatRating(currentStats.averageRating)}
              icon={Star}
              color="text-yellow-400"
              delay={0.5}
            />
            <StatCard
              title="Tiempo Jugado"
              value={formatMinutes(activeTab === 'general' ? currentStats.totalMinutes : currentStats.minutes)}
              icon={Clock}
              color="text-orange-400"
              delay={0.6}
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Resultados */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="chart-card"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
                Distribución de Resultados
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={resultsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {resultsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                {resultsData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-300 text-sm">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Gráfico de Rendimiento */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Rendimiento General
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      axisLine={{ stroke: '#4b5563' }}
                    />
                    <YAxis 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                      axisLine={{ stroke: '#4b5563' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      radius={[4, 4, 0, 0]}
                      fill={(entry) => entry.color}
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Resultados detallados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Resultados de Partidos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl border border-green-700"
              >
                <div className="flex items-center justify-between">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <span className="text-3xl font-bold text-green-400">{currentStats.wins || 0}</span>
                </div>
                <h4 className="text-green-300 font-semibold mt-2">Partidos Ganados</h4>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-6 rounded-xl border border-yellow-700"
              >
                <div className="flex items-center justify-between">
                  <Minus className="w-8 h-8 text-yellow-400" />
                  <span className="text-3xl font-bold text-yellow-400">{currentStats.draws || 0}</span>
                </div>
                <h4 className="text-yellow-300 font-semibold mt-2">Partidos Empatados</h4>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-red-900 to-red-800 p-6 rounded-xl border border-red-700"
              >
                <div className="flex items-center justify-between">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <span className="text-3xl font-bold text-red-400">{currentStats.losses || 0}</span>
                </div>
                <h4 className="text-red-300 font-semibold mt-2">Partidos Perdidos</h4>
              </motion.div>
            </div>
          </motion.div>

          {/* Tarjetas (si existen) */}
          {(currentStats.totalYellowCards > 0 || currentStats.totalRedCards > 0 || 
            currentStats.yellowCards > 0 || currentStats.redCards > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Tarjetas Recibidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-6 rounded-xl border border-yellow-700"
                >
                  <div className="flex items-center justify-between">
                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    <span className="text-3xl font-bold text-yellow-400">
                      {activeTab === 'general' ? currentStats.totalYellowCards : currentStats.yellowCards}
                    </span>
                  </div>
                  <h4 className="text-yellow-300 font-semibold mt-2">Tarjetas Amarillas</h4>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-red-900 to-red-800 p-6 rounded-xl border border-red-700"
                >
                  <div className="flex items-center justify-between">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <span className="text-3xl font-bold text-red-400">
                      {activeTab === 'general' ? currentStats.totalRedCards : currentStats.redCards}
                    </span>
                  </div>
                  <h4 className="text-red-300 font-semibold mt-2">Tarjetas Rojas</h4>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StatsSection; 