import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import styles from '../Auth.module.css';
import bgVideo from '../../assets/Website_Video_for_Healing_and_Spirituality.mp4';
import { useAuth } from '../../context/AuthContext';
import { login as loginApi } from '../../api/auth.api';
import { jwtDecode } from 'jwt-decode';
import type { AxiosError } from 'axios';
import { useToast } from '../../context/ToastContext';

interface DecodedToken {
    role: string;
    [key: string]: any;
}

const AdminLogin: React.FC = () => {
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/admin/dashboard";

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
            const token = response.token;

            // Decode and verify role immediately
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                if (decoded.role !== 'ADMIN') {
                    throw new Error('Access Denied: You do not have administrator privileges.');
                }

                // If valid admin, update context and redirect
                login(token);
                navigate(from, { replace: true });

            } catch (roleError: any) {
                // If role check fails, do NOT log them in as admin
                // We don't call logout() here because we haven't logged in yet (context-wise)
                // But we throw to catch block
                throw roleError;
            }

        } catch (err) {

            const error = err as AxiosError<{ message: string }> | Error;
            let errorMessage = 'Invalid email or password';

            if ('response' in error && (error as any).response?.data?.message) {
                errorMessage = (error as any).response.data.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

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
                <h2 className={styles.title}>Admin Portal</h2>
                {error && <div style={{ color: '#ff4444', marginBottom: '1rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

                <form className={styles.form} onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Admin Email"
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
                        {isLoading ? 'Verifying Credentials...' : 'Access Dashboard'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
