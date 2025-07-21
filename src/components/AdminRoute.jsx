import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { admin, adminToken, authLoaded } = useAuth();
  if (!authLoaded) return null;
  return admin && adminToken ? children : <Navigate to="/login" />;
};

export default AdminRoute;