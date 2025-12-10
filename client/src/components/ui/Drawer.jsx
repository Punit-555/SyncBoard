import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Drawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    { path: '/users', icon: 'fas fa-user-friends', label: 'Users' },
    { path: '/tasks', icon: 'fas fa-tasks', label: 'My Tasks' },
    { path: '/messages', icon: 'fas fa-comments', label: 'Messages' },
    { path: '/teams', icon: 'fas fa-users', label: 'Teams' },
    { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
    { path: '/help', icon: 'fas fa-question-circle', label: 'Help & Support' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1500);
  };

  const getInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.trim() || '';
    const last = user.lastName?.trim() || '';
    if (first && last) {
      return `${first[0]}${last[0]}`.toUpperCase();
    }
    if (first) {
      return first[0].toUpperCase();
    }
    if (last) {
      return last[0].toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

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
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-gray-50">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              <span>{getInitials()}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <i className="fas fa-spinner fa-spin w-5 text-center"></i>
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-out-alt w-5 text-center"></i>
                <span>Logout</span>
              </>
            )}
          </button>
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
