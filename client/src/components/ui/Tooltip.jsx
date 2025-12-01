import React from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
  return (
    <div className="relative flex items-center group">
      {children}
      <span
        className={`
          absolute z-50 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0
          group-hover:opacity-100 transition-opacity duration-300
          ${position === 'top' && 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'}
          ${position === 'right' && 'left-full top-1/2 transform -translate-y-1/2 ml-2'}
          ${position === 'bottom' && 'top-full left-1/2 transform -translate-x-1/2 mt-2'}
          ${position === 'left' && 'right-full top-1/2 transform -translate-y-1/2 mr-2'}
        `}
      >
        {text}
      </span>
    </div>
  );
};

export default Tooltip;
