import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { requestOtp, verifyOtp, resetPassword } from '../api/auth.api';
import Button from '../components/ui/Button';
import styles from './Settings.module.css';
import { ConfirmationModal } from '../components/ui/Modal';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'VIEW' | 'OTP' | 'RESET';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>('VIEW');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    // Form State
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reset state when modal opens/closes
    // Reset state ONLY when isOpen toggles to true
    useEffect(() => {
        if (isOpen) {
            setStep('VIEW');
            setError(null);
            setSuccessMsg(null);
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [isOpen]);

    // Handle DOM side effects (scroll locking, keyboard events)
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setLogoutConfirmOpen(false);
        }

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    const handleLogoutClick = () => {
        setLogoutConfirmOpen(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/');
        onClose();
    };

    const handleLogout = () => {
        // Keeps existing function for direct calls if needed, or redirect to confirm
        confirmLogout();
    };

    const handleInitiateChange = async () => {
        if (!user?.email) return;
        setIsLoading(true);
        setError(null);
        try {
            await requestOtp({ email: user.email, purpose: 'FORGOT_PASSWORD' });
            showToast('OTP sent to your email.', 'success');
            setStep('OTP');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to send OTP.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email) return;
        setIsLoading(true);
        setError(null);
        try {
            await verifyOtp({ email: user.email, otp, purpose: 'FORGOT_PASSWORD' });
            setStep('RESET');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Invalid OTP.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.email) return;

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Strict Password Regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await resetPassword({ email: user.email, otp, newPassword });
            showToast('Password changed successfully. Please log in again.', 'success');
            handleLogout();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to change password.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderView = () => (
        <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>Email Address</label>
                <div className={`${styles.valueDisplay} ${styles.readOnly}`}>
                    {user?.email}
                </div>
            </div>



            <div className={styles.fieldGroup}>
                <label className={styles.label}>Security</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                        Password
                    </span>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={handleInitiateChange}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Change Password'}
                    </Button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    To change your password, we will send an OTP to your email address.
                </p>
            </div>

            <div className={styles.footer} style={{ justifyContent: 'center' }}>
                <Button
                    variant="secondary"
                    onClick={handleLogoutClick}
                    style={{
                        color: '#d32f2f',
                        borderColor: '#d32f2f',
                        background: 'rgba(211, 47, 47, 0.05)',
                        fontWeight: 600
                    }}
                >
                    Log out
                </Button>
            </div>
        </div>
    );

    const renderOtp = () => (
        <form onSubmit={handleVerifyOtp} className={styles.formGrid}>
            <div className={styles.textCenter}>
                Enter the 6-digit code sent to<br />
                <strong>{user?.email}</strong>
            </div>

            <div className={styles.otpGroup}>
                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className={styles.input}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem' }}
                />
            </div>

            <div className={styles.footer} style={{ flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <Button fullWidth onClick={() => { }} type="submit" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Button>
                <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => {
                        setStep('VIEW');
                        setOtp('');
                        setError(null);
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );

    const renderReset = () => (
        <form onSubmit={handleResetPassword} className={styles.formGrid}>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>New Password</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showNewPassword ? "text" : "password"}
                        className={styles.input}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                            position: 'absolute',
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '0.5rem'
                        }}
                    >
                        {showNewPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    Must be 8+ chars with uppercase, lowercase, number & special char.
                </div>
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                            position: 'absolute',
                            right: '0',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '0.5rem'
                        }}
                    >
                        {showConfirmPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
            </div>

            <div className={styles.footer} style={{ flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <Button fullWidth onClick={() => { }} type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Set New Password'}
                </Button>
                <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => {
                        setStep('VIEW');
                        setNewPassword('');
                        setConfirmPassword('');
                        setOtp('');
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );

    const modalContent = (
        <div className={styles.overlay} onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className={styles.header}>
                    <h2 className={styles.title}>Account Settings</h2>
                    <p className={styles.subtitle}>Manage your account and security</p>
                </div>

                {error && <div className={`${styles.message} ${styles.error}`}>{error}</div>}
                {successMsg && <div className={`${styles.message} ${styles.success}`}>{successMsg}</div>}

                {step === 'VIEW' && renderView()}
                {step === 'OTP' && renderOtp()}
                {step === 'RESET' && renderReset()}

                <ConfirmationModal
                    isOpen={logoutConfirmOpen}
                    onClose={() => setLogoutConfirmOpen(false)}
                    onConfirm={confirmLogout}
                    title="Confirm Logout"
                    message="Are you sure you want to log out?"
                    confirmText="Log Out"
                />
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default SettingsModal;
