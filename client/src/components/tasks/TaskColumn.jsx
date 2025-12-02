import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, onAddTask, onEdit, onDelete, onMove, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg min-w-[280px] md:min-w-[280px] min-w-full shadow-md p-4">
      <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-gray-100">
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        <div className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">
          {tasks.length}
        </div>
      </div>
      <div className="min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
      <button
        onClick={onAddTask}
        className="w-full py-2.5 bg-transparent border border-dashed border-gray-200 rounded-lg text-gray-500 cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-[#4361ee]/5 hover:text-[#4361ee] hover:border-[#4361ee]"
      >
        <i className="fas fa-plus"></i> Add Task
      </button>
    </div>
  );
};

export default TaskColumn;
