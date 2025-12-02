import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Tooltip from '../ui/Tooltip';
import LoadingPopup from '../ui/LoadingPopup';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useAuth();

  const allMenuItems = {
    USER: [
      { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
      { path: '/tasks', icon: 'fas fa-tasks', label: 'My Tasks' },
      { path: '/projects', icon: 'fas fa-project-diagram', label: 'My Projects' },
      { path: '/messages', icon: 'fas fa-comments', label: 'Messages' },
      { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
      { path: '/help', icon: 'fas fa-question-circle', label: 'Help & Support' },
      { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
    ],
    ADMIN: [
      { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
      { path: '/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
      { path: '/tasks', icon: 'fas fa-tasks', label: 'Tasks' },
      { path: '/users', icon: 'fas fa-user-friends', label: 'Users' },
      { path: '/messages', icon: 'fas fa-comments', label: 'Messages' },
      { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
      { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
      { path: '/help', icon: 'fas fa-question-circle', label: 'Help & Support' },
      { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
    ],
    SUPERADMIN: [
      { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { path: '/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
      { path: '/users', icon: 'fas fa-user-friends', label: 'Users' },
      { path: '/messages', icon: 'fas fa-comments', label: 'Messages' },
      { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
      { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
      { path: '/help', icon: 'fas fa-question-circle', label: 'Help & Support' },
      { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
    ],
  };

  const menuItems = useMemo(() => {
    if (!user || !user.role) {
      return allMenuItems.USER;
    }
    return allMenuItems[user.role] || allMenuItems.USER;
  }, [user]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <section className="relative ">
      <button
        onClick={onToggle}
        className={`fixed top-[100px] w-6 h-6 bg-[#4361ee] text-white rounded-full md:flex hidden items-center justify-center hover:bg-[#3f37c9] transition-all duration-300 shadow-lg z-101 ${
          isCollapsed ? 'left-[88px]' : 'left-[200px] top-5'
        }`}
      >
        <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
      </button>

      <aside
        className={`bg-white shadow-md py-5 m-6 rounded-3xl transition-all duration-300 md:block hidden fixed left-0 top-20 h-[calc(100vh-70px)] overflow-y-auto flex flex-col ${
          isCollapsed ? 'w-20' : 'w-48'
        }`}
      >

      <ul className="list-none flex-1">
        {menuItems.map((item) => (
          <li key={item.path} className="mb-1">
            {isCollapsed ? (
              <Tooltip text={item.label} position="right">
                <Link
                  to={item.path}
                  className={`flex items-center justify-center px-5 py-3 no-underline transition-all ${
                    location.pathname === item.path
                      ? 'bg-[#4361ee]/10 text-[#4361ee] border-r-4 border-[#4361ee]'
                      : 'text-gray-600 hover:bg-[#4361ee]/10 hover:text-[#4361ee]'
                  }`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                </Link>
              </Tooltip>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 no-underline transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#4361ee]/10 text-[#4361ee] border-r-4 border-[#4361ee]'
                    : 'text-gray-600 hover:bg-[#4361ee]/10 hover:text-[#4361ee]'
                }`}
              >
                <i className={`${item.icon} w-5 text-center`}></i>
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4 border-t border-gray-200">
        {/* User Profile Section */}
        <div className="px-3 py-3 mb-2">
          {isCollapsed ? (
            <Tooltip text={`${user?.firstName || 'User'} - ${user?.role || 'USER'}`} position="right">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4361ee] to-[#764ba2] flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden">
                  {user?.profilePicture ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profilePicture}`}
                      alt={`${user?.firstName} ${user?.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}</span>
                  )}
                </div>
                <div className="mt-2">
                  {user?.role === 'SUPERADMIN' && (
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  )}
                  {user?.role === 'ADMIN' && (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  )}
                  {user?.role === 'USER' && (
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  )}
                </div>
              </div>
            </Tooltip>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4361ee] to-[#764ba2] flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden">
                  {user?.profilePicture ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.profilePicture}`}
                      alt={`${user?.firstName} ${user?.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
              </div>
              <div className="flex justify-center">
                {user?.role === 'SUPERADMIN' && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                    <i className="fas fa-crown"></i>
                    Super Admin
                  </span>
                )}
                {user?.role === 'ADMIN' && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                    <i className="fas fa-user-shield"></i>
                    Admin
                  </span>
                )}
                {user?.role === 'USER' && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 flex items-center gap-1">
                    <i className="fas fa-user"></i>
                    User
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {isCollapsed ? (
          <Tooltip text="Logout" position="right">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-5 py-3 text-red-600 hover:bg-red-50 transition-all w-full rounded-lg"
            >
              <i className="fas fa-sign-out-alt text-lg"></i>
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-all w-full rounded-lg mx-2"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            <span className="whitespace-nowrap font-medium">Logout</span>
          </button>
        )}
      </div>
    </aside>

    <LoadingPopup message="Logging out..." isOpen={isLoggingOut} />
    </section>
  );
};

export default Sidebar;
