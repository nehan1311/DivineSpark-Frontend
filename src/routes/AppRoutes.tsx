import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Sessions from '../pages/Sessions';
import Login from '../pages/Login';
import Register from '../pages/Register';

import ProtectedRoute from './ProtectedRoute';

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
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
