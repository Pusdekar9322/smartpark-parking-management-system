import api from './api';

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  getProfile: async () => {
    return api.get('/users/me');
  },

  updateProfile: async (data) => {
    return api.put('/users/me', data);
  },

  changePassword: async (data) => {
    return api.put('/users/me/password', data);
  }
};
