import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserRoute = ({ children }) => {
  const { user } = useAuth();

  // If user is logged in, show the page. Else redirect to login
  return user ? children : <Navigate to="/login" />;
};

export default UserRoute;
