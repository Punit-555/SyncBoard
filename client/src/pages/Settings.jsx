import { useState } from 'react';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import * as api from '../utils/api';
import { useSnackbar } from '../utils/useSnackbar';
import Snackbar from '../components/ui/Snackbar';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyDigest: false,

    // Preferences
    language: 'en',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    startOfWeek: 'monday',
  });

  const [saved, setSaved] = useState(false);
  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();

  const handleToggle = (field) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await api.deleteAccount();
      if (response.success) {
        showSuccess('Account deleted successfully! Redirecting to home...');
        setTimeout(() => {
          localStorage.removeItem('token');
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      showError(error.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would apply dark mode to the entire app here
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="animate-fadeIn max-w-5xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Settings</h1>
        <p className="text-gray-600 text-sm md:text-base">Manage your account settings and preferences</p>
      </div>

      {saved && (
        <div className="mb-4 md:mb-6 bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 flex items-center gap-3 animate-scaleIn text-sm md:text-base">
          <i className="fas fa-check-circle text-green-500 text-lg md:text-xl flex-shrink-0"></i>
          <p className="text-green-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {/* Appearance Settings */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-palette text-[#4361ee]"></i>
                  Appearance
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mt-1">Customize how SyncBoard looks</p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-yellow-400'
                  } transition-colors duration-300`}>
                    <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-white text-lg`}></i>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">Dark Mode</h3>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-12 h-7 md:w-14 md:h-7 rounded-full transition-colors duration-300 flex-shrink-0 ${
                    isDarkMode ? 'bg-[#4361ee]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-6 md:translate-x-8' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-bell text-[#4361ee]"></i>
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive email updates about your tasks</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    settings.emailNotifications ? 'bg-[#4361ee]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      settings.emailNotifications ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                </div>
                <button
                  onClick={() => handleToggle('pushNotifications')}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    settings.pushNotifications ? 'bg-[#4361ee]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      settings.pushNotifications ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">Task Reminders</h3>
                  <p className="text-sm text-gray-600">Get reminded about upcoming deadlines</p>
                </div>
                <button
                  onClick={() => handleToggle('taskReminders')}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    settings.taskReminders ? 'bg-[#4361ee]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      settings.taskReminders ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-800">Weekly Digest</h3>
                  <p className="text-sm text-gray-600">Weekly summary of your tasks and progress</p>
                </div>
                <button
                  onClick={() => handleToggle('weeklyDigest')}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    settings.weeklyDigest ? 'bg-[#4361ee]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      settings.weeklyDigest ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Preferences */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-sliders-h text-[#4361ee]"></i>
              Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Language"
                name="language"
                value={settings.language}
                onChange={handleChange}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'ja', label: 'Japanese' },
                ]}
              />

              <Select
                label="Timezone"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                options={[
                  { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
                  { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
                  { value: 'UTC-6', label: 'Central Time (UTC-6)' },
                  { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
                  { value: 'UTC+0', label: 'GMT (UTC+0)' },
                  { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
                ]}
              />

              <Select
                label="Date Format"
                name="dateFormat"
                value={settings.dateFormat}
                onChange={handleChange}
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
              />

              <Select
                label="Start of Week"
                name="startOfWeek"
                value={settings.startOfWeek}
                onChange={handleChange}
                options={[
                  { value: 'sunday', label: 'Sunday' },
                  { value: 'monday', label: 'Monday' },
                ]}
              />
            </div>
          </Card>
        </div>

        {/* Delete Account Section */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <i className="fas fa-trash-alt text-red-500"></i>
                  Delete Account
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white border-0 w-full md:w-auto"
              >
                <i className="fas fa-trash-alt mr-2"></i>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
          <Button variant="outline" onClick={() => window.location.reload()} className="text-sm md:text-base">
            <i className="fas fa-redo mr-2"></i>
            Reset
          </Button>
          <Button onClick={handleSubmit} className="text-sm md:text-base">
            <i className="fas fa-save mr-2"></i>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => !isDeleting && setIsDeleteConfirmOpen(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <i className="fas fa-exclamation-circle text-red-600 text-xl mt-0.5 shrink-0"></i>
            <div>
              <p className="text-sm font-semibold text-red-800">Are you sure you want to delete your account?</p>
              <p className="text-xs text-red-700 mt-1">This action cannot be undone. All your data will be permanently deleted.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <i className="fas fa-info-circle text-blue-600 text-lg mt-0.5 shrink-0"></i>
            <p className="text-xs text-blue-800">You will receive a confirmation email after account deletion.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
            >
              {isDeleting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash-alt mr-2"></i>
                  Yes, Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Snackbar for messages */}
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

export default Settings;
