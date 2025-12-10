import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getProjects, getTasks, getUsers } from '../utils/api';
import StatCard from '../components/tasks/StatCard';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes, usersRes] = await Promise.all([
        getProjects().catch(() => ({ data: [] })),
        getTasks().catch(() => ({ data: [] })),
        user?.role !== 'USER' ? getUsers().catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ]);

      setProjects(projectsRes.data || []);
      setTasks(tasksRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    pending: tasks.filter((t) => t.status === 'todo' || t.status === 'pending').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // SUPER ADMIN DASHBOARD
  if (user?.role === 'SUPERADMIN') {
    return (
      <div className="space-y-4 md:space-y-6 p-3 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Complete system overview and management</p>
          </div>
          <Button onClick={() => navigate('/projects')} className="w-full md:w-auto">
            <i className="fas fa-plus mr-2"></i>
            Manage Projects
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon="fas fa-project-diagram" count={projects.length} label="Total Projects" color="blue" />
          <StatCard icon="fas fa-users" count={users.length} label="Total Users" color="green" />
          <StatCard icon="fas fa-user-shield" count={users.filter(u => u.role === 'ADMIN').length} label="Admins" color="purple" />
          <StatCard icon="fas fa-user" count={users.filter(u => u.role === 'USER').length} label="Regular Users" color="orange" />
        </div>

        {/* Projects List with Members */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Projects Overview</h2>
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-folder-open text-4xl mb-2"></i>
                <p>No projects yet. Create your first project!</p>
                <Button className="mt-4" onClick={() => navigate('/projects')}>
                  Create Project
                </Button>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      {project.description && (
                        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span><i className="fas fa-tasks mr-1"></i> {project._count?.tasks || 0} tasks</span>
                        <span><i className="fas fa-users mr-1"></i> {project._count?.users || 0} members</span>
                      </div>
                    </div>
                    {project.users && project.users.length > 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                      >
                        {expandedProject === project.id ? '▲' : '▼'} Members
                      </Button>
                    )}
                  </div>

                  {expandedProject === project.id && project.users && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Project Members</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {project.users.map((userProject) => (
                          <div
                            key={userProject.user.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <p className="font-medium text-sm text-gray-900">
                                {userProject.user.firstName} {userProject.user.lastName}
                              </p>
                              <p className="text-xs text-gray-600">{userProject.user.email}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                userProject.user.role === 'SUPERADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : userProject.user.role === 'ADMIN'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {userProject.user.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Users Overview</h2>
            <Button variant="secondary" onClick={() => navigate('/users')}>
              View All Users
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.slice(0, 6).map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {u.firstName?.[0]}{u.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-600 truncate">{u.email}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.role === 'SUPERADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : u.role === 'ADMIN'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  if (user?.role === 'ADMIN') {
    return (
      <div className="space-y-4 md:space-y-6 p-3 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Manage projects, tasks, and users</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="secondary" onClick={() => navigate('/tasks')} className="flex-1 md:flex-none">
              <i className="fas fa-tasks mr-2"></i>
              <span className="hidden sm:inline">Manage </span>Tasks
            </Button>
            <Button onClick={() => navigate('/projects')} className="flex-1 md:flex-none">
              <i className="fas fa-plus mr-2"></i>
              <span className="hidden sm:inline">Manage </span>Projects
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon="fas fa-tasks" count={stats.total} label="Total Tasks" color="blue" />
          <StatCard icon="fas fa-check-circle" count={stats.completed} label="Completed" color="green" />
          <StatCard icon="fas fa-clock" count={stats.inProgress} label="In Progress" color="orange" />
          <StatCard icon="fas fa-project-diagram" count={projects.length} label="Projects" color="purple" />
        </div>

        {/* Projects */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
            <Button variant="secondary" onClick={() => navigate('/projects')}>
              View All Projects
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description || 'No description'}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span><i className="fas fa-tasks mr-1"></i> {project._count?.tasks || 0} tasks</span>
                  <span><i className="fas fa-users mr-1"></i> {project._count?.users || 0} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Tasks</h2>
            <Button variant="secondary" onClick={() => navigate('/tasks')}>
              View All Tasks
            </Button>
          </div>
          <div className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-600">{task.project?.name}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'done'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // USER DASHBOARD
  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Welcome back, {user?.firstName}!</p>
        </div>
        <Button onClick={() => navigate('/tasks')} className="w-full md:w-auto">
          <i className="fas fa-eye mr-2"></i>
          View My Tasks
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon="fas fa-tasks" count={stats.total} label="My Tasks" color="blue" />
        <StatCard icon="fas fa-check-circle" count={stats.completed} label="Completed" color="green" />
        <StatCard icon="fas fa-clock" count={stats.inProgress} label="In Progress" color="orange" />
        <StatCard icon="fas fa-hourglass-start" count={stats.pending} label="Pending" color="purple" />
      </div>

      {/* My Projects */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-folder-open text-4xl mb-2"></i>
            <p>No projects assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description || 'No description'}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span><i className="fas fa-tasks mr-1"></i> {project._count?.tasks || 0} tasks</span>
                  <span
                    className={`px-2 py-1 rounded-full font-medium ${
                      project.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
        <div className="space-y-2">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="text-xs text-gray-600">{task.project?.name}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === 'done'
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
