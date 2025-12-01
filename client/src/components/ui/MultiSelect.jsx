import { useState, useRef, useEffect } from 'react';

const MultiSelect = ({ label, options = [], value = [], onChange, placeholder = 'Select options...', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getSelectedLabels = () => {
    if (value.length === 0) return placeholder;
    const selectedOptions = options.filter((opt) => value.includes(opt.value));
    if (selectedOptions.length <= 2) {
      return selectedOptions.map((opt) => opt.label).join(', ');
    }
    return `${selectedOptions.length} selected`;
  };

  return (
    <div className="mb-4" ref={dropdownRef}>
      {label && (
        <label className="block mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#4361ee] transition-colors bg-white text-left flex items-center justify-between ${className}`}
        >
          <span className={value.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
            {getSelectedLabels()}
          </span>
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-gray-500 text-sm`}></i>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {value.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 border-b border-gray-200 flex items-center gap-2"
              >
                <i className="fas fa-times-circle"></i>
                Clear All
              </button>
            )}
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">No options available</div>
            ) : (
              options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => handleToggle(option.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-900">{option.label}</span>
                </label>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
