import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ ...routeProps }: RouteProps) => {
  const { authenticated } = useAuth();

  if (authenticated === null) {
    return null;
  }

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return <Route {...routeProps} />;
};

export default ProtectedRoute;
