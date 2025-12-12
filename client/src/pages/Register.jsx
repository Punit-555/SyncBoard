import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Snackbar from '../components/ui/Snackbar';
import LoadingPopup from '../components/ui/LoadingPopup';
import { useSnackbar } from '../utils/useSnackbar';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const { snackbar, showSuccess, showError, showWarning, showInfo, hideSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showWarning('Please enter your name');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showWarning('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      showWarning('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    // Call backend signup
    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: formData.name,
      rememberMe: formData.rememberMe,
    };

    try {
      const res = await api.signup(payload);
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        showSuccess('Account created successfully! Redirecting...');
        setIsLoggingIn(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Signup error', err);
      showError(err.message || 'Signup failed. Please try again.');
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
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 text-gray-800">Create Account</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Sign up to get started with SyncBoard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 mb-4 sm:mb-5 text-xs sm:text-sm">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            />
            <label htmlFor="rememberMe" className="text-gray-600">Remember me for 30 days</label>
          </div>

          <Button type="submit" className="w-full mb-4 sm:mb-5" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center mt-4 sm:mt-5 text-xs sm:text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#4361ee] no-underline font-medium hover:underline">
            Sign in
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

export default Register;
