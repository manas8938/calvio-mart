import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Simple AuthContext used by admin pages (and others)
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('calvio_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('calvio_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) localStorage.setItem('calvio_token', token);
    else localStorage.removeItem('calvio_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('calvio_user', JSON.stringify(user));
    else localStorage.removeItem('calvio_user');
  }, [user]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('calvio_token');
    localStorage.removeItem('calvio_user');
    // redirect to store or login page
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
