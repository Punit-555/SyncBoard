import { useState } from 'react';
import TaskColumn from './TaskColumn';

const TaskBoard = ({ tasks, onAddTask, onEdit, onDelete, onMove, onViewDetails, onTaskStatusChange }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: 'todo', title: 'Todo', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'done', title: 'Done', status: 'done' },
    { id: 'in-qa', title: 'In QA', status: 'in-qa' },
    { id: 'on-prod', title: 'On Prod', status: 'on-prod' },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (taskId, newStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      // Call the parent handler to update the task status
      if (onTaskStatusChange) {
        onTaskStatusChange(task, newStatus);
      }
    }
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-5 md:flex-row flex-col">
      {columns.map((column) => (
        <TaskColumn
          key={column.id}
          title={column.title}
          status={column.status}
          tasks={getTasksByStatus(column.status)}
          onAddTask={() => onAddTask?.(column.status)}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
          onViewDetails={onViewDetails}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
};

export default TaskBoard;
