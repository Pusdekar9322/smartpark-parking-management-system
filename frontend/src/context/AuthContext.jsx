import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartpark_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('smartpark_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authService.getProfile()
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('smartpark_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.data?.token) {
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('smartpark_token', res.data.token);
      localStorage.setItem('smartpark_user', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error('Login failed: Token not received');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data?.token) {
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('smartpark_token', res.data.token);
      localStorage.setItem('smartpark_user', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smartpark_token');
    localStorage.removeItem('smartpark_user');
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('smartpark_user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role,
        isCustomer: user?.role === 'ROLE_CUSTOMER',
        isParkingAdmin: user?.role === 'ROLE_PARKING_ADMIN',
        isSuperAdmin: user?.role === 'ROLE_SUPER_ADMIN',
        isAdmin: user?.role === 'ROLE_PARKING_ADMIN' || user?.role === 'ROLE_SUPER_ADMIN',
        loading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
