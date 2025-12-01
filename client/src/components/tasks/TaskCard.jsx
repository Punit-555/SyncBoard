const TaskCard = ({ task, onEdit, onDelete, onMove }) => {
  const priorityColors = {
    high: 'border-l-[#f72585]',
    medium: 'border-l-[#f8961e]',
    low: 'border-l-[#4cc9f0]',
  };

  // Format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 mb-4 shadow-sm border-l-4 ${
        priorityColors[task.priority]
      } cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-scaleIn`}
    >
      <div className="font-semibold mb-2 text-gray-800">{task.title}</div>
      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span title={`Due: ${formatDate(task.dueDate)}`}>
          <i className="far fa-calendar mr-1"></i> {formatDate(task.dueDate)}
        </span>
        <span title={`Assigned to: ${task.assignee || 'Unassigned'}`}>
          <i className="far fa-user mr-1"></i> {task.assignee || 'Unassigned'}
        </span>
      </div>
      <div className="flex gap-2.5 mt-2.5">
        <i
          className="fas fa-edit text-gray-500 cursor-pointer hover:text-[#4361ee] transition-colors"
          onClick={() => onEdit?.(task)}
          title="Edit task"
        ></i>
        <i
          className="fas fa-trash text-gray-500 cursor-pointer hover:text-[#f72585] transition-colors"
          onClick={() => onDelete?.(task)}
          title="Delete task"
        ></i>
        <i
          className="fas fa-arrow-right text-gray-500 cursor-pointer hover:text-[#4361ee] transition-colors ml-auto"
          onClick={() => onMove?.(task)}
          title="Move task"
        ></i>
      </div>
    </div>
  );
};

export default TaskCard;
