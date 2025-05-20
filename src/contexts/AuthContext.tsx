
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import { authService } from '@/services/auth-service';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage (mock auth)
    const storedUser = localStorage.getItem('prefUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // For prototype: Use mock data but simulate API call
      // In a real app, this would call the actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        localStorage.setItem('prefUser', JSON.stringify(foundUser));
        setUser(foundUser);
      } else {
        throw new Error('Invalid email or password');
      }
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

  const logout = () => {
    try {
      // For prototype: Just clear localStorage
      // In a real app, this would also call the API to invalidate the token
      localStorage.removeItem('prefUser');
      setUser(null);
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    
    try {
      // For prototype: Use mock data but simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user (would be done by a backend in real life)
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        locale: 'en-US',
        plan: 'free'
      };
      
      localStorage.setItem('prefUser', JSON.stringify(newUser));
      setUser(newUser);
      
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
