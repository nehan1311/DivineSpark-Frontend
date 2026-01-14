import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../api/auth.api';
import type { User } from '../types/auth.types';
import { useToast } from '../context/ToastContext';
import styles from './Profile.module.css';
import Button from '../components/ui/Button';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        contactNumber: '',
        username: ''
    });

    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Handle scroll locking and ESC key
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEsc);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, onClose]);

    // Fetch data when opened
    useEffect(() => {
        if (isOpen && isAuthenticated) {
            fetchProfile();
            setError(null);
            setSuccessMsg(null);
        }
    }, [isOpen, isAuthenticated]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserProfile();
            setUser(data);
            setFormData({
                contactNumber: data.contactNumber || '',
                username: data.username || ''
            });
            setError(null);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to load profile';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Reset messages
        setError(null);
        setSuccessMsg(null);

        // Validation: 10 digit phone number
        const phoneRegex = /^\d{10}$/;
        if (formData.contactNumber && !phoneRegex.test(formData.contactNumber)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setSaving(true);
        try {
            await updateUserProfile(formData);
            setSuccessMsg('Profile updated successfully!');
            showToast('Profile updated successfully', 'success');
            setIsEditing(false);
            if (user) {
                setUser({ ...user, ...formData });
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to update profile';
            setError(msg);
            // showToast(msg, 'error'); // Optional: duplicate
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

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
                    <h2 className={styles.title}>Your Profile</h2>
                    <p className={styles.subtitle}>Manage your personal information</p>
                </div>

                {/* Inline Messages */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                        {loading && <Button size="sm" onClick={fetchProfile} style={{ marginTop: '0.5rem' }}>Retry</Button>}
                    </div>
                )}

                {successMsg && (
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        color: '#15803d',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {successMsg}
                    </div>
                )}

                {loading && !error ? (
                    <div className={styles.loading}>Loading details...</div>
                ) : user && (
                    <div className={styles.formGrid}>
                        {/* Username */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Username</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter username"
                                />
                            ) : (
                                <div className={styles.valueDisplay}>{user.username}</div>
                            )}
                        </div>

                        {/* Email */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Email Address</label>
                            <div className={`${styles.valueDisplay} ${styles.readOnly}`}>
                                {user.email}
                            </div>
                        </div>

                        {/* Contact */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Contact Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    className={styles.input}
                                    value={formData.contactNumber}
                                    maxLength={10}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || /^\d+$/.test(val)) {
                                            setFormData({ ...formData, contactNumber: val });
                                        }
                                    }}
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <div className={styles.valueDisplay}>
                                    {user.contactNumber || 'Not provided'}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className={styles.footer}>
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                contactNumber: user.contactNumber || '',
                                                username: user.username || ''
                                            });
                                        }}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} disabled={saving} variant="primary">
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)} variant="outline">
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default ProfileModal;
