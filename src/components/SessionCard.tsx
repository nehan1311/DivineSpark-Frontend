import React from 'react';
import type { Session } from '../types/session.types';
import Button from './ui/Button';
import styles from './SessionCard.module.css';
import { formatDate, formatCurrency } from '../utils/format';
import { PUBLIC_ENDPOINTS } from '../api/endpoints';
import defaultThumbnail from '../assets/defaultthumbnail.png';

import dayjs from 'dayjs';

interface SessionCardProps {
    session: Session;
    onAction: (session: Session) => void;
    loading?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, onAction, loading = false }) => {
    const isFree = session.type === 'FREE';
    const isExpired = dayjs(session.startTime).isBefore(dayjs());
    const ctaLabel = isExpired ? 'Expired' : (isFree ? 'Join Free' : 'Pay For Session');
    const badgeClass = isFree ? styles.free : styles.paid;

    const imageSrc = session.imageUrl ||
        (session.thumbnailData ? `data:image/png;base64,${session.thumbnailData}` : undefined) ||
        PUBLIC_ENDPOINTS.THUMBNAIL(session.id) + `?t=${Date.now()}`;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={imageSrc}
                    alt={session.title}
                    className={styles.image}
                    onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== defaultThumbnail) {
                            target.src = defaultThumbnail;
                        }
                    }}
                />
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
