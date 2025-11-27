const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, body, method = 'POST') {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'API error');
    err.response = data;
    throw err;
  }
  return data;
}

export const signup = (payload) => request('/api/auth/signup', payload, 'POST');
export const login = (payload) => request('/api/auth/login', payload, 'POST');
export const forgotPassword = (payload) => request('/api/auth/forgot-password', payload, 'POST');
export const validateResetToken = (token) => request('/api/auth/validate-reset-token', { token }, 'POST');
export const resetPassword = (payload) => request('/api/auth/reset-password', payload, 'POST');
export const getCurrentUser = () => request('/api/auth/me', null, 'GET');

export default {signup, login, forgotPassword, validateResetToken, resetPassword, getCurrentUser};
