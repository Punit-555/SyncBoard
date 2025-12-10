import {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
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
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Messages from './pages/Messages';
import UnderDevelopment from './pages/UnderDevelopment';
import Loader from './components/ui/Loader';
import UpdateNotification from './components/UpdateNotification';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <UpdateNotification />
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
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="projects" element={<Projects />} />
            <Route path="messages" element={<Messages />} />
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
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
