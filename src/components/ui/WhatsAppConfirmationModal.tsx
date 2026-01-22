import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import Button from './Button';
import styles from './WhatsAppConfirmationModal.module.css';

interface WhatsAppConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    whatsappNumber?: string; // Default: 918692993228
}

const WhatsAppIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);

export const WhatsAppConfirmationModal: React.FC<WhatsAppConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    whatsappNumber = '918692993228'
}) => {
    const [step, setStep] = useState<1 | 2>(1);

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
        }
    }, [isOpen]);

    const handleConnectClick = () => {
        // Open WhatsApp in new tab
        window.open(`https://wa.me/${whatsappNumber}`, '_blank');
        // Move to step 2
        setStep(2);
    };

    const handleConfirmBooking = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={styles.container}>
                {step === 1 ? (
                    <>
                        <h2 className={styles.stepTitle}>Connect with the Guide</h2>
                        <p className={styles.message}>
                            For a smoother and more guided experience, please connect with our guide on WhatsApp before registering for this session.
                        </p>
                        <div className={styles.buttonGroup}>
                            <Button
                                variant="primary"
                                className={styles.primaryButton}
                                onClick={handleConnectClick}
                                style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: '#fff' }}
                            >
                                <WhatsAppIcon />
                                Connect on WhatsApp
                            </Button>
                            <Button variant="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className={styles.stepTitle}>Did you connect?</h2>
                        <p className={styles.message}>
                            Have you connected with the guide on WhatsApp?
                        </p>
                        <div className={styles.buttonGroup}>
                            <Button
                                variant="primary"
                                onClick={handleConfirmBooking}
                            >
                                Yes, Continue Booking
                            </Button>
                            <Button variant="secondary" onClick={onClose}>
                                Not Yet
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};
