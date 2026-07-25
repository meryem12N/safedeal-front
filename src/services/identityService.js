import api from './api';

export async function submitIdentity(formData) {
  const { data } = await api.post('/verify-identity', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getIdentityStatus() {
  const { data } = await api.get('/verify-identity/status');
  return data;
}