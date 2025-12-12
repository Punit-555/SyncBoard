const API_BASE = import.meta.env.VITE_API_URL || 'https://syncboard-2397.onrender.com';

async function request(path, body, method = 'POST') {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  console.log(`[API] ${method} ${path}`, { hasToken: !!token, apiBase: API_BASE });

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`[API Error] ${method} ${path}`, { status: res.status, data });
      const err = new Error(data.message || 'API error');
      err.response = data;
      err.status = res.status;
      throw err;
    }

    console.log(`[API Success] ${method} ${path}`, { status: res.status });
    return data;
  } catch (error) {
    console.error(`[API Exception] ${method} ${path}`, error);
    throw error;
  }
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
export const getAllUsers = () => request('/api/users', null, 'GET');

// Profile picture upload (uses FormData, not JSON)
export const uploadProfilePicture = async (file) => {
  console.log('📸 API: Uploading profile picture...');
  console.log('📸 API: File name:', file.name);
  console.log('📸 API: File type:', file.type);
  console.log('📸 API: File size:', file.size);
  console.log('📸 API: Upload URL:', `${API_BASE}/api/users/profile-picture`);

  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('profilePicture', file);

  console.log('📸 API: FormData created, sending request...');

  const res = await fetch(`${API_BASE}/api/users/profile-picture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  console.log('📸 API: Response status:', res.status);
  console.log('📸 API: Response ok:', res.ok);

  const data = await res.json().catch(() => ({}));
  console.log('📸 API: Response data:', data);

  if (!res.ok) {
    console.error('❌ API: Upload failed with status:', res.status);
    console.error('❌ API: Error data:', data);
    const err = new Error(data.message || 'Upload failed');
    err.response = data;
    throw err;
  }

  console.log('✅ API: Upload successful');
  return data;
};

export const deleteProfilePicture = () => request('/api/users/profile-picture', null, 'DELETE');

// Project endpoints
export const getProjects = () => request('/api/projects', null, 'GET');
export const getAllProjects = () => request('/api/projects', null, 'GET');
export const getProjectById = (id) => request(`/api/projects/${id}`, null, 'GET');
export const createProject = (payload) => request('/api/projects', payload, 'POST');
export const updateProject = (id, payload) => request(`/api/projects/${id}`, payload, 'PUT');
export const deleteProject = (id) => request(`/api/projects/${id}`, null, 'DELETE');
export const addUserToProject = (projectId, userId) => request(`/api/projects/${projectId}/users`, { userId }, 'POST');

// Message endpoints
export const getConversations = () => request('/api/messages/conversations', null, 'GET');
export const getMessages = (otherUserId) => request(`/api/messages/${otherUserId}`, null, 'GET');
export const getUnreadCount = () => request('/api/messages/unread/count', null, 'GET');
export const markMessageAsRead = (id) => request(`/api/messages/${id}/read`, null, 'PATCH');
export const deleteMessage = (id) => request(`/api/messages/${id}`, null, 'DELETE');

// Send message with attachments
export const sendMessage = async (formData) => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Failed to send message');
    err.response = data;
    throw err;
  }
  return data;
};

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
  getProjects,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getConversations,
  getMessages,
  getUnreadCount,
  markMessageAsRead,
  deleteMessage,
  sendMessage,
  uploadProfilePicture,
  deleteProfilePicture,
};
