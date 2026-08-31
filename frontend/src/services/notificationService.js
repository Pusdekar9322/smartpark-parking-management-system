import api from './api';

export const notificationService = {
  getNotifications: async () => {
    return api.get('/notifications');
  },

  getUnreadCount: async () => {
    return api.get('/notifications/unread-count');
  },

  markAsRead: async (id) => {
    return api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return api.put('/notifications/read-all');
  }
};
