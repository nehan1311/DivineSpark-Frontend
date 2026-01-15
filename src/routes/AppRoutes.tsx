import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Sessions from '../pages/Sessions';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Settings from '../pages/Settings';
import SessionDetails from '../pages/SessionDetails';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import OAuthSuccess from '../pages/OAuthSuccess';
import Profile from '../pages/Profile';

import Donate from '../pages/Donate';
import Contact from '../pages/Contact';

import UserRoute from './UserRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';

const ProfilePage = () => {
    const navigate = useNavigate();
    return (
        <Profile
            isOpen={true}
            onClose={() => navigate('/')}
        />
    );
};

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* User & Public Interface */}
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="sessions" element={<Sessions />} />

                <Route path="sessions/:sessionId" element={<SessionDetails />} />
                <Route path="contact" element={<Contact />} />

                {/* Guest Routes (Redirects if authenticated) */}
                <Route element={<PublicRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="oauth-success" element={<OAuthSuccess />} />
                    <Route path="admin/login" element={<AdminLogin />} />
                </Route>

                <Route element={<UserRoute />}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="donate" element={<Donate />} />
                </Route>
            </Route>

            {/* Admin Interface (Protected) */}
            <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="sessions" element={<AdminDashboard />} />
                <Route path="users" element={<AdminDashboard />} />
                <Route path="payments" element={<AdminDashboard />} />
                <Route path="donations" element={<AdminDashboard />} />
            </Route>

        </Routes>
    );
};

export default AppRoutes;
