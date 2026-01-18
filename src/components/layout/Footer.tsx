import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
                <div className={styles.brand}>
                    <h3>DivineSpark</h3>
                    <p>© 2024 Wellness Platform.</p>
                </div>
                <div className={styles.links}>
                    <div className={styles.column}>
                        <h4>Explore</h4>
                        <Link to="/">Home</Link>
                        <Link to="/sessions">Sessions</Link>
                        <Link to="/reviews">Reviews</Link>
                    </div>
                    <div className={styles.column}>
                        <h4>Community</h4>
                        <Link to="/about">About Us</Link>
                        <Link to="/donate">Donate</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
