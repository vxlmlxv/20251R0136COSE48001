
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse } from '@/lib/types';
import { authService } from '@/services/auth-service';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS } from '@/lib/config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        try {
          const userProfile = await authService.getProfile();
          setUser(userProfile);
        } catch (error) {
          // Token might be expired or invalid
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const authResponse: AuthResponse = await authService.login(email, password);
      
      // Store the JWT token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResponse.accessToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authResponse.user));
      
      setUser(authResponse.user);
      
      toast({
        title: 'Login successful',
        description: 'You have been logged in successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout fails on backend, clear local data
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setUser(null);
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      const authResponse: AuthResponse = await authService.register(email, password, name);
      
      // Store the JWT token
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authResponse.accessToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authResponse.user));
      
      setUser(authResponse.user);
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Signup failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
