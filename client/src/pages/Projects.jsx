import { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../utils/api';
import { useSnackbar } from '../utils/useSnackbar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { useAuth } from '../hooks/useAuth';

const Projects = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isRemoveUserDialogOpen, setIsRemoveUserDialogOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      showError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'active'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
        showSuccess('Project updated successfully');
      } else {
        await createProject(formData);
        showSuccess('Project created successfully');
      }

      fetchProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save project:', error);
      showError(error.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete.id);
      showSuccess('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      showError(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleRemoveUserFromProject = (projectId, userId, firstName, lastName, projectName) => {
    setUserToRemove({ projectId, userId, firstName, lastName, projectName });
    setIsRemoveUserDialogOpen(true);
  };

  const confirmRemoveUser = async () => {
    if (!userToRemove) return;

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${userToRemove.projectId}/users/${userToRemove.userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        showSuccess(`${userToRemove.firstName} ${userToRemove.lastName} removed from project successfully`);
        fetchProjects();
      } else {
        showError(data.message || 'Failed to remove user from project');
      }
    } catch (error) {
      console.error('Failed to remove user from project:', error);
      showError('Failed to remove user from project');
    }
  };

  const toggleExpandProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            {isAdmin ? 'Manage all projects' : 'View your assigned projects'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()}>
            Create New Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No projects found</p>
          {isAdmin && (
            <Button className="mt-4" onClick={() => handleOpenModal()}>
              Create Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-gray-600 mt-2">{project.description}</p>
                    )}
                    <div className="flex gap-6 mt-4 text-sm text-gray-500">
                      <span>Tasks: {project._count?.tasks || 0}</span>
                      <span>Members: {project._count?.users || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isAdmin && (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => handleOpenModal(project)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(project)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Always show members for Admin/SuperAdmin */}
                {isAdmin && project.users && project.users.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <i className="fas fa-users text-blue-600"></i>
                      Team Members ({project.users.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {project.users.map((userProject) => (
                        <div
                          key={userProject.user.id}
                          className="flex flex-col p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {userProject.user.firstName?.[0]}{userProject.user.lastName?.[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {userProject.user.firstName} {userProject.user.lastName}
                                </p>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    userProject.user.role === 'SUPERADMIN'
                                      ? 'bg-purple-100 text-purple-800'
                                      : userProject.user.role === 'ADMIN'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {userProject.user.role}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200">
                            <p className="text-xs text-gray-700 truncate flex-1" title={userProject.user.email}>
                              <i className="fas fa-envelope mr-1 text-blue-600"></i>
                              {userProject.user.email}
                            </p>
                            <button
                              onClick={() => handleRemoveUserFromProject(project.id, userProject.user.id, userProject.user.firstName, userProject.user.lastName, project.name)}
                              className="ml-2 p-1.5 text-xs font-medium text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Remove from project"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Project Name"
            name="name"
            placeholder="Enter project name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Enter project description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'on-hold', label: 'On Hold' }
            ]}
          />

          <Button type="submit" className="w-full">
            {editingProject ? 'Update Project' : 'Create Project'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This will also delete all associated tasks. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmDialog
        isOpen={isRemoveUserDialogOpen}
        onClose={() => {
          setIsRemoveUserDialogOpen(false);
          setUserToRemove(null);
        }}
        onConfirm={confirmRemoveUser}
        title="Remove User from Project"
        message={`Are you sure you want to remove ${userToRemove?.firstName} ${userToRemove?.lastName} from "${userToRemove?.projectName}"?`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Projects;
