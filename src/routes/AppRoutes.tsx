import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Sessions from '../pages/Sessions';
import AllSessions from '../pages/AllSessions';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import Register from '../pages/Register';

import SessionDetails from '../pages/SessionDetails';

import AdminDashboard from '../pages/admin/AdminDashboard';
import OAuthSuccess from '../pages/OAuthSuccess';
import Profile from '../pages/Profile';

import Donate from '../pages/Donate';
import About from '../pages/About';
import MyBookings from '../pages/MyBookings';
import ReviewsPage from '../pages/ReviewsPage';
import Blogs from '../pages/Blogs';
import BlogDetails from '../pages/BlogDetails';
import EnergyWorkshops from '../pages/programs/EnergyWorkshops';
import SpiritualTrips from '../pages/programs/SpiritualTrips';



import UserRoute from './UserRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';

import { useAuth } from '../context/AuthContext';

const RootRedirect = () => {
    const { isAuthenticated, role } = useAuth();
    if (isAuthenticated && role === 'ADMIN') {
        return <Navigate to="/admin/dashboard" replace />;
    }
    return <Home />;
};

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
                <Route index element={<RootRedirect />} />
                <Route path="sessions" element={<Sessions />} />
                <Route path="allsessions" element={<AllSessions />} />

                <Route path="sessions/:sessionId" element={<SessionDetails />} />
                <Route path="about" element={<About />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="blogs/:slug" element={<BlogDetails />} />

                {/* Programs */}
                <Route path="programs/energy-workshops" element={<EnergyWorkshops />} />
                <Route path="programs/spiritual-trips" element={<SpiritualTrips />} />



                {/* Guest Routes (Redirects if authenticated) */}
                <Route element={<PublicRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="register" element={<Register />} />
                    <Route path="oauth-success" element={<OAuthSuccess />} />

                </Route>

                <Route element={<UserRoute />}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="my-bookings" element={<MyBookings />} />

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
                <Route path="reviews" element={<AdminDashboard />} />
                <Route path="blogs" element={<AdminDashboard />} />
                <Route path="events" element={<AdminDashboard />} />
                <Route path="programs" element={<AdminDashboard />} />
            </Route>

        </Routes>
    );
};

export default AppRoutes;
