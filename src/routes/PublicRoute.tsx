import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute: React.FC = () => {
    const { isAuthenticated, role } = useAuth();

    if (isAuthenticated) {
        if (role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        // Default to sessions for normal users
        return <Navigate to="/sessions" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
