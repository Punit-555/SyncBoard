import { useState } from 'react';
import StatCard from '../components/tasks/StatCard';
import TaskBoard from '../components/tasks/TaskBoard';
import TaskModal from '../components/tasks/TaskModal';
import Input from '../components/ui/Input';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Design Homepage Mockup',
      description: 'Create wireframes and mockups for the new homepage',
      priority: 'high',
      dueDate: '2025-11-28',
      assignee: 'John Doe',
      status: 'todo',
    },
    {
      id: 2,
      title: 'Create Database Schema',
      description: 'Design and implement the database structure',
      priority: 'medium',
      dueDate: '2025-11-29',
      assignee: 'Sarah Smith',
      status: 'todo',
    },
    {
      id: 3,
      title: 'Implement User Authentication',
      description: 'Set up JWT authentication system',
      priority: 'medium',
      dueDate: '2025-11-30',
      assignee: 'Mike Johnson',
      status: 'inProgress',
    },
    {
      id: 4,
      title: 'Code Review - Payment Module',
      description: 'Review and test payment integration',
      priority: 'low',
      dueDate: '2025-12-01',
      assignee: 'Lisa Brown',
      status: 'review',
    },
    {
      id: 5,
      title: 'Project Setup & Configuration',
      description: 'Initialize project with necessary dependencies',
      priority: 'low',
      dueDate: '2025-11-26',
      assignee: 'Mike Johnson',
      status: 'done',
    },
  ]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'inProgress').length,
    overdue: 3,
  };

  const handleCreateTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateTask = (updatedTaskData) => {
    setTasks(tasks.map((t) => (t.id === updatedTaskData.id ? updatedTaskData : t)));
    setEditingTask(null);
  };

  const handleDeleteTask = (task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter((t) => t.id !== task.id));
    }
  };

  const handleSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8 md:flex-row flex-col md:items-center items-start gap-4 animate-slideInLeft">
        <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
        <div className="md:w-auto w-full">
          <Input placeholder="Search tasks..." className="md:w-64 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="animate-fadeIn" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <StatCard icon="fas fa-tasks" count={stats.total} label="Total Tasks" color="blue" />
        </div>
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <StatCard icon="fas fa-check-circle" count={stats.completed} label="Completed" color="green" />
        </div>
        <div className="animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <StatCard icon="fas fa-clock" count={stats.inProgress} label="In Progress" color="orange" />
        </div>
        <div className="animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <StatCard icon="fas fa-exclamation-circle" count={stats.overdue} label="Overdue" color="pink" />
        </div>
      </div>

      <div className="animate-fadeIn" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        <TaskBoard
          tasks={tasks}
          onAddTask={() => setIsModalOpen(true)}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        task={editingTask}
      />
    </>
  );
};

export default Dashboard;
