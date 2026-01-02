import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Button from '../components/ui/Button';
import styles from './Auth.module.css';
import bgVideo from '../assets/Website_Video_for_Healing_and_Spirituality.mp4';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/auth.api';

import type { AxiosError } from 'axios';

import { useToast } from '../context/ToastContext';

const Login: React.FC = () => {
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/sessions";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await loginApi({ email, password });
            // Accept token as plain string or within an object
            let token: string | undefined;
            if (!response) token = undefined;
            else if (typeof response === 'string') token = response;
            else token = (response as any).token || (response as any).accessToken || (response as any).access_token;

            if (!token) {
                const msg = 'Login succeeded but no token returned from server';
                showToast(msg, 'error');
                setError(msg);
                return;
            }

            // Decode token to check role
            let role = 'USER';
            try {
                const decoded: any = jwtDecode(token);
                if (
                    decoded.role === 'ADMIN' ||
                    decoded.role === 'ROLE_ADMIN' ||
                    (Array.isArray(decoded.authorities) && decoded.authorities.includes('ROLE_ADMIN')) ||
                    (Array.isArray(decoded.roles) && decoded.roles.includes('ADMIN'))
                ) {
                    role = 'ADMIN';
                }
            } catch (e) {
                console.warn("Failed to decode token", e);
            }

            login(token); // Update context state

            if (role === 'ADMIN') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate(from, { replace: true });
            }

        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMessage = error.response?.data?.message || 'Invalid email or password';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <video
                className={styles.videoBackground}
                autoPlay
                muted
                loop
                playsInline
            >
                <source src={bgVideo} type="video/mp4" />
            </video>

            <div className={styles.authBox}>
                <h2 className={styles.title}>Welcome Back</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form className={styles.form} onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button fullWidth size="lg" type="submit" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                        <span style={{ padding: '0 10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                    </div>

                    <Button
                        fullWidth
                        size="lg"
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            window.location.href = 'http://localhost:8080/oauth2/authorization/google';
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#fff', color: '#333' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </Button>
                </form>
                <p className={styles.footer}>
                    Don't have an account?
                    <Link to="/register" className={styles.link}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
