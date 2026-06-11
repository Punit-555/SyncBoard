import { useState, useEffect, useCallback } from 'react';
import TaskBoard from '../components/tasks/TaskBoard';
import TaskTable from '../components/tasks/TaskTable';
import TaskModal from '../components/tasks/TaskModal';
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import MultiSelect from '../components/ui/MultiSelect';
import Loader from '../components/ui/Loader';
import { getTasks, deleteTask, getUsers, getProjects, updateTask } from '../utils/api';
import { useSnackbar } from '../utils/useSnackbar';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTask, setDrawerTask] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // default to 'table'
  const [isProcessing, setIsProcessing] = useState(false);
  const { showSuccess, showError } = useSnackbar();

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getTasks();
      if (response.success) {
        setTasks(response.data || []);
      } else {
        showError('Failed to load tasks');
      }
    } catch (error) {
      console.error('Load tasks error:', error);
      showError(error.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadTasks();
    fetchUsers();
    fetchProjects();
  }, [loadTasks]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await getUsers();
      if (res && res.success) setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users for filters', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const res = await getProjects();
      if (res && res.success) setProjects(res.data || []);
    } catch (err) {
      console.error('Failed to load projects for filters', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setIsProcessing(true);
      await deleteTask(taskToDelete.id);
      showSuccess('Task deleted successfully');
      await loadTasks();
    } catch (error) {
      console.error('Delete task error:', error);
      showError(error.message || 'Failed to delete task');
    }
    finally {
      setIsProcessing(false);
    }
  };

  const handleTaskSubmit = () => {
    setIsProcessing(true);
    loadTasks().finally(() => setIsProcessing(false));
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Filters
  const [filterTaskId, setFilterTaskId] = useState('');
  const [filterTaskName, setFilterTaskName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterProjects, setFilterProjects] = useState([]);

  const filteredTasks = tasks.filter((t) => {
    if (filterTaskId) {
      const idStr = String(t.id || '');
      if (!idStr.includes(String(filterTaskId))) return false;
    }

    if (filterTaskName) {
      const title = (t.title || '').toLowerCase();
      if (!title.includes(filterTaskName.toLowerCase())) return false;
    }

    if (filterStatus) {
      if ((t.status || '') !== filterStatus) return false;
    }

      if (filterUser) {
        const assignedId = t.userId ? String(t.userId) : '';
        if (assignedId !== String(filterUser)) return false;
      }

      if (filterProjects.length > 0) {
        // task.projectId may be a number or string; normalize to string comparisons
        const taskProjectId = t.projectId ? String(t.projectId) : null;
        const normalizedFilters = filterProjects.map((fp) => String(fp));
        if (!taskProjectId || !normalizedFilters.includes(taskProjectId)) return false;
      }

    return true;
  });

  const handleMoveTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleViewDetails = (task) => {
    setDrawerTask(task);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setDrawerTask(null);
  };

  const handleTaskUpdated = () => {
    loadTasks();
  };

  const handleTaskStatusChange = async (task, newStatus) => {
    try {
      await updateTask(task.id, { status: newStatus });
      showSuccess(`Task moved to ${newStatus.replace('-', ' ')}`);
      loadTasks();
    } catch (error) {
      console.error('Update task status error:', error);
      showError(error.message || 'Failed to update task status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  // Prepare tasks for table (add display fields)
  const tableTasks = filteredTasks.map((t) => ({
    ...t,
    assignedToName: t.user ? `${t.user.firstName || ''} ${t.user.lastName || ''}`.trim() : null,
    projectName: t.project?.name ?? null,
  }));
  
  const normalizedTasks = tableTasks;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              label="View"
              name="viewMode"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              options={[
                { value: 'table', label: 'Table View' },
                { value: 'kanban', label: 'Kanban Board' },
              ]}
            />
          </div>
          <Button onClick={handleCreateTask} className="" loading={isProcessing} disabled={isProcessing}>
          <i className="fas fa-plus mr-2"></i>
          Add New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <Input
          label="Search by Task ID"
          name="taskId"
          placeholder="e.g. 123"
          value={filterTaskId}
          onChange={(e) => setFilterTaskId(e.target.value)}
        />

        <Input
          label="Search by Task Name"
          name="taskName"
          placeholder="Task title"
          value={filterTaskName}
          onChange={(e) => setFilterTaskName(e.target.value)}
        />

        <MultiSelect
          label="Filter by Projects"
          value={filterProjects}
          onChange={setFilterProjects}
          placeholder={projectsLoading ? 'Loading projects...' : 'Select projects...'}
          options={projects.map(p => ({ value: p.id, label: p.name }))}
        />

        <Select
          label="Status"
          name="status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'todo', label: 'Todo' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'done', label: 'Done' },
            { value: 'in-qa', label: 'In QA' },
            { value: 'on-prod', label: 'On Prod' },
          ]}
        />

        <Select
          label="Assigned User"
          name="assignedUser"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          options={[
            { value: '', label: usersLoading ? 'Loading users...' : 'All Users' },
            ...users.map(u => ({ value: u.id, label: `${u.firstName} ${u.lastName} (${u.email})` }))
          ]}
        />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks match the current filters.</p>
        </div>
      ) : (
        viewMode === 'kanban' ? (
          <TaskBoard
            tasks={normalizedTasks}
            onAddTask={handleCreateTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onViewDetails={handleViewDetails}
            onTaskStatusChange={handleTaskStatusChange}
          />
        ) : (
          <TaskTable
            tasks={tableTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onViewDetails={handleViewDetails}
          />
        )
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
        projectId={null}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isProcessing={isProcessing}
      />

      <TaskDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        task={drawerTask}
        onTaskUpdated={handleTaskUpdated}
      />

    </div>
  );
};

export default Tasks;
