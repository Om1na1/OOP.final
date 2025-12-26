import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

const PrivateRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

