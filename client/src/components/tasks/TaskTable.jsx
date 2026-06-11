import Button from '../ui/Button';

const TaskTable = ({ tasks, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.taskId || t.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.assignedToName || (t.assignedTo ? `${t.assignedTo.firstName || ''} ${t.assignedTo.lastName || ''}` : '-')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.projectName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <button onClick={() => onViewDetails?.(t)} className="text-gray-600 hover:text-gray-900" title="View">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button onClick={() => onEdit?.(t)} className="text-blue-600 hover:text-blue-900" title="Edit">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => onDelete?.(t)} className="text-red-600 hover:text-red-900" title="Delete">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
