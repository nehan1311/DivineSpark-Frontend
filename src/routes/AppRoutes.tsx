import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Sessions from '../pages/Sessions';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Settings from '../pages/Settings';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="sessions" element={
                    <ProtectedRoute>
                        <Sessions />
                    </ProtectedRoute>
                } />
                <Route path="settings" element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                } />
                <Route path="login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
