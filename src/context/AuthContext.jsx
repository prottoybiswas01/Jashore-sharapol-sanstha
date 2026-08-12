import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sharapol_token') || null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sharapol_user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        logout();
      }
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('sharapol_token', data.token);
        localStorage.setItem('sharapol_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'সার্ভার সংযোগে ত্রুটি।' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('sharapol_token', data.token);
        localStorage.setItem('sharapol_user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'সার্ভার সংযোগে ত্রুটি।' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sharapol_token');
    localStorage.removeItem('sharapol_user');
  };

  const hasPermission = (permissionKey) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    const userPerms = user.permissions || [];
    return userPerms.includes(permissionKey) || userPerms.includes('manage_all');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
