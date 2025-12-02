import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as api from '../../utils/api';
import useAudio from '../../hooks/useAudio';

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { playReceiveSound } = useAudio();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const previousUnreadCountRef = useRef(0);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Poll for unread messages
  useEffect(() => {
    if (!user?.userId) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await api.getUnreadCount();
        if (response.success) {
          const newCount = response.data?.count || 0;
          
          // Play sound if unread count increased
          if (newCount > previousUnreadCountRef.current) {
            playReceiveSound();
          }
          
          previousUnreadCountRef.current = newCount;
          setUnreadCount(newCount);
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    // Fetch immediately
    fetchUnreadCount();

    // Set up polling every 5 seconds
    pollingIntervalRef.current = setInterval(fetchUnreadCount, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [user?.userId]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.getConversations();
        if (response.success) {
          // Filter conversations with unread messages and get latest messages
          const unreadConversations = (response.data || [])
            .filter(conv => conv.unreadCount > 0)
            .slice(0, 5) // Show only top 5
            .map(conv => ({
              userId: conv.user.id,
              userName: `${conv.user.firstName} ${conv.user.lastName}`,
              userProfile: conv.user.profilePicture,
              lastMessage: conv.lastMessage?.content || '📎 File attachment',
              unreadCount: conv.unreadCount,
              timestamp: conv.lastMessage?.createdAt
            }));
          
          setNotifications(unreadConversations);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
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

  const handleNotificationClick = (userId) => {
    navigate(`/messages?userId=${userId}`);
    setIsOpen(false);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
        title="Message Notifications"
      >
        <i className="fas fa-bell text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-linear-to-r from-blue-600 to-purple-600 rounded-t-lg">
            <h3 className="text-white font-semibold flex items-center justify-between">
              <span>
                <i className="fas fa-bell mr-2"></i>
                Messages
              </span>
              {unreadCount > 0 && (
                <span className="bg-white text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </h3>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <i className="fas fa-check-circle text-3xl mb-2 text-gray-300"></i>
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs mt-1">No new messages</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.userId}
                  onClick={() => handleNotificationClick(notif.userId)}
                  className="p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
                      {notif.userProfile ? (
                        <img
                          src={`${API_BASE}${notif.userProfile}`}
                          alt={notif.userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{notif.userName.charAt(0)}</span>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">
                          {notif.userName}
                        </h4>
                        {notif.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 shrink-0 ml-2 font-bold">
                            {notif.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{notif.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(notif.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - View All */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  navigate('/messages');
                  setIsOpen(false);
                }}
                className="w-full py-2 text-center text-blue-600 hover:text-blue-700 font-semibold text-sm hover:bg-blue-50 rounded transition-colors"
              >
                View All Messages
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
