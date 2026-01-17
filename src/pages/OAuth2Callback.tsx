import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googleLogin } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const OAuth2Callback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login: setAuthToken } = useAuth();
    const { showToast } = useToast();
    const processedRef = useRef(false);

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (processedRef.current) return;
        processedRef.current = true;

        if (error) {
            showToast('Google login failed', 'error');
            navigate('/login');
            return;
        }

        if (code) {
            const handleLogin = async () => {
                try {
                    const response = await googleLogin(code);
                    setAuthToken(response.token);
                    showToast('Welcome back!', 'success');
                    navigate('/');
                } catch (err) {

                    showToast('Failed to sign in with Google', 'error');
                    navigate('/login');
                }
            };

            handleLogin();
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, setAuthToken, showToast]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--background-dark)'
        }}>
            <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255, 255, 255, 0.1)',
                borderLeftColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'var(--text-secondary)' }}>Authenticating with Google...</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default OAuth2Callback;
