import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState('');
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      const savedAdmin = localStorage.getItem('admin');
      const savedAdminToken = localStorage.getItem('adminToken');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
      if (savedAdmin) setAdmin(JSON.parse(savedAdmin));
      if (savedAdminToken) setAdminToken(savedAdminToken);
    } catch (err) {
      console.error('Failed to load auth state:', err);
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  const login = (data) => {
    const loggedInUser = data.user || data.admin;
    const token = data.token;

    if (!loggedInUser || !token) return;

    if (loggedInUser.role === 'admin') {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('admin', JSON.stringify(loggedInUser));
      setAdminToken(token);
      setAdmin(loggedInUser);
      // clear any user state
      setUser(null);
      setToken('');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setToken(token);
      setUser(loggedInUser);
      // clear any admin state
      setAdmin(null);
      setAdminToken('');
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setAdmin(null);
    setAdminToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        admin,
        adminToken,
        login,
        logout,
        isAdminLoggedIn: !!adminToken && !!admin,
        isUserLoggedIn: !!token && !!user,
        authLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};