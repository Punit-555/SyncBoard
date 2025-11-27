import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on app load and verify it's still valid
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally verify the token is valid by calling /api/auth/me
      api.getCurrentUser()
        .then((res) => {
          if (res && res.data) {
            setUser(res.data);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
