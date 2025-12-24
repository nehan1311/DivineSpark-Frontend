import React from 'react';
import type { Session } from '../types/session.types';
import Button from './ui/Button';
import styles from './SessionCard.module.css';
import { formatDate, formatCurrency } from '../utils/format';

interface SessionCardProps {
    session: Session;
    onAction: (session: Session) => void;
    loading?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onAction, loading = false }) => {
    const isFree = session.type === 'FREE';
    // Check if session is in the past
    const isExpired = new Date(session.startTime) < new Date();

    // Status text logic could be improved, but relying on isExpired for now
    const ctaLabel = isExpired ? 'Expired' : (isFree ? 'Join Free' : 'Book Now');
    const badgeClass = isFree ? styles.free : styles.paid;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {session.imageUrl ? (
                    <img src={session.imageUrl} alt={session.title} className={styles.image} />
                ) : (
                    // Gradient placeholder handled by CSS
                    <div className={styles.image} />
                )}
                <span className={`${styles.badge} ${badgeClass}`}>
                    {session.type}
                </span>
            </div>

            <div className={styles.content}>
                <div className={styles.date}>{formatDate(session.startTime)}</div>
                <h3 className={styles.title}>{session.title}</h3>
                <p className={styles.description}>{session.description}</p>

                <div className={styles.footer}>
                    <span className={styles.price}>
                        {formatCurrency(session.price, session.currency)}
                    </span>
                    <Button
                        size="sm"
                        variant={isFree ? 'outline' : 'primary'}
                        onClick={() => onAction(session)}
                        disabled={loading || isExpired}
                    >
                        {ctaLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SessionCard;
