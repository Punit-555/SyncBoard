import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as api from '../../utils/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useSnackbar } from '../../utils/useSnackbar';
import Snackbar from '../ui/Snackbar';

const TaskDetailDrawer = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const { user } = useAuth();
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskData, setSubtaskData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    userId: '',
    dueDate: '',
  });

  useEffect(() => {
    if (isOpen && task) {
      fetchTaskDetails();
      fetchUsers();
      fetchProjects();
    }
  }, [isOpen, task]);

  const fetchTaskDetails = async () => {
    try {
      const response = await api.getTaskById(task.id);
      if (response.success) {
        setTaskData(response.data);
      }
    } catch (error) {
      showError('Failed to load task details');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.getAllUsers();
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.getAllProjects();
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleTaskUpdate = async (updatedFields) => {
    setIsLoading(true);
    try {
      const response = await api.updateTask(taskData.id, updatedFields);
      if (response.success) {
        showSuccess('Task updated successfully');
        setTaskData(response.data);
        setIsEditing(false);
        onTaskUpdated?.();
      }
    } catch (error) {
      showError(error.message || 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubtaskCreate = async (e) => {
    e.preventDefault();
    if (!subtaskData.title.trim()) {
      showError('Subtask title is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.createTask({
        ...subtaskData,
        parentTaskId: taskData.id,
        projectId: taskData.projectId,
        userId: subtaskData.userId || user.userId,
      });

      if (response.success) {
        showSuccess('Subtask created successfully');
        setSubtaskData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          userId: '',
          dueDate: '',
        });
        setShowSubtaskForm(false);
        fetchTaskDetails();
        onTaskUpdated?.();
      }
    } catch (error) {
      showError(error.message || 'Failed to create subtask');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubtaskStatusUpdate = async (subtaskId, newStatus) => {
    try {
      const response = await api.updateTask(subtaskId, { status: newStatus });
      if (response.success) {
        showSuccess('Subtask status updated');
        fetchTaskDetails();
        onTaskUpdated?.();
      }
    } catch (error) {
      showError(error.message || 'Failed to update subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!window.confirm('Are you sure you want to delete this subtask?')) {
      return;
    }

    try {
      await api.deleteTask(subtaskId);
      showSuccess('Subtask deleted successfully');
      fetchTaskDetails();
      onTaskUpdated?.();
    } catch (error) {
      showError(error.message || 'Failed to delete subtask');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || colors.medium;
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  if (!isOpen || !taskData) return null;

  const completedSubtasks = taskData.subtasks?.filter((st) => st.status === 'completed').length || 0;
  const totalSubtasks = taskData.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#4361ee] to-[#4895ef] p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-tasks"></i>
              Task Details
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* Progress Bar for Subtasks */}
          {totalSubtasks > 0 && (
            <div className="bg-white/20 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">Subtask Progress</span>
                <span className="text-white text-sm font-bold">{progress}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-white text-xs mt-1">
                {completedSubtasks} of {totalSubtasks} subtasks completed
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Task Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{taskData.title}</h3>
                <p className="text-gray-600">{taskData.description || 'No description provided'}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-4 w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                  title="Edit Task"
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Status</label>
                <div className={`mt-1 px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusColor(taskData.status)}`}>
                  {taskData.status}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Priority</label>
                <div className={`mt-1 px-3 py-1 rounded-full text-sm font-medium inline-block ${getPriorityColor(taskData.priority)}`}>
                  {taskData.priority}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</label>
                <div className="mt-1 text-gray-800 font-medium">
                  {taskData.user ? `${taskData.user.firstName} ${taskData.user.lastName}` : 'Unassigned'}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Project</label>
                <div className="mt-1 text-gray-800 font-medium">{taskData.project?.name || 'N/A'}</div>
              </div>
              {taskData.dueDate && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Due Date</label>
                  <div className="mt-1 text-gray-800 font-medium">
                    {new Date(taskData.dueDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-edit text-blue-600"></i>
                Edit Task
              </h4>
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                  placeholder="Task title"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={taskData.description || ''}
                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    placeholder="Task description"
                  />
                </div>
                <Select
                  label="Status"
                  value={taskData.status}
                  onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                  options={statusOptions}
                />
                <Select
                  label="Priority"
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  options={priorityOptions}
                />
                <Select
                  label="Assign To"
                  value={taskData.userId}
                  onChange={(e) => setTaskData({ ...taskData, userId: e.target.value })}
                  options={users.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))}
                />
                <Input
                  label="Due Date"
                  type="date"
                  value={taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      fetchTaskDetails();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleTaskUpdate(taskData)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Subtasks Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-list-ul text-purple-600"></i>
                  Subtasks ({totalSubtasks})
                </h4>
                <button
                  onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <i className={`fas ${showSubtaskForm ? 'fa-times' : 'fa-plus'}`}></i>
                  {showSubtaskForm ? 'Cancel' : 'Add Subtask'}
                </button>
              </div>
            </div>

            {/* Subtask Form */}
            {showSubtaskForm && (
              <form onSubmit={handleSubtaskCreate} className="p-6 bg-purple-50 border-b border-gray-200">
                <div className="space-y-4">
                  <Input
                    label="Subtask Title"
                    value={subtaskData.title}
                    onChange={(e) => setSubtaskData({ ...subtaskData, title: e.target.value })}
                    placeholder="Enter subtask title"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={subtaskData.description}
                      onChange={(e) => setSubtaskData({ ...subtaskData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows="2"
                      placeholder="Subtask description (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Status"
                      value={subtaskData.status}
                      onChange={(e) => setSubtaskData({ ...subtaskData, status: e.target.value })}
                      options={statusOptions}
                    />
                    <Select
                      label="Priority"
                      value={subtaskData.priority}
                      onChange={(e) => setSubtaskData({ ...subtaskData, priority: e.target.value })}
                      options={priorityOptions}
                    />
                  </div>
                  <Select
                    label="Assign To"
                    value={subtaskData.userId}
                    onChange={(e) => setSubtaskData({ ...subtaskData, userId: e.target.value })}
                    options={[
                      { value: '', label: 'Same as parent task' },
                      ...users.map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` })),
                    ]}
                  />
                  <Input
                    label="Due Date"
                    type="date"
                    value={subtaskData.dueDate}
                    onChange={(e) => setSubtaskData({ ...subtaskData, dueDate: e.target.value })}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus mr-2"></i>
                        Create Subtask
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Subtask List */}
            <div className="divide-y divide-gray-200">
              {taskData.subtasks && taskData.subtasks.length > 0 ? (
                taskData.subtasks.map((subtask) => (
                  <div key={subtask.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() =>
                          handleSubtaskStatusUpdate(
                            subtask.id,
                            subtask.status === 'completed' ? 'pending' : 'completed'
                          )
                        }
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          subtask.status === 'completed'
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {subtask.status === 'completed' && (
                          <i className="fas fa-check text-white text-xs"></i>
                        )}
                      </button>
                      <div className="flex-1">
                        <h5
                          className={`font-medium ${
                            subtask.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'
                          }`}
                        >
                          {subtask.title}
                        </h5>
                        {subtask.description && (
                          <p className="text-sm text-gray-600 mt-1">{subtask.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subtask.status)}`}>
                            {subtask.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(subtask.priority)}`}>
                            {subtask.priority}
                          </span>
                          {subtask.user && (
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <i className="fas fa-user"></i>
                              {subtask.user.firstName} {subtask.user.lastName}
                            </span>
                          )}
                          {subtask.dueDate && (
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <i className="fas fa-calendar"></i>
                              {new Date(subtask.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubtask(subtask.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="Delete subtask"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <i className="fas fa-inbox text-4xl mb-3 text-gray-300"></i>
                  <p>No subtasks yet. Click "Add Subtask" to create one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        open={snackbar.open}
        onClose={hideSnackbar}
        position="top-right"
      />
    </>
  );
};

export default TaskDetailDrawer;
