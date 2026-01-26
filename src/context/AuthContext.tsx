import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getToken, setToken, removeToken, cleanupLegacyTokens } from '../utils/authStorage';
import { jwtDecode } from 'jwt-decode';
import { useToast } from './ToastContext';
import axiosInstance from '../api/axios';
import { AUTH_ENDPOINTS } from '../api/endpoints';
import type { User } from '../types/auth.types';

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: (showFeedback?: boolean) => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();

    // Cleanup legacy tokens on mount
    useEffect(() => {
        cleanupLegacyTokens();
    }, []);

    // Helper to decode token safely
    const getRoleFromToken = (token: string | null): string | null => {
        if (!token || token.split('.').length !== 3) return null;

        try {
            const decoded: any = jwtDecode(token);

            // Spring Security common formats
            if (Array.isArray(decoded.authorities)) {
                if (decoded.authorities.includes('ROLE_ADMIN')) return 'ADMIN';
                if (decoded.authorities.includes('ROLE_USER')) return 'USER';
            }

            if (Array.isArray(decoded.roles)) {
                if (decoded.roles.includes('ADMIN')) return 'ADMIN';
                if (decoded.roles.includes('USER')) return 'USER';
            }

            if (decoded.role === 'ADMIN' || decoded.role === 'ROLE_ADMIN') {
                return 'ADMIN';
            }

            return 'USER';
        } catch {
            return null;
        }
    };


    // Initialize state synchronously
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getToken());
    const [role, setRole] = useState<string | null>(() => getRoleFromToken(getToken()));
    const [user, setUser] = useState<User | null>(null);

    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await axiosInstance.get<User>(AUTH_ENDPOINTS.GET_PROFILE);
            setUser(response.data);
        } catch (error) {

            // Optional: don't logout immediately on profile fetch fail, just log it
        }
    }, []);

    const logout = useCallback((showFeedback = true) => {
        removeToken();
        setIsAuthenticated(false);
        setRole(null);
        setUser(null);
        if (showFeedback) {
            showToast('Logged out successfully', 'success');
        }
    }, [showToast]);

    const login = (token: string) => {
        setToken(token);


        setIsAuthenticated(true);
        const userRole = getRoleFromToken(token);

        setRole(userRole);

        // Fetch profile immediately
        fetchUserProfile();

        showToast('Welcome back!', 'success');
    };

    useEffect(() => {
        const handleUnauthorized = () => {
            logout(false);
            showToast('Session expired. Please log in again.', 'error');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [logout, showToast]);

    // Check for token expiration and set timer
    useEffect(() => {
        const token = getToken();
        if (!token || !isAuthenticated) return;

        try {
            const decoded: any = jwtDecode(token);
            if (decoded.exp) {
                const expiresAt = decoded.exp * 1000; // Convert to ms
                const now = Date.now();
                const timeout = expiresAt - now;

                if (timeout <= 0) {
                    // Already expired
                    logout(false);
                    showToast('Session expired. Please log in again.', 'error');
                } else {
                    // Set auto logout timer
                    const timer = setTimeout(() => {
                        logout(false);
                        showToast('Session expired. Please log in again.', 'info');
                    }, timeout);
                    return () => clearTimeout(timer);
                }
            }
        } catch (error) {
            // Invalid token
            logout(false);
        }
    }, [isAuthenticated, logout, showToast]);

    // Fetch profile on mount if authenticated
    useEffect(() => {
        if (isAuthenticated && !user) {
            fetchUserProfile();
        }
    }, [isAuthenticated, user, fetchUserProfile]);




    return (
        <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout, refreshProfile: fetchUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
