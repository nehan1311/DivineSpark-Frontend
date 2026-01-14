import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import styles from './Header.module.css';
import logoImg from '../../assets/divinespark logo.jpeg';
import { ConfirmationModal } from '../../components/ui/Modal';
import DonateModal from '../payment/DonateModal';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [donateModalOpen, setDonateModalOpen] = useState(false);


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
                    <button
                        className={styles.navLink}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
                        onClick={() => {
                            if (!isAuthenticated) {
                                navigate('/login');
                            } else {
                                setDonateModalOpen(true);
                            }
                        }}
                    >
                        Donate
                    </button>
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
                                >
                                    {/* Display initials logic */}
                                    {(() => {
                                        // Priority: User's real name > Username > Email
                                        const nameSource = user?.fullName || user?.username || user?.email || 'U';

                                        // Clean string
                                        const cleanName = nameSource.trim();

                                        if (!cleanName) return 'U';

                                        // Split by spaces to find initials
                                        const parts = cleanName.split(' ').filter(part => part.length > 0);

                                        if (parts.length === 1) {
                                            // Single name or username: take up to first 2 chars
                                            return parts[0].substring(0, 2).toUpperCase();
                                        }

                                        // Multiple parts: First letter of first + First letter of last
                                        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                    })()}
                                </div>
                            </button>

                            {menuOpen && (
                                <div className={styles.dropdown}>
                                    <div className={styles.dropdownItem} onClick={() => {
                                        setMenuOpen(false);
                                        navigate('/profile');
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </Button>
                    )}
                </div>
            </div>

            {/* Donate Modal */}
            <DonateModal
                isOpen={donateModalOpen}
                onClose={() => setDonateModalOpen(false)}
            />

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
