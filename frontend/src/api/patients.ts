import apiClient from './client';
import { User } from './auth';

export const patientsApi = {
  // Get all patients (admin and doctor only)
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/patients');
    return response.data;
  },

  // Get patient by ID
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  // Search patients
  search: async (query: string): Promise<User[]> => {
    const response = await apiClient.get(`/patients/search/${encodeURIComponent(query)}`);
    return response.data;
  },
};