import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loading from '../common/Loading';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
}

export default ProtectedRoute;

