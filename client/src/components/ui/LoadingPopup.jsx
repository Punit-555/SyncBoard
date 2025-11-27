const LoadingPopup = ({ message = 'Loading...', isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-scaleIn min-w-[250px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#4361ee]/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#4361ee] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-800 font-semibold text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
