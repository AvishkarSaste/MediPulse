import apiClient from './client';
import { User } from './auth';

export const doctorsApi = {
  // Get all doctors
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/doctors');
    return response.data;
  },

  // Get doctor by ID
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data;
  },
};
