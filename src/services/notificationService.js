import api from './api';

export async function getNotifications() {
  const { data } = await api.get('/notifications');
  return data.data;
}
export async function markAllRead() {
  await api.post('/notifications/read-all');
}
export async function markOneRead(id) {
  await api.post(`/notifications/${id}/read`);
}