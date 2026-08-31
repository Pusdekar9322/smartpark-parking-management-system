import api from './api';

export const parkingService = {
  getLocations: async (params = {}) => {
    return api.get('/parking/locations', { params });
  },

  getLocationById: async (id) => {
    return api.get(`/parking/locations/${id}`);
  },

  getSlotAvailability: async (locationId, params = {}) => {
    return api.get(`/parking/locations/${locationId}/availability`, { params });
  },

  getPricingRules: async () => {
    return api.get('/parking/pricing');
  },

  calculateFee: async (data) => {
    return api.post('/parking/calculate-fee', data);
  }
};
