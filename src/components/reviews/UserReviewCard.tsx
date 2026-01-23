import React from 'react';
import type { PlatformReview } from '../../api/review.api';
import { formatFullDateTime } from '../../utils/format';

interface UserReviewCardProps {
    review: PlatformReview;
}

const UserReviewCard: React.FC<UserReviewCardProps> = ({ review }) => {
    return (
        <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease',
            minWidth: '300px',
            maxWidth: '100%'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.05rem' }}>{review.userName}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    {formatFullDateTime(review.createdAt)}
                </div>
            </div>

            <div style={{ color: '#fbbf24', fontSize: '1rem', letterSpacing: '2px' }}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>

            <p style={{
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: '1.6',
                fontSize: '0.95rem',
                fontStyle: 'italic'
            }}>
                "{review.comment}"
            </p>
        </div>
    );
};

export default UserReviewCard;
