import apiClient from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  profile?: {
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    emergencyContact?: {
      name?: string;
      phone?: string;
      relationship?: string;
    };
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authApi = {
  // Register new user
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'doctor' | 'patient';
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    name?: string;
    profile?: Partial<User['profile']>;
  }): Promise<User> => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },
};
