import api from './api';

export async function register(payload) {
  const { data } = await api.post('/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post('/login', payload);
  return data;
}

export async function verifyEmailCode(code) {
  const { data } = await api.post('/auth/email/verify', { code });
  return data;
}

export async function resendEmailVerificationCode() {
  const { data } = await api.post('/auth/email/resend');
  return data;
}

export async function verify2fa(payload) {
  const { data } = await api.post('/verify-2fa', payload);
  return data;
}

export async function forgotPassword(payload) {
  const { data } = await api.post('/forgot-password', payload);
  return data;
}

export async function resetPassword(payload) {
  const { data } = await api.post('/reset-password', payload);
  return data;
}

export async function logout() {
  await api.post('/logout');
}

export async function getMe() {
  const { data } = await api.get('/me');
  return data;
}