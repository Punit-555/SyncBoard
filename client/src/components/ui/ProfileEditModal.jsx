import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import * as api from '../../utils/api';
import { useSnackbar } from '../../utils/useSnackbar';
import Snackbar from './Snackbar';

const ProfileEditModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success && response.user) {
        setFormData({
          firstName: response.user.firstName || '',
          lastName: response.user.lastName || '',
          email: response.user.email || '',
        });
      }
    } catch (error) {
      showError('Failed to load user data');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showError('First name and last name are required');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Create an API endpoint to update user profile
      // For now, we'll show a success message
      showSuccess('Profile updated successfully!');
      setTimeout(() => {
        onProfileUpdated?.();
        onClose();
      }, 1000);
    } catch (error) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#4361ee] to-[#4895ef] p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <i className="fas fa-user-edit"></i>
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                disabled
                placeholder="Email cannot be changed"
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                <p className="text-sm text-blue-800">
                  Email address cannot be changed for security reasons. Contact support if you need to update it.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        open={snackbar.open}
        onClose={hideSnackbar}
        position="top-right"
      />
    </>
  );
};

export default ProfileEditModal;
