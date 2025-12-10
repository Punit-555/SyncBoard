import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as api from '../../utils/api';
import LoadingPopup from './LoadingPopup';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ onEditProfile }) => {
  const { user: authUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.getCurrentUser();
        console.log("res", response);
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      window.location.href = '/login';
    }, 1500);
  };

  const getInitials = () => {
  if (!user) return "U";

  const first = user.firstName?.trim() || "";
  const last = user.lastName?.trim() || "";

  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  if (first) {
    return first[0].toUpperCase();
  }

  if (last) {
    return last[0].toUpperCase();
  }

  return user.email?.charAt(0).toUpperCase() || "U";
};

  const getFullName = () => {
    if (!user) return 'User';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || user.email;
  };

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        onMouseEnter={() => !isLoading && setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 cursor-pointer hover:border-blue-200 transition-all group relative"
        title={`${getFullName()} (${user?.email || ''})`}
      >
        {isLoading ? (
          <i className="fas fa-spinner fa-spin text-sm"></i>
        ) : (
          <>
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#4361ee] to-[#764ba2] flex items-center justify-center text-white font-bold shadow-md overflow-hidden ring-2 ring-transparent group-hover:ring-blue-300 transition-all">
                {user?.profilePicture ? (
                  <img
                    src={`${API_BASE}${user.profilePicture}`}
                    alt={getFullName()}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span>${getInitials()}</span>`;
                    }}
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-lg">
                <div className="font-semibold">{getFullName()}</div>
                <div className="text-gray-300 text-xs">{user?.role || 'User'}</div>
                {/* Arrow */}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-scaleIn z-[200]">
          {/* User Info Section */}
          <div className="bg-linear-to-br from-[#4361ee] to-[#4895ef] p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg border-2 border-white/30 overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={`${API_BASE}${user.profilePicture}`}
                    alt={getFullName()}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">{getFullName()}</h3>
                <p className="text-white/80 text-xs truncate">{user?.email || 'Loading...'}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onEditProfile?.();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <i className="fas fa-user-edit text-[#4361ee]"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Edit Profile</p>
                <p className="text-xs text-gray-500">Update your information</p>
              </div>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <i className="fas fa-cog text-purple-600"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Settings</p>
                <p className="text-xs text-gray-500">Preferences & notifications</p>
              </div>
            </button>

            <div className="h-px bg-gray-100 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100">
                <i className="fas fa-sign-out-alt text-red-600"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600">Logout</p>
                <p className="text-xs text-gray-500">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      )}

      <LoadingPopup message="Logging out..." isOpen={isLoggingOut} />
    </div>
  );
};

export default ProfileDropdown;
