
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

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

  useEffect(() => {
    // Check if user is logged in from localStorage (mock auth)
    const storedUser = localStorage.getItem('prefUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      localStorage.setItem('prefUser', JSON.stringify(foundUser));
      setUser(foundUser);
    } else {
      throw new Error('Invalid email or password');
    }
    
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('prefUser');
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    setLoading(true);
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
    setLoading(false);
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
