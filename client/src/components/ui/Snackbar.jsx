import { useEffect } from 'react';

/**
 * Snackbar Component
 *
 * A toast notification component for displaying success, error, warning, and info messages.
 *
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - Type of message: 'success', 'error', 'warning', 'info'
 * @param {boolean} props.open - Controls visibility of the snackbar
 * @param {function} props.onClose - Callback function when snackbar closes
 * @param {number} props.duration - Duration in milliseconds before auto-close (default: 5000)
 * @param {string} props.position - Position of snackbar: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
 */
const Snackbar = ({
  message,
  type = 'info',
  open = false,
  onClose,
  duration = 5000,
  position = 'top-right',
}) => {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-500',
      icon: 'fas fa-check-circle',
      border: 'border-green-600',
    },
    error: {
      bg: 'bg-red-500',
      icon: 'fas fa-times-circle',
      border: 'border-red-600',
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: 'fas fa-exclamation-triangle',
      border: 'border-yellow-600',
    },
    info: {
      bg: 'bg-blue-500',
      icon: 'fas fa-info-circle',
      border: 'border-blue-600',
    },
  };

  const positionStyles = {
    'top-right': 'top-5 right-5',
    'top-left': 'top-5 left-5',
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
    'top-center': 'top-5 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2',
  };

  const currentType = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`fixed ${positionStyles[position]} z-[9999] animate-slide-in`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`${currentType.bg} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md border-l-4 ${currentType.border}`}
      >
        <i className={`${currentType.icon} text-xl flex-shrink-0`}></i>
        <span className="flex-1 text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 hover:bg-white/20 rounded p-1 transition-colors"
            aria-label="Close notification"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Snackbar;
