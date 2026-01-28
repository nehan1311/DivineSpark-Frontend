
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Admin.module.css';
import { ConfirmationModal } from '../../components/ui/Modal';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    const handleLogoutConfirm = () => {
        logout();
        navigate('/admin/login');
        setLogoutModalOpen(false);
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Sessions', path: '/admin/sessions', icon: '🧘' },
        { label: 'Users', path: '/admin/users', icon: '👥' },
        { label: 'Payments', path: '/admin/payments', icon: '💳' },
        { label: 'Donations', path: '/admin/donations', icon: '❤️' },
        { label: 'Reviews', path: '/admin/reviews', icon: '⭐' },
        { label: 'Events', path: '/admin/events', icon: '📢' },
        { label: 'Programs', path: '/admin/programs', icon: '📸' },
        { label: 'Blogs', path: '/admin/blogs', icon: '✍️' },
    ];

    return (
        <div className={styles.container}>
            {/* Mobile Header / Toggle */}
            <div className={styles.mobileHeader}>
                <button
                    className={styles.mobileToggleBtn}
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    aria-label="Toggle Menu"
                >
                    ☰
                </button>
                <div className={styles.logoMobile}>DivineSpark Admin</div>
            </div>

            {/* Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div
                    className={styles.sidebarOverlay}
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${mobileSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.logo}>DivineSpark Admin</div>
                <nav className={styles.nav}>
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`${styles.navLink} ${location.pathname.includes(item.path) ? styles.activeLink : ''}`}
                            title={item.label}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span className={styles.navLabel}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className={styles.userProfile}>
                    <div className={styles.avatar}>{user?.username?.substring(0, 2).toUpperCase() || 'AD'}</div>
                    <div className={styles.userInfo}>
                        <div style={{ fontWeight: 600 }}>{user?.username || 'Admin'}</div>
                        <div className={styles.userEmail}>{user?.email || 'admin@divinespark.com'}</div>
                    </div>
                    <button onClick={() => setLogoutModalOpen(true)} className={styles.logoutBtn} title="Sign Out">
                        ⏻
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>

            <ConfirmationModal
                isOpen={logoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to end your session?"
                confirmText="Sign Out"
                variant="danger"
            />
        </div>
    );
};

export default AdminLayout;
