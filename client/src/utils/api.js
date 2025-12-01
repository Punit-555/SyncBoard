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

// Generic HTTP methods
export const get = (path) => request(path, null, 'GET');
export const post = (path, payload) => request(path, payload, 'POST');
export const put = (path, payload) => request(path, payload, 'PUT');
export const del = (path) => request(path, null, 'DELETE');

// Auth endpoints
export const signup = (payload) => request('/api/auth/signup', payload, 'POST');
export const login = (payload) => request('/api/auth/login', payload, 'POST');
export const forgotPassword = (payload) => request('/api/auth/forgot-password', payload, 'POST');
export const validateResetToken = (token) => request('/api/auth/validate-reset-token', { token }, 'POST');
export const resetPassword = (payload) => request('/api/auth/reset-password', payload, 'POST');
export const getCurrentUser = () => request('/api/auth/me', null, 'GET');
export const updateUserProfile = (payload) => request('/api/auth/user-update', payload, 'PUT');
export const deleteAccount = () => request('/api/auth/delete-account', null, 'DELETE');

// Task endpoints
export const getTasks = () => request('/api/tasks', null, 'GET');
export const getTaskById = (id) => request(`/api/tasks/${id}`, null, 'GET');
export const createTask = (payload) => request('/api/tasks', payload, 'POST');
export const updateTask = (id, payload) => request(`/api/tasks/${id}`, payload, 'PUT');
export const deleteTask = (id) => request(`/api/tasks/${id}`, null, 'DELETE');

// User endpoints
export const getUsers = () => request('/api/users', null, 'GET');

// Project endpoints
export const getProjects = () => request('/api/projects', null, 'GET');
export const getProjectById = (id) => request(`/api/projects/${id}`, null, 'GET');
export const createProject = (payload) => request('/api/projects', payload, 'POST');
export const updateProject = (id, payload) => request(`/api/projects/${id}`, payload, 'PUT');
export const deleteProject = (id) => request(`/api/projects/${id}`, null, 'DELETE');

export default {
  get,
  post,
  put,
  delete: del,
  signup,
  login,
  forgotPassword,
  validateResetToken,
  resetPassword,
  getCurrentUser,
  updateUserProfile,
  deleteAccount,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getUsers,
};
