import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const OAuthSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        const token = searchParams.get('token');
        const error = searchParams.get('error');

        // Avoid double processing in strict mode
        if (token || error) {
            processedRef.current = true;
        }

        if (token) {
            // Save token and update auth state
            login(token);
            showToast('Successfully logged in!', 'success');
            // The PublicRoute component will detect the auth state change and redirect automatically.
            // But we can also add an explicit redirect here if used outside PublicRoute.
            navigate('/sessions');
        } else if (error) {
            showToast('Login failed: ' + error, 'error');
            navigate('/login');
        } else {
            // If accessed directly without params, redirect to login
            // We use a small timeout or check mount to avoid immediate redirect if unnecessary
            if (!processedRef.current) {
                navigate('/login');
            }
        }
    }, [searchParams, login, showToast, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--color-bg-primary, #111)' // Fallback to dark if var not available
        }}>
            <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderLeftColor: 'var(--color-primary, #646cff)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'var(--color-text-primary, #fff)' }}>Completing login...</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default OAuthSuccess;
