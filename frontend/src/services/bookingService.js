import api from './api';

export const bookingService = {
  createBooking: async (data) => {
    return api.post('/bookings', data);
  },

  getMyBookings: async () => {
    return api.get('/bookings/my');
  },

  getBookingById: async (id) => {
    return api.get(`/bookings/${id}`);
  },

  getBookingByNumber: async (bookingNumber) => {
    return api.get(`/bookings/number/${bookingNumber}`);
  },

  cancelBooking: async (id) => {
    return api.put(`/bookings/${id}/cancel`);
  },

  getInvoice: async (invoiceId) => {
    return api.get(`/invoices/${invoiceId}`);
  },

  getInvoiceByBookingId: async (bookingId) => {
    return api.get(`/invoices/booking/${bookingId}`);
  },

  getInvoicePdfUrl: (invoiceId) => {
    return `/api/invoices/${invoiceId}/pdf`;
  },

  applyCoupon: async (couponCode, bookingAmount) => {
    return api.post('/coupons/apply', { couponCode, bookingAmount });
  },

  getActiveCoupons: async () => {
    return api.get('/coupons/active');
  }
};
