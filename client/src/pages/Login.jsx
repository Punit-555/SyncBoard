import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Snackbar from '../components/ui/Snackbar';
import LoadingPopup from '../components/ui/LoadingPopup';
import { useSnackbar } from '../utils/useSnackbar';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();
  const { snackbar, showSuccess, showError, showWarning, showInfo, hideSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
      rememberMe: formData.remember,
    };

    try {
      const res = await api.login(payload);
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        showSuccess('Login successful! Redirecting...');
        setIsLoggingIn(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Login error', err);
      showError(err.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4361ee] to-[#3f37c9] p-4 sm:p-5 md:p-8">
      <div className="bg-white rounded-2xl sm:rounded-lg md:rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-7 md:p-8">
        <div className="text-center mb-6 sm:mb-7 md:mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-[#4361ee]">
            <div className="bg-gradient-to-br from-[#4361ee] to-[#3f37c9] w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-tasks text-sm sm:text-base"></i>
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl">SyncBoard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="mb-4">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-[#4361ee] no-underline hover:underline text-xs sm:text-sm">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-4 sm:mb-5 text-xs sm:text-sm">
            <input
              type="checkbox"
              id="remember"
              checked={formData.remember}
              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
            />
            <label htmlFor="remember" className="text-gray-600">Remember me</label>
          </div>

          <Button type="submit" className="w-full mb-4 text-center sm:mb-5 d-flex justify-center" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center mt-4 sm:mt-5 text-xs sm:text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#4361ee] no-underline font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        open={snackbar.open}
        onClose={hideSnackbar}
        position="top-right"
      />

      <LoadingPopup message="Logging in..." isOpen={isLoggingIn} />
    </div>
  );
};

export default Login;
