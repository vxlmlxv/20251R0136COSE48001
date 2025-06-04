
import { api } from '@/lib/api-client';
import { User } from '@/lib/types';

// In a real app, these would interact with a real backend
// For now, they simulate API calls but still use the mock data

export const authService = {
  /**
   * Authenticate a user with email and password
   */
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Simulate API call with local storage for prototype
      return await api.post('/auth/login', { email, password }, { withAuth: false });
    } catch (error) {
      // For the prototype, we'll handle this in the auth context
      throw error;
    }
  },
  
  /**
   * Create a new user account
   */
  signup: async (name: string, email: string, password: string): Promise<User> => {
    try {
      return await api.post('/auth/signup', { name, email, password }, { withAuth: false });
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Log out the current user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // For the prototype, we'll handle this in the auth context
      throw error;
    }
  },
  
  /**
   * Get the current user profile
   */
  getProfile: async (): Promise<User> => {
    return await api.get('/auth/profile');
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return await api.put('/auth/profile', userData);
  },
};
