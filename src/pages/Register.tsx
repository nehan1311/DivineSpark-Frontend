import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Auth.module.css';
import bgVideo from '../assets/Website_Video_for_Healing_and_Spirituality.mp4';
import { requestOtp, verifyOtp, register } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';

import type { AxiosError } from 'axios';

import { useToast } from '../context/ToastContext';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await requestOtp({ email, purpose: 'VERIFY_EMAIL' });
            showToast('OTP sent to your email', 'success');
            setStep(2);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMessage = error.response?.data?.message || 'Failed to request OTP';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            // Assuming verifyOtp returns success but doesn't log you in yet, 
            // or returns a token if it was a login. Here it validates OTP for registration flow.
            await verifyOtp({ email, otp, purpose: 'VERIFY_EMAIL' });
            showToast('Email verified successfully', 'success');
            setStep(3);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMessage = error.response?.data?.message || 'Invalid OTP';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await register({ email, fullName, password });
            // Accept token as plain string or within an object
            let token: string | undefined;
            if (!response) token = undefined;
            else if (typeof response === 'string') token = response;
            else token = (response as any).token || (response as any).accessToken || (response as any).access_token;

            if (!token) {
                const msg = 'Registration succeeded but no token returned from server';
                showToast(msg, 'error');
                setError(msg);
                return;
            }
            login(token);
            showToast('Registration successful! Welcome.', 'success');
            navigate('/sessions'); // Or wherever you want to send them
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const errorMessage = error.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Render Helpers
    const renderStep1 = () => (
        <>
            <form className={styles.form} onSubmit={handleRequestOtp}>
                <input
                    type="email"
                    placeholder="Email Address"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Button fullWidth size="lg" type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending OTP...' : 'Continue'}
                </Button>
            </form>

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
                Sign up with Google
            </Button>
        </>
    );

    const renderStep2 = () => (
        <form className={styles.form} onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-text-body)' }}>
                Enter the OTP sent to <strong>{email}</strong>
            </div>
            <input
                type="text"
                placeholder="Enter OTP"
                className={styles.input}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
            />
            <Button fullWidth size="lg" type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            <button
                type="button"
                onClick={() => setStep(1)}
                className={styles.link}
                style={{ fontSize: '0.875rem', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
                Change Email
            </button>
        </form>
    );

    const renderStep3 = () => (
        <form className={styles.form} onSubmit={handleRegister}>
            <input
                type="text"
                placeholder="Full Name"
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Create Password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button fullWidth size="lg" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
        </form>
    );

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
                <h2 className={styles.title}>
                    {step === 1 && 'Create Account'}
                    {step === 2 && 'Verify Email'}
                    {step === 3 && 'Complete Profile'}
                </h2>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}

                <p className={styles.footer}>
                    Already have an account?
                    <Link to="/login" className={styles.link}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
