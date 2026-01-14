import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/auth.api';
import type { User } from '../types/auth.types';
import { useToast } from '../context/ToastContext';
import styles from './Profile.module.css';
import Button from '../components/ui/Button';

const Profile: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();

    // Disable body scroll when on profile page to prevent double scrolling if needed, 
    // but usually '100vh' + 'overflow hidden' on container works best. 
    // We'll rely on the container styles.

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getUserProfile();
                setUser(data);
                setError(null);
            } catch (err: any) {
                const msg = err.response?.data?.message || 'Failed to load profile';
                setError(msg);
                showToast(msg, 'error');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated, showToast]);

    if (loading) {
        return (
            <div className={styles.profileContainer}>
                <div style={{ color: '#fff', fontSize: '1.2rem' }}>Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.profileContainer}>
                <div style={{ textAlign: 'center', color: '#ff6b6b' }}>
                    <p style={{ marginBottom: '1rem' }}>{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.profileContainer}>
                <div style={{ color: '#fff' }}>User not found</div>
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <h2 className={styles.title}>My Profile</h2>
                    <p className={styles.subtitle}>Manage your account information</p>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.formGrid}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Username</label>
                        <div className={styles.valueDisplay}>
                            {user.username}
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Email Address</label>
                        <div className={`${styles.valueDisplay} ${styles.readOnly}`}>
                            {user.email}
                        </div>
                    </div>



                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Member Since</label>
                        <div className={styles.valueDisplay}>
                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    {/* Placeholder for future "Edit Profile" button if needed */}
                </div>
            </div>
        </div>
    );
};

export default Profile;
