import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Help from './pages/Help';
import Settings from './pages/Settings';
import UnderDevelopment from './pages/UnderDevelopment';
import Loader from './components/ui/Loader';
import TaskModal from './components/tasks/TaskModal';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Simulate authentication - in real app, use context/redux for auth state
  const isAuthenticated = true; // Change to false to see login page

  const handleCreateTask = () => {
    setIsTaskModalOpen(true);
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Layout onCreateTask={handleCreateTask} /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<UnderDevelopment />} />
          <Route path="projects" element={<UnderDevelopment />} />
          <Route path="teams" element={<UnderDevelopment />} />
          <Route path="calendar" element={<UnderDevelopment />} />
          <Route path="reports" element={<UnderDevelopment />} />
          <Route path="help" element={<Help />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to dashboard or login */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />
      </Routes>

      {/* Global Task Modal */}
      {isAuthenticated && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={(data) => {
            console.log('Task created:', data);
            setIsTaskModalOpen(false);
          }}
        />
      )}
    </Router>
  );
}

export default App;
