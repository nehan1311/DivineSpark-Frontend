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
