import React, { useEffect, useState } from 'react';
import { type PlatformReview, reviewApi } from '../../api/review.api';
import styles from './Reviews.module.css';

interface ReviewListProps {
    refreshTrigger: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ refreshTrigger }) => {
    const [reviews, setReviews] = useState<PlatformReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReviews();
    }, [refreshTrigger]);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const data = await reviewApi.getAllReviews();
            setReviews(data);
        } catch (error) {
            console.error('Failed to load reviews', error);
        } finally {
            setLoading(false);
        }
    };

    const averageRating = reviews.length
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading community feedback...</div>;

    return (
        <div className={styles.listContainer}>
            {reviews.length > 0 && (
                <div className={styles.statsHeader}>
                    <div className={styles.avgRating}>
                        <span style={{ color: '#fbbf24' }}>★</span> {averageRating}
                    </div>
                    <div className={styles.totalReviews}>Based on {reviews.length} reviews</div>
                </div>
            )}

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
