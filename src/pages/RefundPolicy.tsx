import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RefundPolicy.module.css';

interface Section {
    number: number;
    title: string;
    body: string;
    highlight?: boolean;
}

const sections: Section[] = [
    {
        number: 1,
        title: 'Overview',
        body: 'Thank you for choosing DivineSpark. We strive to provide meaningful and valuable spiritual sessions. Please read our refund policy carefully before making a booking.',
    },
    {
        number: 2,
        title: 'No Refund Policy',
        body: 'All session bookings made on DivineSpark are non-refundable. Once a booking is confirmed and payment is completed, the amount cannot be refunded under any circumstances.',
        highlight: true,
    },
    {
        number: 3,
        title: 'Rescheduling',
        body: 'In exceptional cases, users may contact support for rescheduling options, subject to availability and approval by the DivineSpark team.',
    },
    {
        number: 4,
        title: 'Missed Sessions',
        body: 'If a user misses a scheduled session, the booking will be considered completed and will not be eligible for a refund.',
    },
    {
        number: 5,
        title: 'Payment Processing',
        body: 'All payments are securely processed via Razorpay. DivineSpark does not store sensitive payment information.',
    },
    {
        number: 6,
        title: 'Contact',
        body: 'For any questions regarding bookings or this policy, please contact our support team through the Contact page.',
    },
];

const RefundPolicy: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>Legal</span>
                    <h1 className={styles.title}>Refund Policy</h1>
                    <p className={styles.subtitle}>Last updated: March 2025 &nbsp;·&nbsp; DivineSpark</p>
                </div>

                {/* Sections */}
                <div className={styles.content}>
                    {sections.map((section) => (
                        <div
                            key={section.number}
                            className={section.highlight ? styles.alertSection : styles.section}
                        >
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>
                                    {section.number}. {section.title}
                                </h2>
                            </div>
                            <p className={styles.sectionBody}>{section.body}</p>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Need help with a booking?{' '}
                        <Link to="/contact" className={styles.footerLink}>
                            Contact our support team
                        </Link>
                        . Also review our{' '}
                        <Link to="/terms-and-conditions" className={styles.footerLink}>
                            Terms &amp; Conditions
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy-policy" className={styles.footerLink}>
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
