import api from './api';

export const superAdminService = {
  getDashboardStats: async () => {
    return api.get('/super-admin/dashboard');
  },

  getAllUsers: async () => {
    return api.get('/super-admin/users');
  },

  toggleUserStatus: async (id) => {
    return api.put(`/super-admin/users/${id}/status`);
  },

  getAllAdmins: async () => {
    return api.get('/super-admin/admins');
  },

  createParkingAdmin: async (data) => {
    return api.post('/super-admin/admins', data);
  },

  getAllLocations: async () => {
    return api.get('/super-admin/locations');
  },

  getAllBookings: async () => {
    return api.get('/super-admin/bookings');
  },

  getAllPayments: async () => {
    return api.get('/super-admin/payments');
  }
};
