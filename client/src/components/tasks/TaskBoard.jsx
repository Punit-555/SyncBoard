import TaskColumn from './TaskColumn';

const TaskBoard = ({ tasks, onAddTask, onEdit, onDelete, onMove }) => {
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
