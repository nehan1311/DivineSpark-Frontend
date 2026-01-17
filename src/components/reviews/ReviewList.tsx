import React from 'react';
import { type PlatformReview } from '../../api/review.api';
import styles from './Reviews.module.css';

interface ReviewListProps {
    reviews: PlatformReview[];
    loading: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, loading }) => {
    // No internal state or fetching

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading community feedback...</div>;

    return (
        <div className={styles.listContainer}>


            <div className={styles.grid}>
                {reviews.map((review, index) => (
                    <div
                        key={review.id || `${review.userName || 'user'}-${review.createdAt}-${index}`}
                        className={styles.reviewCard}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.cardUser}>
                                <div className={styles.userAvatar}>
                                    {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <span>{review.userName || 'Anonymous'}</span>
                            </div>
                            <div className={styles.cardDate}>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className={styles.cardComment}>
                            "{review.comment}"
                        </div>
                        <div className={styles.cardStars}>
                            {'★'.repeat(review.rating)}
                            <span style={{ color: '#e2e8f0' }}>{'★'.repeat(5 - review.rating)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {reviews.length === 0 && !loading && (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>
                    Be the first to leave a review!
                </div>
            )}
        </div>
    );
};
