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
                    <div className={styles.socialRow}>
                        {/* Instagram - Official Color #E4405F */}
                        <a
                            href="https://www.instagram.com/suvirsabnis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            style={{ color: '#E4405F' }}
                            aria-label="Instagram"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>

                        {/* YouTube - Official Color #FF0000 */}
                        <a
                            href="https://www.youtube.com/@suvirsabnis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIcon}
                            style={{ color: '#FF0000' }}
                            aria-label="YouTube"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                            </svg>
                        </a>
                    </div>
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
                        <Link to="/donate">Contribute</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
