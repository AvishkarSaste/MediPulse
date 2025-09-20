import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, User } from '../api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'doctor' | 'patient';
  }) => Promise<{ error: string | null }>;
  logout: () => void;
  updateProfile: (profileData: {
    name?: string;
    profile?: Partial<User['profile']>;
  }) => Promise<{ error: string | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Fetch full user profile
      const userProfile = await authApi.getProfile();
      setUser(userProfile);
      
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'doctor' | 'patient';
  }) => {
    try {
      const response = await authApi.register(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Fetch full user profile
      const userProfile = await authApi.getProfile();
      setUser(userProfile);
      
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (profileData: {
    name?: string;
    profile?: Partial<User['profile']>;
  }) => {
    try {
      const updatedUser = await authApi.updateProfile(profileData);
      setUser(updatedUser);
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || 'Profile update failed' };
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};