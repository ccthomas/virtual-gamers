import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import routeConfigs from '../RoutesConfig';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, redirect to home page
  if (!isAuthenticated) {
    return <Navigate to={routeConfigs.unauthorized.path} />;
  }

  // If authenticated, render the children
  return children || <Outlet />;
};

export default PrivateRoute;
