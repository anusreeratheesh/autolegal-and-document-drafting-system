// Key constants
const KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_ROLE: 'userRole',
  USER_DATA: 'userData',
  PREFERENCES: 'preferences',
  RECENT_DOCUMENTS: 'recentDocuments',
  DRAFT_DOCUMENTS: 'draftDocuments',
  FILTERS: 'filters',
  THEME: 'theme',
};

// ===== Generic setters/getters =====

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('LocalStorage error:', error);
    return false;
  }
};

export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('LocalStorage error:', error);
    return defaultValue;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('LocalStorage error:', error);
    return false;
  }
};

export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('LocalStorage error:', error);
    return false;
  }
};

// ===== Authentication Storage =====

export const setAuthToken = (token) => {
  return setItem(KEYS.AUTH_TOKEN, token);
};

export const getAuthToken = () => {
  return getItem(KEYS.AUTH_TOKEN);
};

export const removeAuthToken = () => {
  return removeItem(KEYS.AUTH_TOKEN);
};

export const setUserRole = (role) => {
  return setItem(KEYS.USER_ROLE, role);
};

export const getUserRole = () => {
  return getItem(KEYS.USER_ROLE);
};

export const setUserData = (userData) => {
  return setItem(KEYS.USER_DATA, userData);
};

export const getUserData = () => {
  return getItem(KEYS.USER_DATA);
};

export const clearAuthData = () => {
  removeAuthToken();
  removeItem(KEYS.USER_ROLE);
  removeItem(KEYS.USER_DATA);
};

// ===== Preferences Storage =====

export const setPreferences = (preferences) => {
  return setItem(KEYS.PREFERENCES, preferences);
};

export const getPreferences = () => {
  return getItem(KEYS.PREFERENCES, {
    theme: 'light',
    language: 'en',
    notifications: true,
  });
};

export const updatePreference = (key, value) => {
  const prefs = getPreferences();
  prefs[key] = value;
  return setPreferences(prefs);
};

// ===== Document Storage =====

export const setRecentDocuments = (documents) => {
  return setItem(KEYS.RECENT_DOCUMENTS, documents);
};

export const getRecentDocuments = () => {
  return getItem(KEYS.RECENT_DOCUMENTS, []);
};

export const addRecentDocument = (document) => {
  const docs = getRecentDocuments();
  // Remove duplicate if exists
  const filtered = docs.filter((d) => d._id !== document._id);
  // Add to beginning
  filtered.unshift(document);
  // Keep only last 10
  return setRecentDocuments(filtered.slice(0, 10));
};

export const setDraftDocuments = (documents) => {
  return setItem(KEYS.DRAFT_DOCUMENTS, documents);
};

export const getDraftDocuments = () => {
  return getItem(KEYS.DRAFT_DOCUMENTS, []);
};

export const saveDraftDocument = (document) => {
  const drafts = getDraftDocuments();
  const index = drafts.findIndex((d) => d._id === document._id);
  if (index > -1) {
    drafts[index] = document;
  } else {
    drafts.push(document);
  }
  return setDraftDocuments(drafts);
};

export const removeDraftDocument = (documentId) => {
  const drafts = getDraftDocuments();
  const filtered = drafts.filter((d) => d._id !== documentId);
  return setDraftDocuments(filtered);
};

// ===== Filters Storage =====

export const setFilters = (filters) => {
  return setItem(KEYS.FILTERS, filters);
};

export const getFilters = () => {
  return getItem(KEYS.FILTERS, {
    documentType: 'all',
    reviewStatus: 'all',
    sortBy: 'recent',
  });
};

export const updateFilter = (key, value) => {
  const filters = getFilters();
  filters[key] = value;
  return setFilters(filters);
};

// ===== Theme Storage =====

export const setTheme = (theme) => {
  return setItem(KEYS.THEME, theme);
};

export const getTheme = () => {
  return getItem(KEYS.THEME, 'light');
};

// ===== Session Management =====

export const getSessionDuration = () => {
  const loginTime = getItem('loginTime');
  if (!loginTime) return null;
  return Date.now() - loginTime;
};

export const setLoginTime = () => {
  return setItem('loginTime', Date.now());
};

export const isSessionExpired = (maxDuration = 30 * 60 * 1000) => {
  const duration = getSessionDuration();
  return duration && duration > maxDuration;
};

export const clearSession = () => {
  clearAuthData();
  removeItem('loginTime');
};

// ===== Cache Management =====

export const setCacheItem = (key, value, ttl = 60 * 60 * 1000) => {
  // ttl = time to live in milliseconds (default 1 hour)
  const cacheData = {
    value,
    timestamp: Date.now(),
    ttl,
  };
  return setItem(`cache_${key}`, cacheData);
};

export const getCacheItem = (key) => {
  const cacheData = getItem(`cache_${key}`);
  if (!cacheData) return null;

  const { value, timestamp, ttl } = cacheData;
  const isExpired = Date.now() - timestamp > ttl;

  if (isExpired) {
    removeItem(`cache_${key}`);
    return null;
  }

  return value;
};

export const clearCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith('cache_')) {
      removeItem(key);
    }
  });
};
