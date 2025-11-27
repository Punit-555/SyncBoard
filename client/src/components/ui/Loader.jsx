const Loader = ({ fullScreen = false }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#4361ee] rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-10">
      {loaderContent}
    </div>
  );
};

export default Loader;
