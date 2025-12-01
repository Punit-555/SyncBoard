const Select = ({ label, options, className = '', children, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#4361ee] transition-colors ${className}`}
        {...props}
      >
        {options
          ? options.map((option, index) => (
              <option key={index} value={option.value || option}>
                {option.label || option}
              </option>
            ))
          : children}
      </select>
    </div>
  );
};

export default Select;
