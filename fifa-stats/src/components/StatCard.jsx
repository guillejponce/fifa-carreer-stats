const StatCard = ({ title, value, icon: Icon, subtitle, color = "text-green-400" }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
      </div>
      {Icon && <Icon className="w-8 h-8 text-gray-400" />}
    </div>
  </div>
);

export default StatCard; 