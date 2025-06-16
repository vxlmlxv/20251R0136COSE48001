
import { api } from '@/lib/api-client';
import { User, AuthResponse } from '@/lib/types';
import { DEMO_CREDENTIALS, mockUsers } from '@/lib/mock-data';
import { STORAGE_KEYS, isDemoMode } from '@/lib/config';

export const authService = {
  /**
   * Authenticate a user with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Check for demo credentials
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const demoUser = mockUsers.find(user => user.email === DEMO_CREDENTIALS.email);
      if (demoUser) {
        const demoResponse: AuthResponse = {
          accessToken: 'demo-token-' + Date.now(),
          tokenType: 'Bearer',
          user: demoUser
        };
        
        // Store demo token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, demoResponse.accessToken);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(demoUser));
        localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
        
        return demoResponse;
      }
    }
    
    // Try real API login
    const response = await api.post<AuthResponse>('/auth/login', { email, password }, { withAuth: false });
    localStorage.removeItem(STORAGE_KEYS.DEMO_MODE); // Ensure demo mode is disabled for real login
    return response;
  },
  
  /**
   * Create a new user account
   */
  register: async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
    // Demo mode doesn't support registration
    if (isDemoMode()) {
      throw new Error('Registration is not available in demo mode');
    }
    
    // Generate username from email (part before @)
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const response = await api.post<AuthResponse>('/auth/register', { 
      username, 
      email, 
      password, 
      fullName 
    }, { withAuth: false });
    
    return response;
  },
  
  /**
   * Log out the current user
   */
  logout: async (): Promise<void> => {
    if (isDemoMode()) {
      // Demo mode logout - just clear local storage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.DEMO_MODE);
      return;
    }
    
    await api.post('/auth/logout');
  },
  
  /**
   * Get the current user profile
   */
  getProfile: async (): Promise<User> => {
    if (isDemoMode()) {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        return JSON.parse(userData);
      }
      throw new Error('Demo user data not found');
    }
    
    const response = await api.get<User>('/auth/profile');
    return response;
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/auth/profile', userData);
    return response;
  },
};
