import api from './api';

export async function updateProfile(data) {
  const { data: res } = await api.patch('/me', data);
  return res;
}
export async function changePassword(data) {
  const { data: res } = await api.post('/me/change-password', data);
  return res;
}
export async function uploadAvatar(file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/me/avatar', form);
  return data;
}