import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopwave_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('shopwave_token');
    if (token) {
      authAPI.getMe()
        .then((res) => setUser(res.data))
        .catch(() => { localStorage.removeItem('shopwave_token'); localStorage.removeItem('shopwave_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const userData = res.data;
    localStorage.setItem('shopwave_token', userData.token);
    localStorage.setItem('shopwave_user', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${userData.name.split(' ')[0]}! 👋`);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const userData = res.data;
    localStorage.setItem('shopwave_token', userData.token);
    localStorage.setItem('shopwave_user', JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome to ShopWave, ${userData.name.split(' ')[0]}! 🎉`);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('shopwave_token');
    localStorage.removeItem('shopwave_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((data) => {
    setUser((prev) => { const updated = { ...prev, ...data }; localStorage.setItem('shopwave_user', JSON.stringify(updated)); return updated; });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
