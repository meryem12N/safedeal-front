import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('safedeal_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  register: (data) => apiInstance.post('/register', data),
  login: (data) => apiInstance.post('/login', data),
  logout: () => apiInstance.post('/logout'),
  me: () => apiInstance.get('/me'),
  forgotPassword: (email) => apiInstance.post('/forgot-password', { email }),
  resetPassword: (data) => apiInstance.post('/reset-password', data),
};

export const identity = {
  verify: (formData) => apiInstance.post('/verify-identity', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  status: () => apiInstance.get('/verify-identity/status'),
};

export const transactions = {
  create: (data) => apiInstance.post('/transactions', data),
  getOne: (id) => apiInstance.get(`/transactions/${id}`),
  getAll: (params) => apiInstance.get('/transactions', { params }),
  pay: (id, data) => apiInstance.post(`/transactions/${id}/pay`, data),
  ship: (id, formData) => apiInstance.post(`/transactions/${id}/ship`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  confirm: (id, data) => apiInstance.post(`/transactions/${id}/confirm`, data),
  cancel: (id, data) => apiInstance.patch(`/transactions/${id}/cancel`, data),
};

export const disputes = {
  create: (formData) => apiInstance.post('/disputes', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getOne: (id) => apiInstance.get(`/disputes/${id}`),
  respond: (id, formData) => apiInstance.post(`/disputes/${id}/respond`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const notifications = {
  getAll: (params) => apiInstance.get('/notifications', { params }),
  markRead: (id) => apiInstance.patch(`/notifications/${id}/read`),
};

export const admin = {
  getVerifications: (params) => apiInstance.get('/admin/verifications', { params }),
  reviewVerification: (id, data) => apiInstance.patch(`/admin/verifications/${id}`, data),
  getDisputes: (params) => apiInstance.get('/admin/disputes', { params }),
  resolveDispute: (id, data) => apiInstance.patch(`/admin/disputes/${id}/resolve`, data),
};

export default apiInstance;