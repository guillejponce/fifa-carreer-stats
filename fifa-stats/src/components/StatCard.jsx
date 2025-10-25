const StatCard = ({ title, value, icon: Icon, subtitle, color = "text-green-400" }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="stat-label">{title}</p>
        <p className={`stat-value ${color}`}>{value}</p>
        {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
      </div>
      {Icon && <Icon className="w-8 h-8 text-gray-400" />}
    </div>
  </div>
);

export default StatCard; 