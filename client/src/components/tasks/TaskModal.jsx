import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { createTask, updateTask, getUsers, getAllProjects } from '../../utils/api';
import { useSnackbar } from '../../utils/useSnackbar';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, projectId = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo',
    projectId: projectId,
    userId: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const { showSuccess, showError } = useSnackbar();

  // ========== Fetch Users + Projects When Modal Opens ==========
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await getUsers();
        setUsers(response.success ? response.data || [] : []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const response = await getAllProjects();
        setProjects(response.success ? response.data || [] : []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchUsers();
    fetchProjects();
  }, [isOpen]);

  // ========== Load Existing Task Or Reset Form ==========
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || 'todo',
        projectId: task.projectId || projectId,
        userId: task.userId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        status: 'todo',
        projectId: projectId,
        userId: '',
      });
    }
  }, [task, isOpen, projectId]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};



  // ========== Submit Handler ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);


    try {
      if (!formData.title.trim()) {
        showError("Task title is required");
        return;
      }

      if (!formData.projectId) {
        showError("Please select a project to create the task");
        return;
      }

  

      console.log("FORM", formData, )

      const payload = {
  title: formData.title.trim(),
  description: formData.description?.trim() || null,
  priority: formData.priority,
  status: formData.status,
  projectId: formData.projectId, // <-- KEEP AS STRING
  userId: formData.userId || null, // keep as string also
  dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
};

console.log("PAYLOAD", payload);

      console.log("PAYLOAD", payload)

      if (task?.id) {
        await updateTask(task.id, payload);
        showSuccess("Task updated successfully");
      } else {
        await createTask(payload);
        showSuccess("Task created successfully");
      }

      onSubmit(formData);
      onClose();

    } catch (error) {
      console.error("TASK ERROR:", error);
      const errorMsg = error?.response?.message || error?.message || "Failed to save task";
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit}>

        <Input
          label="Task Title"
          name="title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Textarea
          label="Description"
          name="description"
          placeholder="Enter task description (optional)"
          value={formData.description}
          onChange={handleChange}
        />

        <Select
          label="Project"
          name="projectId"
          value={formData.projectId || ''}
          onChange={handleChange}
          options={[
            { value: '', label: projectsLoading ? 'Loading projects...' : 'Select a project *' },
            ...projects.map(project => ({
              value: project.id,
              label: project.name
            }))
          ]}
          disabled={projectsLoading}
          required
        />

        {!formData.projectId && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 -mt-2 mb-4">
            <i className="fas fa-exclamation-triangle text-amber-600 mt-0.5"></i>
            <p className="text-sm text-amber-800">
              <strong>Project Required:</strong> Please select a project to create a task.
            </p>
          </div>
        )}

        <Select
          label="Assigned To"
          name="userId"
          value={formData.userId || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Select a user (optional)' },
            ...users.map(user => ({
              value: user.id,
              label: `${user.firstName} ${user.lastName} (${user.email})`
            }))
          ]}
          disabled={usersLoading}
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]}
        />

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'todo', label: 'Todo' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'done', label: 'Done' },
            { value: 'in-qa', label: 'In QA' },
            { value: 'on-prod', label: 'On Prod' }
          ]}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !formData.title.trim()}
        >
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>

      </form>
    </Modal>
  );
};

export default TaskModal;
