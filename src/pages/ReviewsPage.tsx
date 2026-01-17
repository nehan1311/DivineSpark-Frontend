import React, { useState, useEffect } from 'react';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { ReviewList } from '../components/reviews/ReviewList';
import { type PlatformReview, reviewApi } from '../api/review.api';
import styles from '../components/reviews/Reviews.module.css';

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<PlatformReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
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
        loadReviews();
    }, [refreshTrigger]);

    const averageRating = reviews.length
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className={styles.pageWrapper} style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className={styles.meshContainer}></div>
            <div className={styles.pageContainer}>
                <div className={styles.splitLayout}>
                    {/* LEFT COLUMN: Action/Message */}
                    <div className={styles.leftColumn}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{
                                fontSize: '2.5rem',
                                fontWeight: 700,
                                color: '#0f766e',
                                marginBottom: '1rem',
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                                Community <br /> Reviews
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>
                                See what others are saying about their journey with DivineSpark. Your feedback helps us grow.
                            </p>
                        </div>
                        <ReviewForm onReviewSubmitted={() => setRefreshTrigger(prev => prev + 1)} />
                    </div>

                    {/* RIGHT COLUMN: Rating + Reviews List */}
                    <div className={styles.rightColumn}>
                        {/* Compact Rating Block */}
                        <div className={styles.ratingBlock}>
                            <div className={styles.avgRating}>
                                <span style={{ color: '#fbbf24' }}>★</span>
                                {parseFloat(averageRating) === 0 ? '5.0' : averageRating}
                            </div>
                            <div className={styles.totalReviews}>
                                ({reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'})
                            </div>
                        </div>

                        <ReviewList reviews={reviews} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;
