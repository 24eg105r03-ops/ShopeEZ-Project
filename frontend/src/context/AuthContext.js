import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('shopez_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('shopez_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('shopez_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('shopez_user');
    setUser(null);
  };

  const updateProfile = async (name, email, password) => {
    const { data } = await api.put('/auth/profile', { name, email, password });
    localStorage.setItem('shopez_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  useEffect(() => {
    const handleLogout = () => {
      logout();
    };
    window.addEventListener('shopez-logout', handleLogout);
    return () => window.removeEventListener('shopez-logout', handleLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
