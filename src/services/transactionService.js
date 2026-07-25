import axios from 'axios';
import api from './api';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
});

export async function createTransaction(payload) {
  const { data } = await api.post('/transactions', payload);
  return data;
}

export async function getTransactions(filters = {}) {
  const { data } = await api.get('/transactions', {
    params: filters,
  });
  return data;
}

export async function getTransactionByToken(token) {
  const { data } = await publicApi.get(`/transactions/${token}`);
  return data;
}

export async function cancelTransaction(id) {
  try {
    const { data } = await api.patch(`/transactions/${id}/cancel`);
    return data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('Cannot cancel this transaction.');
    }

    if (error.response?.status === 409) {
      throw new Error('Transaction already paid.');
    }

    throw error;
  }
}
