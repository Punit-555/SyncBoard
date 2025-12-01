import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: 'Unassigned',
    status: 'todo',
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignee: 'Unassigned',
        status: 'todo',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
          placeholder="Enter task description"
          value={formData.description}
          onChange={handleChange}
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={['low', 'medium', 'high']}
        />

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <Select
          label="Assign To"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          options={['Unassigned', 'John Doe', 'Sarah Smith', 'Mike Johnson', 'Lisa Brown']}
        />

        {task && (
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'todo', label: 'To Do' },
              { value: 'inProgress', label: 'In Progress' },
              { value: 'review', label: 'Review' },
              { value: 'done', label: 'Done' },
            ]}
          />
        )}

        <Button type="submit" className="w-full">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </Modal>
  );
};

export default TaskModal;
