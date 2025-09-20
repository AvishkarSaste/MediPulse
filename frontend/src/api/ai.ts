import apiClient from './client';

export const aiApi = {
  // Summarize medical report
  summarizeReport: async (data: {
    reportText: string;
    reportType?: string;
  }): Promise<{
    summary: string;
    originalReport: string;
  }> => {
    const response = await apiClient.post('/ai/summarize-report', data);
    return response.data;
  },

  // AI Chat
  chat: async (data: {
    message: string;
    context?: string;
  }): Promise<{
    response: string;
    timestamp: string;
  }> => {
    const response = await apiClient.post('/ai/chat', data);
    return response.data;
  },

  // Explain medical terms
  explainTerms: async (terms: string[]): Promise<{
    explanations: string;
    terms: string[];
  }> => {
    const response = await apiClient.post('/ai/explain-terms', { terms });
    return response.data;
  },
};
