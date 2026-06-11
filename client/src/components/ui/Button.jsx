const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', loading = false, disabled = false, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 inline-flex items-center gap-2 justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    primary: 'bg-[#4361ee] text-white border-none shadow-sm hover:bg-[#3a53d4] hover:shadow-md active:bg-[#3448bd] focus-visible:ring-[#4361ee]/50',
    secondary: 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-300',
    outline: 'bg-transparent border border-[#4361ee] text-[#4361ee] hover:bg-[#4361ee]/5 focus-visible:ring-[#4361ee]/50',
    google: 'bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50',
    danger: 'bg-red-600 text-white border-none shadow-sm hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {loading && <i className="fas fa-spinner fa-spin"></i>}
      <span className={`${loading ? 'opacity-80' : ''}`}>{children}</span>
    </button>
  );
};

export default Button;
