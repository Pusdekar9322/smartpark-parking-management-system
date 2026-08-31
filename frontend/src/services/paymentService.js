import api from './api';

export const paymentService = {
  createRazorpayOrder: async (bookingId) => {
    return api.post('/payments/create-order', { bookingId });
  },

  verifyPayment: async (data) => {
    return api.post('/payments/verify', data);
  },

  getPaymentReceipt: async (paymentId) => {
    return api.get(`/payments/${paymentId}`);
  },

  getPaymentByBooking: async (bookingId) => {
    return api.get(`/payments/booking/${bookingId}`);
  }
};
