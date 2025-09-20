import apiClient from './client';

export interface Emergency {
  id: number;
  patientId: string;
  patientName: string;
  emergencyType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  description?: string;
  status: 'Active' | 'In Progress' | 'Resolved';
  createdAt: string;
  assignedDoctor?: string;
}

export const emergenciesApi = {
  // Get all emergencies (admin and doctor only)
  getAll: async (): Promise<Emergency[]> => {
    const response = await apiClient.get('/emergencies');
    return response.data;
  },

  // Create emergency
  create: async (emergencyData: {
    emergencyType: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    location: string;
    description?: string;
  }): Promise<Emergency> => {
    const response = await apiClient.post('/emergencies', emergencyData);
    return response.data;
  },

  // Update emergency status
  updateStatus: async (id: number, updateData: {
    status?: 'Active' | 'In Progress' | 'Resolved';
    assignedDoctor?: string;
  }): Promise<Emergency> => {
    const response = await apiClient.put(`/emergencies/${id}`, updateData);
    return response.data;
  },
};