import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Snackbar from '../components/ui/Snackbar';
import { useSnackbar } from '../utils/useSnackbar';
import api from '../utils/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { snackbar, showSuccess, showError, showWarning, hideSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Validate token on mount
    const validateToken = async () => {
      if (!token) {
        showError('Invalid or missing reset token');
        setIsValidating(false);
        return;
      }

      try {
        await api.validateResetToken(token);
        setIsValidToken(true);
      } catch (err) {
        showError(err.message || 'Invalid or expired reset token');
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.password.trim()) {
      showWarning('Please enter a password');
      return;
    }

    if (formData.password.length < 6) {
      showWarning('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showWarning('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.resetPassword({
        token,
        password: formData.password,
      });

      if (res.success) {
        showSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Reset password error', err);
      showError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4361ee] to-[#3f37c9] p-4 sm:p-5 md:p-8">
        <div className="bg-white rounded-2xl sm:rounded-lg md:rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-7 md:p-8 text-center">
          <i className="fas fa-spinner fa-spin text-3xl md:text-4xl text-[#4361ee] mb-3 md:mb-4"></i>
          <p className="text-gray-600 text-sm md:text-base">Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4361ee] to-[#3f37c9] p-4 sm:p-5 md:p-8">
        <div className="bg-white rounded-2xl sm:rounded-lg md:rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-7 md:p-8">
          <div className="text-center mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <i className="fas fa-times-circle text-2xl md:text-3xl text-red-500"></i>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-1 md:mb-2 text-gray-800">Invalid Reset Link</h2>
            <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <div className="flex flex-col gap-2 md:gap-3">
              <Link to="/forgot-password">
                <Button className="w-full text-sm md:text-base">
                  <i className="fas fa-paper-plane mr-2"></i>
                  Request New Link
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full text-sm md:text-base">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          open={snackbar.open}
          onClose={hideSnackbar}
          position="top-right"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4361ee] to-[#3f37c9] p-4 sm:p-5 md:p-8">
      <div className="bg-white rounded-2xl sm:rounded-lg md:rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-7 md:p-8">
        <div className="text-center mb-6 sm:mb-7 md:mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-[#4361ee]">
            <div className="bg-gradient-to-br from-[#4361ee] to-[#3f37c9] w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-tasks text-sm sm:text-base"></i>
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl">TaskFlow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 text-gray-800">Reset Password</h2>
          <p className="text-gray-600 text-xs sm:text-sm">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            disabled={isLoading}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 mb-4 sm:mb-5">
            <p className="text-xs md:text-sm text-blue-800">
              <i className="fas fa-info-circle mr-1"></i>
              Password must be at least 6 characters long
            </p>
          </div>

          <Button type="submit" className="w-full mb-4 sm:mb-5 text-sm md:text-base" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Resetting Password...
              </>
            ) : (
              <>
                <i className="fas fa-key mr-2"></i>
                Reset Password
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-xs sm:text-sm text-gray-600">
          <Link to="/login" className="text-[#4361ee] no-underline font-medium hover:underline">
            <i className="fas fa-arrow-left mr-1"></i>
            Back to Login
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
    </div>
  );
};

export default ResetPassword;
