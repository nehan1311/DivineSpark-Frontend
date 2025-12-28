import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Admin.module.css';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>Divine Admin</div>
                <nav className={styles.nav}>
                    <Link to="/admin/dashboard" className={styles.activeLink}>Dashboard</Link>
                    <Link to="/admin/sessions" className={styles.navLink}>Sessions</Link>
                    <Link to="/admin/users" className={styles.navLink}>Users</Link>
                </nav>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Sign Out
                </button>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>Dashboard Overview</h1>
                    <div style={{ color: '#666' }}>Administrator</div>
                </header>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Users</div>
                        <div className={styles.statValue}>1,234</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Active Sessions</div>
                        <div className={styles.statValue}>56</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Monthly Revenue</div>
                        <div className={styles.statValue}>$12.4k</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Pending Reviews</div>
                        <div className={styles.statValue}>8</div>
                    </div>
                </div>

                <div className={styles.welcomeSection}>
                    <h3 style={{ marginTop: 0, color: '#d4af37' }}>Welcome back, Admin.</h3>
                    <p style={{ color: '#aaa', lineHeight: 1.6 }}>
                        You have full control over the platform. Manage users, oversee healing sessions, and track performance metrics from here.
                        Select an option from the sidebar to get started.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
