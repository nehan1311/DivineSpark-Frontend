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
