import React from 'react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Settings: React.FC = () => {
    const { logout } = useAuth();
    const { showToast } = useToast();

    // Mock user email for now
    const userEmail = "user@example.com";

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        showToast('Password change functionality coming soon.', 'info');
    };

    return (
        <Section>
            <h1>Account Settings</h1>

            <div style={{ maxWidth: '500px', marginTop: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                    <input
                        type="email"
                        value={userEmail}
                        readOnly
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-bg-surface)',
                            color: 'var(--color-text-secondary)'
                        }}
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                        Email cannot be changed.
                    </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Security</h3>
                    <form onSubmit={handleChangePassword} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-border)'
                                }}
                            />
                        </div>
                        <Button type="submit" variant="secondary" size="md">
                            Change Password
                        </Button>
                    </form>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
                    <Button
                        variant="secondary"
                        onClick={() => logout()}
                        style={{ color: '#F44336', borderColor: '#F44336' }}
                    >
                        Log out
                    </Button>
                </div>
            </div>
        </Section>
    );
};

export default Settings;
