import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
    children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // If authenticated, redirect to /sessions (or the 'from' location if it exists)
    // Note: 'from' is usually set when redirecting TO login, so it might not be relevant here for ALREADY logged in users 
    // trying to access login page unless they clicked 'Back' or somehow navigated there.
    // We'll just default to /sessions.

    if (isAuthenticated) {
        return <Navigate to="/sessions" replace />;
    }

    return children;
};

export default PublicRoute;
