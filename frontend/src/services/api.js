import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartpark_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract data and handle 401 Unauthorized cleanly
api.interceptors.response.use(
  (response) => {
    // If response wrapped in standard ApiResponse, return it directly
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.response?.data?.data ? JSON.stringify(error.response.data.data) : null) ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status === 401) {
      // Clear token and redirect to login if session expired (avoid redirect loop if on login page)
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('smartpark_token');
        localStorage.removeItem('smartpark_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
