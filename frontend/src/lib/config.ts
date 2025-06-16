// Configuration utilities for the application

export const isDemoMode = () => {
  // Check if we're in demo mode based on environment or URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('demo') === 'true' || 
         window.location.hostname === 'demo.preffy.com' ||
         localStorage.getItem('demoMode') === 'true';
};

export const setDemoMode = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem('demoMode', 'true');
  } else {
    localStorage.removeItem('demoMode');
  }
};

export const getDemoCredentials = () => ({
  email: 'demo@preffy.com',
  password: 'demo123'
});

export const getDemoUser = () => ({
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@preffy.com',
  username: 'demouser',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  locale: 'en-US',
  plan: 'demo'
});

export const config = {
  isDemoMode,
  setDemoMode,
  getDemoCredentials,
  getDemoUser
};
