import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserRoute: React.FC = () => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login page, but save the current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role === 'ADMIN') {
        // Admins cannot access user routes, redirect to admin dashboard
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Role is USER (or at least not ADMIN), authorize
    return <Outlet />;
};

export default UserRoute;
