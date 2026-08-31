import api from './api';

export const passService = {
  purchasePass: async (data) => {
    return api.post('/passes', data);
  },

  getMyPasses: async () => {
    return api.get('/passes/my');
  },

  getPassById: async (id) => {
    return api.get(`/passes/${id}`);
  },

  cancelPass: async (id) => {
    return api.put(`/passes/${id}/cancel`);
  }
};
