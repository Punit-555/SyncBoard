const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-300 inline-flex items-center gap-2 border-none';

  const variants = {
    primary: 'bg-[#4361ee] text-white hover:bg-[#3f37c9]',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    outline: 'bg-transparent border border-[#4361ee] text-[#4361ee] hover:bg-[#4361ee] hover:text-white',
    google: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50',
    danger: 'bg-[#f72585] text-white hover:bg-[#d11d6e]',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
