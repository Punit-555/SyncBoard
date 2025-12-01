import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { createTask, updateTask, getTaskById, getUsers } from '../../utils/api';
import { useSnackbar } from '../../utils/useSnackbar';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, projectId = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo',
    projectId: projectId,
    assignedTo: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await getUsers();
        if (response.success) {
          setUsers(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);


  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || 'todo',
        projectId: task.projectId || projectId,
        assignedTo: task.userId || task.assignedTo || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        status: 'todo',
        projectId: projectId,
        assignedTo: '',
      });
    }
  }, [task, isOpen, projectId]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (!formData.title || !formData.title.trim()) {
      showError("Task title is required");
      setIsLoading(false);
      return;
    }

    if (!formData.projectId) {
      showError("Project ID missing");
      setIsLoading(false);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      priority: formData.priority,
      status: formData.status,

      // Prevents NaN issues
      projectId: Number(formData.projectId),

      // userId (assignedTo) can be null
      userId:
        formData.assignedTo && formData.assignedTo !== ""
          ? Number(formData.assignedTo)
          : null,

      dueDate: formData.dueDate
        ? new Date(formData.dueDate).toISOString()
        : null,
    };


    // --- API CALL (SAFE) ---
    if (task && task.id) {
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
    showError(error?.response?.data?.message || error.message || "Failed to save task");
  } finally {
    setIsLoading(false);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>

      </form>
    </Modal>
  );
};

export default TaskModal;
