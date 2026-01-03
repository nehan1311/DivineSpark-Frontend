import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import styles from './Header.module.css';
import logoImg from '../../assets/divinespark logo.jpeg';
import { ConfirmationModal } from '../../components/ui/Modal';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.headerContainer}`}>
                <div className={styles.logo}>
                    <Link to="/" className={styles.brandLink}>
                        <img src={logoImg} alt="DivineSpark Logo" className={styles.logoImage} />
                        <span className={styles.brandName}>DivineSpark</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <Link
                        to="/"
                        className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/sessions"
                        className={`${styles.navLink} ${location.pathname === '/sessions' ? styles.active : ''}`}
                    >
                        Book a Session
                    </Link>
                    <Link to="#" className={styles.navLink}>Donate</Link>
                    <Link to="#" className={styles.navLink}>About Us</Link>
                </nav>

                <div className={styles.actions}>
                    {isAuthenticated ? (
                        <div className={styles.userMenu}>
                            <button
                                className={styles.userMenuTrigger}
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="User menu"
                            >
                                <div
                                    className={styles.userIcon}
                                    role="img"
                                    aria-label="User Avatar"
                                />
                            </button>

                            {menuOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownItem} onClick={() => {
                                        setMenuOpen(false);
                                        // Placeholder for profile
                                        navigate('/settings');
                                    }}>
                                        Profile
                                    </div>
                                    <div className={styles.dropdownItem} onClick={() => {
                                        setMenuOpen(false);
                                        navigate('/settings');
                                    }}>
                                        Settings
                                    </div>
                                    <div className={styles.dropdownDivider} />
                                    <div className={styles.dropdownItem} onClick={() => {
                                        setMenuOpen(false);
                                        setLogoutModalOpen(true);
                                    }}>
                                        Log out
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/login')}
                            className={styles.loginBtn}
                        >
                            Log in
                            <span className={styles.userIcon} />
                        </Button>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={logoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={() => {
                    handleLogout();
                    setLogoutModalOpen(false);
                }}
                title="Log Out"
                message="Are you sure you want to log out?"
                confirmText="Log Out"
            />
        </header>
    );
};

export default Header;
