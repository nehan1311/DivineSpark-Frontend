import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import styles from './Auth.module.css';
import bgVideo from '../assets/Website_Video_for_Healing_and_Spirituality.mp4';
import { requestOtp, verifyOtp, resetPassword } from '../api/auth.api';
import { useToast } from '../context/ToastContext';
import type { AxiosError } from 'axios';

type Step = 'EMAIL_INPUT' | 'OTP_VERIFICATION' | 'RESET_PASSWORD';

const ForgotPassword: React.FC = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>('EMAIL_INPUT');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await requestOtp({ email, purpose: 'FORGOT_PASSWORD' });
            showToast('OTP sent to your email.', 'success');
            setStep('OTP_VERIFICATION');
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await verifyOtp({ email, otp, purpose: 'FORGOT_PASSWORD' });
            showToast('OTP verified successfully.', 'success');
            setStep('RESET_PASSWORD');
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        // Strict Password Regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword({ email, otp, newPassword });
            showToast('Password reset successfully. Please login with your new password.', 'success');
            navigate('/login');
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'EMAIL_INPUT':
                return (
                    <form className={styles.form} onSubmit={handleRequestOtp}>
                        <p style={{ color: '#555', marginBottom: '1rem', textAlign: 'center' }}>
                            Enter your email address to receive a verification code.
                        </p>
                        <input
                            type="email"
                            placeholder="Email Address"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button fullWidth size="lg" type="submit" disabled={isLoading}>
                            {isLoading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                    </form>
                );
            case 'OTP_VERIFICATION':
                return (
                    <form className={styles.form} onSubmit={handleVerifyOtp}>
                        <p style={{ color: '#555', marginBottom: '1rem', textAlign: 'center' }}>
                            Enter the 6-digit code sent to {email}
                        </p>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            className={styles.input}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={6}
                        />
                        <Button fullWidth size="lg" type="submit" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setStep('EMAIL_INPUT')}
                                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Change Email
                            </button>
                        </div>
                    </form>
                );
            case 'RESET_PASSWORD':
                return (
                    <form className={styles.form} onSubmit={handleResetPassword}>
                        <p style={{ color: '#555', marginBottom: '1rem', textAlign: 'center' }}>
                            Create a new password for your account.
                        </p>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password"
                                className={styles.input}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                style={{ width: '100%', paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showNewPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ width: '100%', paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showConfirmPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                            Must be 8+ chars with uppercase, lowercase, number & special char.
                        </div>
                        <Button fullWidth size="lg" type="submit" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>
                );
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
                <h2 className={styles.title}>Forgot Password</h2>
                {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

                {renderStep()}

                <p className={styles.footer}>
                    Remember your password?
                    <Link to="/login" className={styles.link}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
