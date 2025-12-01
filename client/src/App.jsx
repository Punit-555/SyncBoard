import {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Guide from './pages/Guide';
import Help from './pages/Help';
import Settings from './pages/Settings';
import Users from './pages/Users';
import UnderDevelopment from './pages/UnderDevelopment';
import Loader from './components/ui/Loader';
import TaskModal from './components/tasks/TaskModal';

function App() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleCreateTask = () => {
    setIsTaskModalOpen(true);
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout onCreateTask={handleCreateTask} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<UnderDevelopment />} />
            <Route path="projects" element={<UnderDevelopment />} />
            <Route path="teams" element={<UnderDevelopment />} />
            <Route path="users" element={<Users />} />
            <Route path="calendar" element={<UnderDevelopment />} />
            <Route path="reports" element={<UnderDevelopment />} />
            <Route path="guide" element={<Guide />} />
            <Route path="help" element={<Help />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to="/login" />}
          />
        </Routes>

        <ProtectedRoute>
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onSubmit={(data) => {
              console.log('Task created:', data);
              setIsTaskModalOpen(false);
            }}
          />
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;
