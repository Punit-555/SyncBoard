import { useState, useEffect } from 'react';
import Button from './ui/Button';

const UpdateNotification = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);

  useEffect(() => {
    // Get the initial version when the app loads
    fetchVersion().then((version) => {
      setCurrentVersion(version);
      console.log('📦 Current app version:', version);
    });

    // Check for new version every 5 minutes
    const interval = setInterval(() => {
      checkForUpdate();
    }, 5 * 60 * 1000); // 5 minutes

    // Also check on window focus (when user comes back to the tab)
    const handleFocus = () => {
      checkForUpdate();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentVersion]);

  const fetchVersion = async () => {
    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/version.json?t=${Date.now()}`);
      const data = await response.json();
      return data.buildId || data.buildTime;
    } catch (error) {
      console.error('Failed to fetch version:', error);
      return null;
    }
  };

  const checkForUpdate = async () => {
    if (!currentVersion) return;

    const latestVersion = await fetchVersion();

    if (latestVersion && latestVersion !== currentVersion) {
      console.log('🆕 New version detected!', {
        current: currentVersion,
        latest: latestVersion,
      });
      setShowBanner(true);
    }
  };

  const handleReload = () => {
    // Clear cache and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    window.location.reload(true);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Show again after 10 minutes
    setTimeout(() => {
      checkForUpdate();
    }, 10 * 60 * 1000);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg animate-slideDown">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <i className="fas fa-rocket text-2xl"></i>
            </div>
            <div>
              <p className="font-semibold text-sm md:text-base">
                🎉 New Version Available!
              </p>
              <p className="text-xs md:text-sm opacity-90">
                A new update has been deployed. Reload to get the latest features and fixes.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
            >
              Later
            </button>
            <Button
              onClick={handleReload}
              className="px-4 py-1.5 text-sm bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Reload Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
