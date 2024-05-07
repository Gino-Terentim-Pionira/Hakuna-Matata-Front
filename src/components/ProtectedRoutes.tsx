import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

// Requisitions
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ ...routesProps }: RouteProps) => {
    const { authenticated } = useAuth();

    if (!authenticated) {
        return <Redirect to="/" />;
    };
    return <Route {...routesProps} />;
}

export default ProtectedRoute;