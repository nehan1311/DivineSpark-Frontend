import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getToken, setToken, removeToken } from '../utils/authStorage';
import { jwtDecode } from 'jwt-decode';
import { useToast } from './ToastContext';

interface DecodedToken {
    role: string;
    exp?: number;
    [key: string]: any;
}

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string) => void;
    logout: (showFeedback?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { showToast } = useToast();

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



    const logout = useCallback((showFeedback = true) => {
        removeToken();
        setIsAuthenticated(false);
        setRole(null);
        if (showFeedback) {
            showToast('Logged out successfully', 'success');
        }
    }, [showToast]);

    const login = (token: string) => {
        setToken(token);
        setIsAuthenticated(true);
        const userRole = getRoleFromToken(token);
        setRole(userRole);
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

    console.log("AUTH STATE →", { isAuthenticated, role });


    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
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
