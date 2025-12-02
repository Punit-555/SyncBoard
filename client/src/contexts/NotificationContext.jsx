import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../utils/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const pollingIntervalRef = useRef(null);
  const previousUnreadCountRef = useRef(0);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      const response = await api.getUnreadCount();
      if (response.success) {
        const newCount = response.data?.count || 0;
        setUnreadCount(newCount);
        return newCount;
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, [user?.userId]);

  // Poll for unread messages
  useEffect(() => {
    if (!user?.userId) return;

    // Fetch immediately
    fetchUnreadCount();

    // Set up polling every 5 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [user?.userId, fetchUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
