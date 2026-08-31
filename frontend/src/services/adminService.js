import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    return api.get('/admin/dashboard');
  },

  // Terminal Check-In & Check-Out
  checkIn: async (data) => {
    return api.post('/admin/check-in', data);
  },

  checkOut: async (data) => {
    return api.post('/admin/check-out', data);
  },

  // Bookings & Payments
  getBookings: async (params = {}) => {
    return api.get('/admin/bookings', { params });
  },

  getPayments: async () => {
    return api.get('/admin/payments');
  },

  // Location Management
  createLocation: async (data) => {
    return api.post('/admin/locations', data);
  },

  updateLocation: async (id, data) => {
    return api.put(`/admin/locations/${id}`, data);
  },

  deleteLocation: async (id) => {
    return api.delete(`/admin/locations/${id}`);
  },

  // Floor Management
  createFloor: async (data) => {
    return api.post('/admin/floors', data);
  },

  updateFloor: async (id, data) => {
    return api.put(`/admin/floors/${id}`, data);
  },

  deleteFloor: async (id) => {
    return api.delete(`/admin/floors/${id}`);
  },

  // Slot Management
  createSlot: async (data) => {
    return api.post('/admin/slots', data);
  },

  updateSlot: async (id, data) => {
    return api.put(`/admin/slots/${id}`, data);
  },

  toggleSlotMaintenance: async (id, maintenance) => {
    return api.put(`/admin/slots/${id}/maintenance?maintenance=${maintenance}`);
  },

  deleteSlot: async (id) => {
    return api.delete(`/admin/slots/${id}`);
  },

  // Pricing & Coupons
  getPricingRules: async () => {
    return api.get('/admin/pricing');
  },

  savePricingRule: async (data) => {
    return api.post('/admin/pricing', data);
  },

  getCoupons: async () => {
    return api.get('/admin/coupons');
  },

  createCoupon: async (data) => {
    return api.post('/admin/coupons', data);
  },

  updateCoupon: async (id, data) => {
    return api.put(`/admin/coupons/${id}`, data);
  },

  deleteCoupon: async (id) => {
    return api.delete(`/admin/coupons/${id}`);
  }
};
