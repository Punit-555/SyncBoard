import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Tooltip from '../ui/Tooltip';
import LoadingPopup from '../ui/LoadingPopup';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
    { path: '/tasks', icon: 'fas fa-tasks', label: 'My Tasks' },
    { path: '/teams', icon: 'fas fa-users', label: 'Teams' },
    { path: '/calendar', icon: 'fas fa-calendar-alt', label: 'Calendar' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Reports' },
    { path: '/guide', icon: 'fas fa-book', label: 'Guide' },
    { path: '/help', icon: 'fas fa-question-circle', label: 'Help & Support' },
    { path: '/settings', icon: 'fas fa-cog', label: 'Settings' },
  ];

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <section className="relative ">
      {/* Toggle Button - Outside sidebar */}
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

      {/* Logout Button at Bottom */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        {isCollapsed ? (
          <Tooltip text="Logout" position="right">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center px-5 py-3 text-red-600 hover:bg-red-50 transition-all w-full"
            >
              <i className="fas fa-sign-out-alt text-lg"></i>
            </button>
          </Tooltip>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            <span className="whitespace-nowrap">Logout</span>
          </button>
        )}
      </div>
    </aside>

    <LoadingPopup message="Logging out..." isOpen={isLoggingOut} />
    </section>
  );
};

export default Sidebar;
