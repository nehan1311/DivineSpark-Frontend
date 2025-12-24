import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getToken, setToken, removeToken } from '../utils/authStorage';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: (showFeedback?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



import { useToast } from './ToastContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();

    // Initialize state synchronously to avoid flash of unauthenticated content
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return !!getToken();
    });

    const logout = useCallback((showFeedback = true) => {
        removeToken();
        setIsAuthenticated(false);
        if (showFeedback) {
            showToast('Logged out successfully', 'success');
        }
    }, [showToast]);

    const login = (token: string) => {
        setToken(token);
        setIsAuthenticated(true);
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

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
