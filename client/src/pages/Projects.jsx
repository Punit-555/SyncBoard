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
    <div className="p-2 sm:p-3 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-0.5 sm:mt-1">
            {isAdmin ? 'Manage all projects' : 'View your assigned projects'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()} className="w-full md:w-auto text-sm">
            <i className="fas fa-plus mr-1.5 sm:mr-2"></i>
            Create New Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
          <p className="text-sm sm:text-base text-gray-500">No projects found</p>
          {isAdmin && (
            <Button className="mt-3 sm:mt-4 text-sm" onClick={() => handleOpenModal()}>
              Create Your First Project
            </Button>
          )}
        </div>
      ) : (
      <div className="grid gap-3 sm:gap-4">
         {projects.map((project) => (
    <div
      key={project.id}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col gap-2 sm:gap-3">
          
          {/* Title and Status Row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 flex-1 min-w-0 break-words">
              {project.name}
            </h3>
            <span
              className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium shrink-0 ${
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

          {/* Description */}
          {project.description && (
            <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
              {project.description}
            </p>
          )}

          {/* Stats + Actions in One Row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
              
              <span className="flex items-center gap-1.5">
                <i className="fas fa-tasks text-blue-600"></i>
                <span className="font-medium text-gray-900">{project._count?.tasks || 0}</span>
                <span className="hidden xs:inline">
                  task{project._count?.tasks !== 1 ? 's' : ''}
                </span>
              </span>

              <span className="flex items-center gap-1.5">
                <i className="fas fa-users text-purple-600"></i>
                <span className="font-medium text-gray-900">{project._count?.users || 0}</span>
                <span className="hidden xs:inline">
                  member{project._count?.users !== 1 ? 's' : ''}
                </span>
              </span>

            </div>

            {/* Actions (Right Side) */}
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleOpenModal(project)}
                  className="text-xs sm:text-sm py-1.5 px-3 sm:px-4"
                >
                  <i className="fas fa-edit"></i>
                  <span className="ml-1 sm:ml-2">Edit</span>
                </Button>

                <Button
                  variant="danger"
                  onClick={() => handleDelete(project)}
                  className="text-xs sm:text-sm py-1.5 px-3 sm:px-4"
                >
                  <i className="fas fa-trash"></i>
                  <span className="ml-1 sm:ml-2">Delete</span>
                </Button>
              </div>
            )}

          </div>

        </div>

        {/* Team Members */}
        {isAdmin && project.users && project.users.length > 0 && (
          <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
              <i className="fas fa-users text-blue-600 text-sm sm:text-base"></i>
              <span>Team Members ({project.users.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {project.users.map((userProject) => (
                <div
                  key={userProject.user.id}
                  className="flex flex-col p-2.5 sm:p-3 md:p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md shrink-0">
                        {userProject.user.firstName?.[0]}
                        {userProject.user.lastName?.[0]}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate leading-tight">
                          {userProject.user.firstName} {userProject.user.lastName}
                        </p>

                        <span
                          className={`inline-block mt-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${
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

                  <div className="flex items-center justify-between pt-2 border-t border-blue-200 gap-2">
                    <p className="text-xs text-gray-700 truncate flex-1 min-w-0">
                      <i className="fas fa-envelope mr-1 text-blue-600 text-xs"></i>
                      {userProject.user.email}
                    </p>

                    <button
                      onClick={() =>
                        handleRemoveUserFromProject(
                          project.id,
                          userProject.user.id,
                          userProject.user.firstName,
                          userProject.user.lastName,
                          project.name
                        )
                      }
                      className="shrink-0 p-1 sm:p-1.5 text-xs font-medium text-red-600 hover:bg-red-100 rounded transition-colors"
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
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This will permanently delete all associated tasks and cannot be undone.`}
        confirmText="Delete Project"
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
        message={`Are you sure you want to remove ${userToRemove?.firstName} ${userToRemove?.lastName} from "${userToRemove?.projectName}"? The user will be notified via email.`}
        confirmText="Remove User"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Projects;
