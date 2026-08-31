import api from './api';

export const vehicleService = {
  getMyVehicles: async () => {
    return api.get('/vehicles');
  },

  getVehicleById: async (id) => {
    return api.get(`/vehicles/${id}`);
  },

  addVehicle: async (data) => {
    return api.post('/vehicles', data);
  },

  updateVehicle: async (id, data) => {
    return api.put(`/vehicles/${id}`, data);
  },

  deleteVehicle: async (id) => {
    return api.delete(`/vehicles/${id}`);
  }
};
