import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, sellerOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (sellerOnly && user.role !== 'seller') return <Navigate to="/" replace />;
  return children;
};

export default PrivateRoute;
