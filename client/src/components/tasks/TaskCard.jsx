const TaskCard = ({ task, onEdit, onDelete, onMove, onViewDetails }) => {
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

  const subtaskCount = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((st) => st.status === 'completed').length || 0;

  return (
    <div
      className={`bg-white rounded-lg p-4 mb-4 shadow-sm border-l-4 ${
        priorityColors[task.priority]
      } cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-scaleIn`}
      onClick={() => onViewDetails?.(task)}
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

      {/* Subtask Progress */}
      {subtaskCount > 0 && (
        <div className="mb-3 bg-gray-50 rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <i className="fas fa-list-ul"></i>
              Subtasks
            </span>
            <span className="text-xs font-medium text-gray-700">
              {completedSubtasks}/{subtaskCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${subtaskCount > 0 ? (completedSubtasks / subtaskCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2.5 mt-2.5">
        <i
          className="fas fa-edit text-gray-500 cursor-pointer hover:text-[#4361ee] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(task);
          }}
          title="Edit task"
        ></i>
        <i
          className="fas fa-trash text-gray-500 cursor-pointer hover:text-[#f72585] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(task);
          }}
          title="Delete task"
        ></i>
        <i
          className="fas fa-arrow-right text-gray-500 cursor-pointer hover:text-[#4361ee] transition-colors ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            onMove?.(task);
          }}
          title="Move task"
        ></i>
      </div>
    </div>
  );
};

export default TaskCard;
