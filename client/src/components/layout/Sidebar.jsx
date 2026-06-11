import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Tooltip from '../ui/Tooltip';
import LoadingPopup from '../ui/LoadingPopup';
import ProfileEditModal from '../ui/ProfileEditModal';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user } = useAuth();

  const allMenuItems = {
    USER: [
      { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
      { path: '/tasks', icon: 'fas fa-tasks', label: 'My Tasks' },
      { path: '/projects', icon: 'fas fa-project-diagram', label: 'My Projects' },
      { path: '/messages', icon: 'fas fa-comments', label: 'Messages' },
      { path: '/todos', icon: 'fas fa-sticky-note', label: 'My Todos' },
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
      { path: '/todos', icon: 'fas fa-sticky-note', label: 'My Todos' },
      { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
      { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
      { path: '/help', icon: 'fas fa-question-circle', label: 'Help & Support' },
      { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
    ],
    SUPERADMIN: [
      { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
      { path: '/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
      { path: '/tasks', icon: 'fas fa-tasks', label: 'Tasks' },
      { path: '/users', icon: 'fas fa-user-friends', label: 'Users' },
      { path: '/messages', icon: 'fas fa-comments', label: 'Messages' },
      { path: '/todos', icon: 'fas fa-sticky-note', label: 'My Todos' },
      { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
      { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
      { path: '/queries', icon: 'fas fa-inbox', label: 'Queries & Problems' },
      { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
    ],
  };

  const menuItems = useMemo(() => {
    if (!user || !user.role) return allMenuItems.USER;
    return allMenuItems[user.role] || allMenuItems.USER;
  }, [user]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/login');
    }, 1500);
  };

  return (
    <>
      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r border-gray-100 shrink-0 transition-all duration-300 overflow-y-auto overflow-x-hidden ${
          isCollapsed ? 'w-[72px]' : 'w-56'
        }`}
        style={{ zIndex: 40 }}
      >
        {/* Logo + Toggle row */}
        <div className={`flex items-center h-[57px] border-b border-gray-100 shrink-0 ${isCollapsed ? 'justify-center px-4' : 'justify-between px-4'}`}>
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-[#4361ee] no-underline">
              <div className="bg-linear-to-br from-[#4361ee] to-[#3f37c9] w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0">
                <i className="fas fa-tasks text-xs"></i>
              </div>
              <span>SyncBoard</span>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#4361ee] flex items-center justify-center transition-all shrink-0"
          >
            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
          </button>
        </div>

        {/* Nav items */}
        <ul className="list-none flex-1 py-3">
          {menuItems.map((item) => (
            <li key={item.path} className="mb-0.5">
              {isCollapsed ? (
                <Tooltip text={item.label} position="right">
                  <Link
                    to={item.path}
                    className={`flex items-center justify-center py-3 mx-2 rounded-lg no-underline transition-all ${
                      location.pathname === item.path
                        ? 'bg-[#4361ee]/10 text-[#4361ee]'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-[#4361ee]'
                    }`}
                  >
                    <i className={`${item.icon} text-base`}></i>
                  </Link>
                </Tooltip>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg no-underline transition-all text-sm ${
                    location.pathname === item.path
                      ? 'bg-[#4361ee]/10 text-[#4361ee] font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#4361ee]'
                  }`}
                >
                  <i className={`${item.icon} w-4 text-center text-base`}></i>
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Footer: profile + logout */}
        <div className="mt-auto border-t border-gray-100 py-3">
          {/* Profile */}
          <div className={`mx-2 mb-1 ${isCollapsed ? '' : ''}`}>
            {isCollapsed ? (
              <Tooltip text={`${user?.firstName || 'User'} · ${user?.role || 'USER'}`} position="right">
                <div
                  className="flex flex-col items-center py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#4361ee] to-[#764ba2] flex items-center justify-center text-white font-bold text-xs shadow overflow-hidden">
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
                </div>
              </Tooltip>
            ) : (
              <div
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#4361ee] to-[#764ba2] flex items-center justify-center text-white font-bold text-xs shadow shrink-0 overflow-hidden">
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
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                </div>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                  user?.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' :
                  user?.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {user?.role === 'SUPERADMIN' ? 'SA' : user?.role === 'ADMIN' ? 'Admin' : 'User'}
                </span>
              </div>
            )}
          </div>

          {/* Logout */}
          {isCollapsed ? (
            <Tooltip text="Logout" position="right">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center py-2 mx-2 w-[calc(100%-16px)] rounded-lg text-red-500 hover:bg-red-50 transition-all"
              >
                <i className="fas fa-sign-out-alt text-base"></i>
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 mx-2 w-[calc(100%-16px)] rounded-lg text-red-500 hover:bg-red-50 transition-all text-sm"
            >
              <i className="fas fa-sign-out-alt w-4 text-center"></i>
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      </aside>

      <LoadingPopup message="Logging out..." isOpen={isLoggingOut} />
      <ProfileEditModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};

export default Sidebar;
