import { useState, useEffect, useRef } from 'react';
import Input from './Input';
import Button from './Button';
import * as api from '../../utils/api';
import { useSnackbar } from '../../utils/useSnackbar';
import Snackbar from './Snackbar';
import Select from './Select';
import { useAuth } from '../../hooks/useAuth';

const ProfileEditModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    profilePicture: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { user, refreshUser } = useAuth();
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          role: response.data.role ? response.data.role.toLowerCase() : '',
          profilePicture: response.data.profilePicture || '',
        });
        if (response.data.profilePicture) {
          setPreviewUrl(`${API_BASE}${response.data.profilePicture}`);
        }
      }
    } catch (error) {
      showError('Failed to load user data');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Image size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await api.uploadProfilePicture(selectedFile);
      if (response.success) {
        showSuccess('Profile picture updated successfully!');
        setSelectedFile(null);
        await refreshUser();
        onProfileUpdated?.();
      }
    } catch (error) {
      showError(error.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      setIsUploading(true);
      await api.deleteProfilePicture();
      showSuccess('Profile picture removed successfully!');
      setPreviewUrl(null);
      setSelectedFile(null);
      setFormData({ ...formData, profilePicture: '' });
      await refreshUser();
      onProfileUpdated?.();
    } catch (error) {
      showError(error.message || 'Failed to delete profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showError('First name and last name are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.updateUserProfile({
  firstName: formData.firstName,
  lastName: formData.lastName,
});


      if (!response.success) {
        throw new Error(response.message || 'Update failed');
      }

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

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' },
  ];  

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-300 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
          {/* Header */}
          <div className="bg-linear-to-br from-[#4361ee] to-[#4895ef] p-6 rounded-t-2xl">
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
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Profile Picture
                </label>
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {formData.firstName?.[0]}{formData.lastName?.[0]}
                      </span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    disabled={isUploading}
                  >
                    <i className="fas fa-upload mr-2"></i>
                    {selectedFile ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleUploadProfilePicture}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check mr-2"></i>
                          Save Photo
                        </>
                      )}
                    </button>
                  )}
                  {(previewUrl && !selectedFile) && (
                    <button
                      type="button"
                      onClick={handleDeleteProfilePicture}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      disabled={isUploading}
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Remove
                    </button>
                  )}
                </div>
              </div>

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
                className="bg-gray-100 cursor-not-allowed text-black/60"
              />

              <Select
                className="bg-gray-100 cursor-not-allowed text-black/60"
                disabled
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions} 
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                <p className="text-sm text-blue-800">
                  Email address and role cannot be changed for security reasons. Contact support if you need to update them.
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
