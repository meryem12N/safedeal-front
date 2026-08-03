import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('safedeal_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem('safedeal_token');
        localStorage.removeItem('safedeal_user');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    try {
      const data = await authService.login(payload);
      if (data.token) {
        localStorage.setItem('safedeal_token', data.token);
        if (data.user) {
          localStorage.setItem('safedeal_user', JSON.stringify(data.user));
          setUser(data.user);
        }
      }
      return data;
    } catch (error) {
      const token = error?.response?.data?.token;
      const user = error?.response?.data?.user;
      if (token) {
        localStorage.setItem('safedeal_token', token);
        if (user) {
          localStorage.setItem('safedeal_user', JSON.stringify(user));
        }
      }
      throw error;
    }
  }

  async function refreshUser() {
    const data = await authService.getMe();
    localStorage.setItem('safedeal_user', JSON.stringify(data));
    setUser(data);
    return data;
  }

  async function verify2fa(payload) {
    const data = await authService.verify2fa(payload);
    localStorage.setItem('safedeal_token', data.token);
    localStorage.setItem('safedeal_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await authService.register(payload);
    if (data.token) {
      localStorage.setItem('safedeal_token', data.token);
      if (data.user) {
        localStorage.setItem('safedeal_user', JSON.stringify(data.user));
      }
    }
    return data;
  }

  async function forgotPassword(payload) {
    return authService.forgotPassword(payload);
  }

  async function resetPassword(payload) {
    return authService.resetPassword(payload);
  }

  function logout() {
    authService.logout().catch(() => {
      // on ignore l'échec, le nettoyage local suffit
    });
    localStorage.removeItem('safedeal_token');
    localStorage.removeItem('safedeal_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, verify2fa, register, forgotPassword, resetPassword, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}