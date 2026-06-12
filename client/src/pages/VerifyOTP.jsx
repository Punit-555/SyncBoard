import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ContactQueryModal from '../components/ui/ContactQueryModal';
import api from '../utils/api';
import { useSnackbar } from '../utils/useSnackbar';
import { useAuth } from '../hooks/useAuth';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Expect email and maybe phone in location.state
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      // If no email was provided, send user back to login
      navigate('/login');
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 5) {
      showSnackbar('Please enter the 5-digit code', 'error');
      return;
    }

    try {
      setIsVerifying(true);
      const res = await api.verifyOtp({ email, code });
      if (res && res.token) {
        login(res.data, res.token);
        showSnackbar('Verification successful! Redirecting...', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        showSnackbar(res.message || 'Verification failed', 'error');
      }
    } catch (err) {
      console.error('Verify error', err);
      showSnackbar(err.message || 'Verification failed', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await api.sendOtp({ email });
      showSnackbar('OTP resent to email/phone', 'success');
    } catch (err) {
      console.error('Resend error', err);
      showSnackbar(err.message || 'Failed to resend OTP', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#eef2ff] via-white to-[#f5f3ff] p-4">
      <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-gray-100 w-full max-w-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Enter verification code</h2>
        <p className="text-sm text-gray-600 mb-4">We sent a 5-digit code to {email}. Enter it below to continue.</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            label="Verification Code"
            placeholder="e.g. 12345"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={5}
            required
          />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={handleResend} disabled={isResending}>
              {isResending ? 'Resending...' : 'Resend'}
            </Button>
            <Button type="submit" disabled={isVerifying}>{isVerifying ? 'Verifying...' : 'Verify'}</Button>
          </div>
        </form>

        <div className="text-center mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            className="text-xs sm:text-sm text-gray-500 hover:text-[#4361ee] transition-colors"
          >
            <i className="fas fa-headset mr-1.5"></i>
            Having trouble? Contact Admin
          </button>
        </div>
      </div>

      <ContactQueryModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        source="verify-otp"
      />
    </div>
  );
};

export default VerifyOTP;
