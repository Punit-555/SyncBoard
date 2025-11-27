import { useState } from 'react';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: 'John Doe',
    email: 'john@taskflow.com',
    username: 'johndoe',
    jobTitle: 'Product Manager',

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would apply dark mode to the entire app here
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="animate-fadeIn max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-scaleIn">
          <i className="fas fa-check-circle text-green-500 text-xl"></i>
          <p className="text-green-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Appearance Settings */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <i className="fas fa-palette text-[#4361ee]"></i>
                  Appearance
                </h2>
                <p className="text-gray-600 text-sm mt-1">Customize how TaskFlow looks</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-800' : 'bg-yellow-400'
                  } transition-colors duration-300`}>
                    <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Dark Mode</h3>
                    <p className="text-sm text-gray-600">
                      {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    isDarkMode ? 'bg-[#4361ee]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Settings */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-user text-[#4361ee]"></i>
              Profile Information
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={settings.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />

                <Input
                  label="Username"
                  name="username"
                  value={settings.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />

                <Input
                  label="Job Title"
                  name="jobTitle"
                  value={settings.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter your job title"
                />
              </div>
            </form>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
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
        <div className="animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
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

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <i className="fas fa-redo mr-2"></i>
            Reset
          </Button>
          <Button onClick={handleSubmit}>
            <i className="fas fa-save mr-2"></i>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
