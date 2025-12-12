/**
 * Google Analytics Event Tracking Utility
 * Use these functions to track user interactions throughout your app
 */

// Track page views
export const trackPageView = (pagePath) => {
  if (window.gtag) {
    window.gtag('config', 'G-XXXXXXXXXX', {
      page_path: pagePath,
    });
    console.log('📊 Analytics: Page view tracked:', pagePath);
  }
};

// Track custom events
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log('📊 Analytics: Event tracked:', eventName, eventParams);
  }
};

// Track user actions
export const trackUserAction = (action, category, label, value) => {
  trackEvent(action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Predefined event trackers for common actions
export const analytics = {
  // Authentication events
  trackLogin: (method = 'email') => {
    trackEvent('login', { method });
  },

  trackSignup: (method = 'email') => {
    trackEvent('sign_up', { method });
  },

  trackLogout: () => {
    trackEvent('logout');
  },

  // Task events
  trackTaskCreated: (taskPriority) => {
    trackEvent('task_created', {
      task_priority: taskPriority,
    });
  },

  trackTaskCompleted: (taskId) => {
    trackEvent('task_completed', {
      task_id: taskId,
    });
  },

  trackTaskDeleted: () => {
    trackEvent('task_deleted');
  },

  trackTaskUpdated: () => {
    trackEvent('task_updated');
  },

  // Project events
  trackProjectCreated: () => {
    trackEvent('project_created');
  },

  trackProjectViewed: (projectId) => {
    trackEvent('project_viewed', {
      project_id: projectId,
    });
  },

  // User interaction events
  trackSearch: (searchTerm) => {
    trackEvent('search', {
      search_term: searchTerm,
    });
  },

  trackFilter: (filterType, filterValue) => {
    trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  },

  trackSort: (sortBy) => {
    trackEvent('sort_applied', {
      sort_by: sortBy,
    });
  },

  // Profile events
  trackProfileUpdated: () => {
    trackEvent('profile_updated');
  },

  trackProfilePictureUploaded: () => {
    trackEvent('profile_picture_uploaded');
  },

  // Collaboration events
  trackUserInvited: () => {
    trackEvent('user_invited');
  },

  trackTaskAssigned: () => {
    trackEvent('task_assigned');
  },

  // Error events
  trackError: (errorMessage, errorType) => {
    trackEvent('error_occurred', {
      error_message: errorMessage,
      error_type: errorType,
    });
  },

  // Performance events
  trackTiming: (category, variable, value) => {
    trackEvent('timing_complete', {
      name: variable,
      value: value,
      event_category: category,
    });
  },
};

export default analytics;
