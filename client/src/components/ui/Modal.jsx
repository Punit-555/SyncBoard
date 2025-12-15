import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-3 md:p-5 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-[500px] shadow-2xl p-4 md:p-6 my-auto animate-scaleIn max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 md:mb-5 sticky top-0 bg-white z-10 pb-2">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl md:text-3xl cursor-pointer text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0 ml-2"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
