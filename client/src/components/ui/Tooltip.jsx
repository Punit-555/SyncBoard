import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children, text, position = 'top' }) => {
  const wrapperRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const show = () => {
      const rect = el.getBoundingClientRect();
      setCoords(rect);
      setVisible(true);
    };
    const hide = () => setVisible(false);

    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);

    return () => {
      el.removeEventListener('mouseenter', show);
      el.removeEventListener('mouseleave', hide);
    };
  }, []);

  const tooltipEl = (
    <span
      className={`fixed z-50 bg-gray-800 text-white text-sm rounded py-2 px-3 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } min-w-[140px] max-w-[260px] wrap-break-word text-center`}
      style={(() => {
        if (!coords) return { visibility: 'hidden' };
        const styles = {};
        if (position === 'top') {
          styles.left = coords.left + coords.width / 2;
          styles.top = coords.top - 8;
          styles.transform = 'translate(-50%, -100%)';
        } else if (position === 'right') {
          styles.left = coords.right + 8;
          styles.top = coords.top + coords.height / 2;
          styles.transform = 'translate(0, -50%)';
        } else if (position === 'bottom') {
          styles.left = coords.left + coords.width / 2;
          styles.top = coords.bottom + 8;
          styles.transform = 'translate(-50%, 0)';
        } else if (position === 'left') {
          styles.left = coords.left - 8;
          styles.top = coords.top + coords.height / 2;
          styles.transform = 'translate(-100%, -50%)';
        }
        return styles;
      })()}
    >
      {text}
    </span>
  );

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      {children}
      {typeof document !== 'undefined' ? createPortal(tooltipEl, document.body) : null}
    </div>
  );
};

export default Tooltip;
