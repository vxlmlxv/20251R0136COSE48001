// Environment configuration constants
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000,
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'prefUser',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    UPLOAD_VIDEO: (id: string) => `/projects/${id}/video`,
    ANALYSIS: (id: string) => `/projects/${id}/analysis`,
    STATUS: (id: string) => `/projects/${id}/status`,
    SCRIPT_SEGMENTS: (id: string) => `/projects/${id}/script-segments`,
    POSTURE_EVENTS: (id: string) => `/projects/${id}/posture-events`,
    SUGGESTIONS: (id: string) => `/projects/${id}/suggestions`,
    SUGGESTION_ACTION: (projectId: string, suggestionId: string, action: string) => 
      `/projects/${projectId}/suggestions/${suggestionId}/${action}`,
  },
};
