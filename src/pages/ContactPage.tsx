import React from 'react';
import styles from './ContactPage.module.css';

// Icons
const PhoneIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const MailIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const YouTubeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
);

const ContactPage: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>Get in Touch</span>
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.subtitle}>
                        We&apos;d love to hear from you. Reach out to us through any of the channels below.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className={styles.grid}>
                    {/* Phone */}
                    <a href="tel:+917821049429" className={styles.contactCard}>
                        <div className={styles.iconCircle} style={{ color: '#007AFF' }}>
                            <PhoneIcon />
                        </div>
                        <div className={styles.cardContent}>
                            <span className={styles.cardLabel}>Mobile</span>
                            <span className={styles.cardValue}>+91 7821049429</span>
                        </div>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/917821049429"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactCard}
                    >
                        <div className={styles.iconCircle} style={{ color: '#25D366' }}>
                            <WhatsAppIcon />
                        </div>
                        <div className={styles.cardContent}>
                            <span className={styles.cardLabel}>WhatsApp</span>
                            <span className={styles.cardValue}>+91 7821049429</span>
                        </div>
                    </a>

                    {/* Email */}
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=divinesparksadhak@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactCard}
                    >
                        <div className={styles.iconCircle} style={{ color: '#EA4335' }}>
                            <MailIcon />
                        </div>
                        <div className={styles.cardContent}>
                            <span className={styles.cardLabel}>Email</span>
                            <span className={styles.cardValue}>divinesparksadhak@gmail.com</span>
                        </div>
                    </a>
                </div>

                <div className={styles.divider} />

                {/* Social Section */}
                <div className={styles.socialSection}>
                    <h2 className={styles.socialTitle}>Follow Us</h2>
                    <div className={styles.socialRow}>
                        <a
                            href="https://www.instagram.com/suvirsabnis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialCard}
                        >
                            <span style={{ color: '#E4405F' }}>
                                <InstagramIcon />
                            </span>
                            <span className={styles.socialLabel}>Instagram</span>
                        </a>

                        <a
                            href="https://www.youtube.com/@suvirsabnis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialCard}
                        >
                            <span style={{ color: '#FF0000' }}>
                                <YouTubeIcon />
                            </span>
                            <span className={styles.socialLabel}>YouTube</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
