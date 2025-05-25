import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flow API
export const flowApi = {
  getFlows: () => api.get('/flows'),
  getFlow: (id: string) => api.get(`/flows/${id}`),
  createFlow: (data: any) => api.post('/flows', data),
  updateFlow: (id: string, data: any) => api.put(`/flows/${id}`, data),
  deleteFlow: (id: string) => api.delete(`/flows/${id}`),
};

// Template API
export const templateApi = {
  getTemplates: () => api.get('/templates'),
  getTemplatesByCategory: (category: string) =>
    api.get(`/templates/category/${category}`),
  createTemplate: (data: any) => api.post('/templates', data),
  updateTemplate: (id: string, data: any) =>
    api.put(`/templates/${id}`, data),
  deleteTemplate: (id: string) => api.delete(`/templates/${id}`),
};

// Chat API
export const chatApi = {
  initializeChat: (flowId: string) =>
    api.post('/chat/initialize', { flowId }),
  sendMessage: (flowId: string, message: string, context: any) =>
    api.post('/chat/message', { flowId, message, context }),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      authApi.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 