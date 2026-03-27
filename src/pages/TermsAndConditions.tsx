import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TermsAndConditions.module.css';

interface Section {
    number: number;
    title: string;
    body: string;
}

const sections: Section[] = [
    {
        number: 1,
        title: 'Introduction',
        body: 'Welcome to DivineSpark. By accessing or using our website, you agree to comply with these Terms and Conditions. Please read them carefully before proceeding.',
    },
    {
        number: 2,
        title: 'Services',
        body: 'DivineSpark provides spiritual and personal development sessions conducted by experienced guides. Users may browse sessions, register, and make payments through our platform.',
    },
    {
        number: 3,
        title: 'User Responsibilities',
        body: 'Users agree to provide accurate information during registration and booking. Any misuse of the platform may result in suspension of access.',
    },
    {
        number: 4,
        title: 'Payments',
        body: 'Payments for sessions are processed securely through Razorpay. DivineSpark does not store sensitive payment information such as card details.',
    },
    {
        number: 5,
        title: 'Cancellations and Refunds',
        body: 'Refund eligibility depends on session-specific policies. Users are advised to review refund details before completing payment.',
    },
    {
        number: 6,
        title: 'Intellectual Property',
        body: 'All content on this website, including text and design, is the property of DivineSpark and may not be copied without permission.',
    },
    {
        number: 7,
        title: 'Limitation of Liability',
        body: 'DivineSpark is not responsible for personal interpretations or outcomes from sessions.',
    },
    {
        number: 8,
        title: 'Changes to Terms',
        body: 'We may update these Terms periodically. Continued use of the website constitutes acceptance of updated Terms.',
    },
    {
        number: 9,
        title: 'Contact',
        body: 'For any questions regarding these Terms and Conditions, please contact us through our Contact page.',
    },
];

const TermsAndConditions: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>Legal</span>
                    <h1 className={styles.title}>Terms &amp; Conditions</h1>
                    <p className={styles.subtitle}>Last updated: March 2025 &nbsp;·&nbsp; DivineSpark</p>
                </div>

                {/* Sections */}
                <div className={styles.content}>
                    {sections.map((section) => (
                        <div key={section.number} className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.sectionNumber}>{section.number}</span>
                                <h2 className={styles.sectionTitle}>{section.title}</h2>
                            </div>
                            <p className={styles.sectionBody}>{section.body}</p>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Have questions?{' '}
                        <Link to="/contact" className={styles.footerLink}>
                            Contact us
                        </Link>{' '}
                        anytime. Also review our{' '}
                        <Link to="/privacy-policy" className={styles.footerLink}>
                            Privacy Policy
                        </Link>{' '}
                        and{' '}
                        <Link to="/refund-policy" className={styles.footerLink}>
                            Refund Policy
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
