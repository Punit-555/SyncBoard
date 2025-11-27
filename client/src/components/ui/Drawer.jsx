import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Drawer = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    // Close drawer when route changes
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    // Prevent body scroll when drawer is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
    { path: '/tasks', icon: 'fas fa-tasks', label: 'My Tasks' },
    { path: '/teams', icon: 'fas fa-users', label: 'Teams' },
    { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
    { path: '/help', icon: 'fas fa-question-circle', label: 'Help & Support' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[1000] transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-times text-xl text-gray-600"></i>
          </button>
        </div>

        {/* Drawer Content */}
        <nav className="p-4">
          <ul className="list-none">
            {menuItems.map((item, index) => (
              <li
                key={item.path}
                className="mb-2"
                style={{
                  animation: isOpen ? `slideInRight 0.3s ease-out ${index * 0.05}s both` : 'none',
                }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline transition-all ${
                    location.pathname === item.path
                      ? 'bg-[#4361ee] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center`}></i>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#4895ef] flex items-center justify-center text-white font-semibold">
              <span>JD</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">John Doe</p>
              <p className="text-sm text-gray-500">john@taskflow.com</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Drawer;
