import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Loader from '../components/ui/Loader';
import { useSnackbar } from '../utils/useSnackbar';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    managerId: '',
    projectIds: [],
  });
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  useEffect(() => {
    console.log('Current User:', currentUser);
    console.log('Current User Role:', currentUser?.role);
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      if (response.success) {
        setProjects(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await api.post('/api/users', formData);
      if (response.success) {
        showSnackbar('✅ User created successfully! Password sent to email.', 'success');
        setIsCreateModalOpen(false);
        await fetchUsers();
        resetForm();
      } else {
        showSnackbar(response.message || 'Failed to create user', 'error');
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to create user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const updateData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        managerId: formData.managerId || null,
        projectIds: formData.projectIds,
      };
      const response = await api.put(`/api/users/${editingUser.id}`, updateData);
      if (response.success) {
        showSnackbar('✅ User updated successfully! Notification email sent.', 'success');
        setIsEditModalOpen(false);
        await fetchUsers();
        resetForm();
      } else {
        showSnackbar(response.message || 'Failed to update user', 'error');
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to update user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await api.delete(`/api/users/${userId}`);
      if (response.success) {
        showSnackbar('✅ User deleted successfully! Notification email sent.', 'success');
        await fetchUsers();
      } else {
        showSnackbar(response.message || 'Failed to delete user', 'error');
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete user', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      managerId: user.managerId || '',
      projectIds: user.projects?.map((p) => p.project.id) || [],
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'USER',
      managerId: '',
      projectIds: [],
    });
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setFormData((prev) => ({ ...prev, projectIds: selectedOptions }));
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users and their permissions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <i className="fas fa-plus mr-2"></i>
          Create User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName?.[0] || 'U'}
                        {user.lastName?.[0] || ''}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.manager ? `${user.manager.firstName} ${user.manager.lastName}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.projects?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.projects.slice(0, 2).map((p) => (
                          <span key={p.id} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {p.project.name}
                          </span>
                        ))}
                        {user.projects.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{user.projects.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {/* Admin can only edit/delete USER role, not ADMIN or SUPERADMIN */}
                    {currentUser?.role === 'ADMIN' && (user.role === 'ADMIN' || user.role === 'SUPERADMIN') ? (
                      <div className="flex gap-3">
                        <span className="text-gray-400 cursor-not-allowed" title="Cannot edit Admin/SuperAdmin users">
                          <i className="fas fa-edit"></i>
                        </span>
                        <span className="text-gray-400 cursor-not-allowed" title="Cannot delete Admin/SuperAdmin users">
                          <i className="fas fa-trash"></i>
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit user"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete user"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
            <i className="fas fa-info-circle mr-2"></i>
            A random password will be generated and sent to the user's email
          </div>
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="USER">User</option>
            {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN') && (
              <option value="ADMIN">Admin</option>
            )}
            {currentUser?.role === 'SUPERADMIN' && <option value="SUPERADMIN">Super Admin</option>}
          </Select>
          <Select
            label="Manager (Optional)"
            name="managerId"
            value={formData.managerId}
            onChange={handleInputChange}
          >
            <option value="">No Manager</option>
            {users
              .filter((u) => u.role === 'ADMIN' || u.role === 'SUPERADMIN')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Projects (Optional)
            </label>
            <select
              multiple
              value={formData.projectIds}
              onChange={handleProjectSelection}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              size="4"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Edit User"
      >
        <form onSubmit={handleEditUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="USER">User</option>
            {(currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN') && (
              <option value="ADMIN">Admin</option>
            )}
            {currentUser?.role === 'SUPERADMIN' && <option value="SUPERADMIN">Super Admin</option>}
          </Select>
          <Select
            label="Manager (Optional)"
            name="managerId"
            value={formData.managerId}
            onChange={handleInputChange}
          >
            <option value="">No Manager</option>
            {users
              .filter((u) => u.role === 'ADMIN' || u.role === 'SUPERADMIN')
              .filter((u) => u.id !== editingUser?.id)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Projects (Optional)
            </label>
            <select
              multiple
              value={formData.projectIds}
              onChange={handleProjectSelection}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              size="4"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
