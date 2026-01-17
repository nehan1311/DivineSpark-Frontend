import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Contact.module.css';

// Icons
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

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Contact: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.modalOverlay} onClick={onClose} aria-modal="true" role="dialog">
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>Contact Us</h2>
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
        </div>,
        document.body
    );
};

export default Contact;

