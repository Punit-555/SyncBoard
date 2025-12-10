import { useState, useEffect } from 'react';

const UpdateNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    console.log('🔄 UpdateNotification component mounted');

    // Get the initial version when the app loads
    fetchVersion().then((version) => {
      setCurrentVersion(version);
      console.log('📦 Current app version:', version);
      console.log('✅ Version check initialized. Will check every 30 seconds.');
    }).catch((error) => {
      console.error('❌ Failed to fetch initial version:', error);
    });

    // Check for new version every 30 seconds (for testing - change to 5 min later)
    const interval = setInterval(() => {
      console.log('⏰ Running scheduled version check...');
      checkForUpdate();
    }, 30 * 1000); // 30 seconds for testing

    // Also check on window focus (when user comes back to the tab)
    const handleFocus = () => {
      console.log('👀 Window focused - checking for updates...');
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
      const url = `/version.json?t=${Date.now()}`;
      console.log('🌐 Fetching version from:', url);
      const response = await fetch(url);

      if (!response.ok) {
        console.error('❌ Failed to fetch version.json:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      console.log('📄 Version data received:', data);
      return data.buildId || data.buildTime;
    } catch (error) {
      console.error('❌ Error fetching version:', error);
      return null;
    }
  };

  const checkForUpdate = async () => {
    if (!currentVersion) {
      console.log('⚠️ Current version not set yet, skipping check');
      return;
    }

    const latestVersion = await fetchVersion();

    if (latestVersion && latestVersion !== currentVersion) {
      console.log('🆕 New version detected!', {
        current: currentVersion,
        latest: latestVersion,
      });
      setShowNotification(true);
    } else {
      console.log('✅ App is up to date');
    }
  };

  const handleReload = () => {
    console.log('🔄 Reloading app with cache clear...');
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
    console.log('⏰ Notification dismissed, will check again in 10 minutes');
    setShowNotification(false);
    // Show again after 10 minutes
    setTimeout(() => {
      checkForUpdate();
    }, 10 * 60 * 1000);
  };

  const manualCheckForUpdate = async () => {
    console.log('🔍 Manual update check triggered');
    await checkForUpdate();
  };

  return (
    <>
      {/* Debug Panel (Bottom Right) - Remove this after testing */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-gray-800 text-white px-3 py-2 rounded-full text-xs shadow-lg hover:bg-gray-700 transition-colors"
          title="Version Debug Info"
        >
          <i className="fas fa-info-circle"></i> v{currentVersion?.toString().substring(0, 8) || 'loading'}
        </button>

        {showDebug && (
          <div className="absolute bottom-12 right-0 bg-white text-gray-800 p-4 rounded-lg shadow-xl w-80 text-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Version Debug</h3>
              <button onClick={() => setShowDebug(false)} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <strong>Current Version:</strong>
                <div className="bg-gray-100 p-2 rounded mt-1 font-mono break-all text-xs">
                  {currentVersion || 'Not loaded'}
                </div>
              </div>
              <div className="pt-2 border-t">
                <button
                  onClick={manualCheckForUpdate}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs transition-colors"
                >
                  <i className="fas fa-sync mr-2"></i>
                  Check for Updates Now
                </button>
              </div>
              <div className="text-gray-500 text-xs italic">
                Auto-checks every 30 seconds
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update Notification Snackbar */}
      {showNotification && (
        <div
          className="fixed top-5 right-5 z-[9999] animate-slide-in"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-start gap-4 min-w-[350px] max-w-md border-l-4 border-blue-300">
            <div className="flex-shrink-0 mt-0.5">
              <i className="fas fa-rocket text-2xl"></i>
            </div>
            <div className="flex-1">
              <p className="font-bold text-base mb-1">
                🎉 New Version Available!
              </p>
              <p className="text-sm opacity-90 mb-3">
                A new update has been deployed. Reload to get the latest features and fixes.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 rounded-md transition-colors font-medium"
                >
                  Later
                </button>
                <button
                  onClick={handleReload}
                  className="px-4 py-1.5 text-xs bg-white text-blue-600 hover:bg-gray-100 rounded-md transition-colors font-semibold flex items-center gap-1"
                >
                  <i className="fas fa-sync-alt"></i>
                  Reload Now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 ml-2 hover:bg-white/20 rounded p-1 transition-colors"
              aria-label="Close notification"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateNotification;
