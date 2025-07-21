// File: src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, authLoaded } = useAuth();
  if (!authLoaded) return null;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
