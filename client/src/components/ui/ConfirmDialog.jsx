const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scaleIn">
        <div className={`px-6 py-5 border-b border-gray-200 ${
          type === 'danger' ? 'bg-red-50' : 'bg-blue-50'
        } rounded-t-xl`}>
          <h3 className={`text-xl font-bold ${
            type === 'danger' ? 'text-red-800' : 'text-blue-800'
          }`}>
            {type === 'danger' ? '⚠️ ' : 'ℹ️ '}{title}
          </h3>
        </div>

        <div className="px-6 py-5">
          <p className="text-gray-700 text-base leading-relaxed">
            {message}
          </p>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-lg transition-colors font-medium text-white ${
              type === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
