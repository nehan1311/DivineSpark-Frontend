import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (role !== 'ADMIN') {
        return <Navigate to="/sessions" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
