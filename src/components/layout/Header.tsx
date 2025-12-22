import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import styles from './Header.module.css';
import logoImg from '../../assets/divinespark logo.jpeg';
const Header: React.FC = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

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
                    <Link to="/sessions" className={styles.navLink}>Book a Session</Link>
                    <Link to="#" className={styles.navLink}>Donate</Link>
                    <Link to="#" className={styles.navLink}>About Us</Link>
                </nav>

                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('/login')}
                        className={styles.loginBtn}
                    >
                        Log in
                        <span className={styles.userIcon} />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;
