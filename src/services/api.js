import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('safedeal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/login') || error.config?.url?.includes('/register');
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('safedeal_token');
      localStorage.removeItem('safedeal_user');
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth?mode=login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;