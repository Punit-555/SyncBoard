import { useState, useCallback } from 'react';

/**
 * Custom hook for managing snackbar state
 *
 * @returns {Object} Object containing snackbar state and control functions
 */
export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'info',
  });

  const showSnackbar = useCallback((message, type = 'info') => {
    setSnackbar({
      open: true,
      message,
      type,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const showSuccess = useCallback((message) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  const showError = useCallback((message) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  const showWarning = useCallback((message) => {
    showSnackbar(message, 'warning');
  }, [showSnackbar]);

  const showInfo = useCallback((message) => {
    showSnackbar(message, 'info');
  }, [showSnackbar]);

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
