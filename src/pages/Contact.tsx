import React from 'react';
import styles from './Contact.module.css';
import Button from '../components/ui/Button';

// Icons as components for cleaner usage
const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const WhatsAppIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const Contact: React.FC = () => {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {/* Left Column: Contact Info */}
                <div className={`${styles.card} ${styles.leftColumn}`}>
                    <div className={styles.contactInfoSection}>
                        {/* Mobile */}
                        <a href="tel:+912345678901" className={styles.infoItem}>
                            <div className={styles.iconWrapper}>
                                <PhoneIcon />
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoTitle}>Mobile</span>
                                <span className={styles.infoValue}>+91 2345678901</span>
                            </div>
                        </a>

                        {/* WhatsApp */}
                        <a href="https://wa.me/8692993228" target="_blank" rel="noopener noreferrer" className={styles.infoItem}>
                            <div className={styles.iconWrapper}>
                                <WhatsAppIcon />
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoTitle}>WhatsApp</span>
                                <span className={styles.infoValue}>+91 8692993228</span>
                            </div>
                        </a>

                        {/* Email */}
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@divinespark.com" target="_blank" rel="noopener noreferrer" className={styles.infoItem}>
                            <div className={styles.iconWrapper}>
                                <MailIcon />
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoTitle}>Email</span>
                                <span className={styles.infoValue}>hello@divinespark.com</span>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Right Column: Contact Form */}
                <div className={`${styles.card} ${styles.rightColumn}`}>
                    <h2 className={styles.heading}>Send us a message</h2>
                    <p className={styles.subheading}>We'd love to hear from you. Fill out the form below and we'll get back to you shortly.</p>

                    <form className={styles.formGrid}>
                        <div className={styles.rowHalf}>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="name">Your Name</label>
                                <input type="text" id="name" className={styles.input} placeholder="Chris Evans" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="email">Your Email</label>
                                <input type="email" id="email" className={styles.input} placeholder="chris@example.com" />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="mobile">Mobile Number</label>
                            <input type="tel" id="mobile" className={styles.input} placeholder="+91 2345678901" />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label} htmlFor="message">Message</label>
                            <textarea id="message" className={styles.textarea} placeholder="How can we help you?"></textarea>
                        </div>

                        <Button size="lg" fullWidth variant="primary" type="submit">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
