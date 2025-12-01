import TaskColumn from './TaskColumn';

const TaskBoard = ({ tasks, onAddTask, onEdit, onDelete, onMove }) => {
  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'inProgress', title: 'In Progress', status: 'inProgress' },
    { id: 'review', title: 'Review', status: 'review' },
    { id: 'done', title: 'Done', status: 'done' },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-5 md:flex-row flex-col">
      {columns.map((column) => (
        <TaskColumn
          key={column.id}
          title={column.title}
          tasks={getTasksByStatus(column.status)}
          onAddTask={() => onAddTask?.(column.status)}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </div>
  );
};

export default TaskBoard;
