const Textarea = ({ label, rows = 3, placeholder, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#4361ee] transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  );
};

export default Textarea;
