import api from './api';

export async function submitIdentity(formData) {
  const { data } = await api.post('/verify-identity', formData);
  return data;
}

export async function getIdentityStatus() {
  const { data } = await api.get('/verify-identity/status');
  return data;
}