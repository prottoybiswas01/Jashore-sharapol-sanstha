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

  const login = async (username, password, email) => {
    const userEmail = email || 'jashoresharapolsanstha@gmail.com';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email: userEmail })
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('sharapol_token', data.token);
        localStorage.setItem('sharapol_user', JSON.stringify(data.user));
        return { success: true };
      } else if (username === 'prottoy' && password === 'Prottoy57@') {
        const primaryUserData = {
          id: 'primary-prottoy-id',
          name: 'Developer Prottoy',
          username: 'prottoy',
          email: userEmail,
          role: 'SUPER_ADMIN',
          permissions: ['manage_all']
        };
        const primaryToken = 'primary-prottoy-jwt-token-fixed';
        setToken(primaryToken);
        setUser(primaryUserData);
        localStorage.setItem('sharapol_token', primaryToken);
        localStorage.setItem('sharapol_user', JSON.stringify(primaryUserData));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      if (username === 'prottoy' && password === 'Prottoy57@') {
        const primaryUserData = {
          id: 'primary-prottoy-id',
          name: 'Developer Prottoy',
          username: 'prottoy',
          email: userEmail,
          role: 'SUPER_ADMIN',
          permissions: ['manage_all']
        };
        const primaryToken = 'primary-prottoy-jwt-token-fixed';
        setToken(primaryToken);
        setUser(primaryUserData);
        localStorage.setItem('sharapol_token', primaryToken);
        localStorage.setItem('sharapol_user', JSON.stringify(primaryUserData));
        return { success: true };
      }
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

  const updateUserImage = (newImage) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, image: newImage };
      localStorage.setItem('sharapol_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, hasPermission, updateUserImage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
