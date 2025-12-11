import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Snackbar from '../components/ui/Snackbar';
import { useSnackbar } from '../utils/useSnackbar';
import api from '../utils/api';

const ForgotPassword = () => {
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.forgotPassword({ email });
      if (res.success) {
        setEmailSent(true);
        showSuccess('Password reset link has been sent to your email!');
      }
    } catch (err) {
      console.error('Forgot password error', err);
      showError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
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
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 text-gray-800">Forgot Password</h2>
          <p className="text-gray-600 text-xs sm:text-sm">
            {emailSent
              ? 'Check your email for the reset link'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button type="submit" className="w-full mb-4 sm:mb-5" disabled={isLoading}>
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 mb-4 sm:mb-5">
            <div className="flex items-start gap-2 md:gap-3">
              <i className="fas fa-check-circle text-green-500 text-lg md:text-xl mt-0.5 flex-shrink-0"></i>
              <div className="min-w-0">
                <h3 className="font-semibold text-green-800 mb-1 text-sm md:text-base">Email Sent!</h3>
                <p className="text-xs md:text-sm text-green-700 mb-2 md:mb-3 break-all">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-xs text-green-600">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    className="underline font-medium hover:text-green-800"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

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

export default ForgotPassword;
