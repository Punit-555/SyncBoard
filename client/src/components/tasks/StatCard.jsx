const StatCard = ({ icon, count, label, color = 'blue' }) => {
  const colors = {
    blue: 'bg-[#4361ee]',
    green: 'bg-[#4ade80]',
    orange: 'bg-[#f8961e]',
    pink: 'bg-[#f72585]',
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-md flex items-center gap-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl transition-transform duration-300 hover:scale-110 ${colors[color]}`}
      >
        <i className={icon}></i>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-1 text-gray-800">{count}</h3>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
