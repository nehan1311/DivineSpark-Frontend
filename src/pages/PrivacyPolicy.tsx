import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PrivacyPolicy.module.css';

interface Section {
    number: number;
    title: string;
    body: string;
    icon: React.ReactNode;
}

const ShieldIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const FileTextIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const CpuIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="6" height="6" />
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
        <line x1="9" y1="2" x2="9" y2="4" />
        <line x1="15" y1="2" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="22" />
        <line x1="15" y1="20" x2="15" y2="22" />
        <line x1="20" y1="9" x2="22" y2="9" />
        <line x1="20" y1="14" x2="22" y2="14" />
        <line x1="2" y1="9" x2="4" y2="9" />
        <line x1="2" y1="14" x2="4" y2="14" />
    </svg>
);

const CreditCardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const LockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const LinkIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const RefreshIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);

const MailIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const sections: Section[] = [
    {
        number: 1,
        title: 'Introduction',
        body: 'DivineSpark values your privacy and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, and safeguard your data when you interact with our platform.',
        icon: <ShieldIcon />,
    },
    {
        number: 2,
        title: 'Information We Collect',
        body: 'We may collect name, email address, contact number, and booking details when users register or interact with the platform.',
        icon: <FileTextIcon />,
    },
    {
        number: 3,
        title: 'How We Use Information',
        body: 'We use collected information to provide services, process bookings, improve user experience, and communicate important updates related to our platform.',
        icon: <CpuIcon />,
    },
    {
        number: 4,
        title: 'Payment Information',
        body: 'Payments are securely processed via Razorpay. DivineSpark does not store card or banking details on our servers.',
        icon: <CreditCardIcon />,
    },
    {
        number: 5,
        title: 'Data Security',
        body: 'We implement reasonable security measures to protect user data from unauthorized access, disclosure, or alteration.',
        icon: <LockIcon />,
    },
    {
        number: 6,
        title: 'Third Party Services',
        body: 'We may use third-party services such as Razorpay for payment processing. These services have their own privacy policies governing the use of your information.',
        icon: <LinkIcon />,
    },
    {
        number: 7,
        title: 'Changes to Policy',
        body: 'We may update this Privacy Policy periodically. Continued use of the platform after changes constitutes acceptance of the updated policy.',
        icon: <RefreshIcon />,
    },
    {
        number: 8,
        title: 'Contact Us',
        body: 'For questions related to privacy, you may contact us through the website contact page.',
        icon: <MailIcon />,
    },
];

const PrivacyPolicy: React.FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>Legal</span>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.subtitle}>Last updated: March 2025 &nbsp;·&nbsp; DivineSpark</p>
                </div>

                {/* Sections */}
                <div className={styles.content}>
                    {sections.map((section) => (
                        <div key={section.number} className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.iconWrapper}>{section.icon}</div>
                                <h2 className={styles.sectionTitle}>{section.title}</h2>
                            </div>
                            <p className={styles.sectionBody}>{section.body}</p>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Have questions about your data?{' '}
                        <Link to="/contact" className={styles.footerLink}>
                            Contact us
                        </Link>
                        . Also review our{' '}
                        <Link to="/terms-and-conditions" className={styles.footerLink}>
                            Terms &amp; Conditions
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

export default PrivacyPolicy;
