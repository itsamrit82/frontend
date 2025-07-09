import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [adminToken, setAdminToken] = useState('');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      const savedAdminToken = localStorage.getItem('adminToken');

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedToken) setToken(savedToken);
      if (savedAdminToken) setAdminToken(savedAdminToken);
    } catch (err) {
      console.error('Failed to load auth state:', err);
    }
  }, []);

 const login = (data) => {
  const loggedInUser = data.user || data.admin;
  const token = data.token;

  if (!loggedInUser || !token) return;

  if (loggedInUser.role === 'admin') {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    // Optional: store admin in memory if needed
  } else {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setToken(token);
    setUser(loggedInUser);
  }
};

  const logout = () => {
    setUser(null);
    setToken('');
    setAdminToken('');
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        adminToken,
        login,
        logout,
        isAdminLoggedIn: !!adminToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
