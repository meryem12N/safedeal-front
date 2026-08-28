import api from './api';

export async function getBuyerDashboard() {
  const { data } = await api.get('/dashboard/buyer');
  return data.data;
}
export async function getVendorDashboard(period = '7d', options = {}) {
  const { data } = await api.get(`/dashboard/vendor?period=${period}`, options);
  return data.data;
}
export async function getAdminDashboard(period = '7d') {
  const { data } = await api.get(`/dashboard/admin?period=${period}`);
  return data.data;
}