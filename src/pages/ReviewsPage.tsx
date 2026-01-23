import React, { useState, useEffect } from 'react';
import { ReviewForm } from '../components/reviews/ReviewForm';

import { type PlatformReview, reviewApi } from '../api/review.api';
import styles from '../components/reviews/Reviews.module.css';

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<PlatformReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showForm, setShowForm] = useState(false);

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

    // Show all reviews
    const displayReviews = reviews;

    const averageRating = reviews.length
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.meshContainer}></div>
            <div className={styles.pageContainer} style={{ paddingTop: 'calc(var(--header-height) + 4rem)' }}>

                {/* 1. Hero & Trust Section */}
                <div className={styles.heroSection}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.pageTitle}>Community Reviews</h1>
                        <p className={styles.pageDescription}>
                            Discover the stories of healing, growth, and transformation from our community.
                            Your journey to inner peace starts here.
                        </p>
                    </div>

                    {/* Trust/Stats Bar */}
                    {!loading && (
                        <div className={styles.trustBar}>
                            <div className={styles.trustItem}>
                                <span className={styles.trustValue}>
                                    {Number(averageRating) === 0 ? '5.0' : averageRating}
                                </span>
                                <span className={styles.trustLabel}>Average Rating</span>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.trustItem}>
                                <span className={styles.trustValue}>{reviews.length}</span>
                                <span className={styles.trustLabel}>Total Reviews</span>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.trustItem}>
                                <span className={styles.trustValue}>500+</span>
                                <span className={styles.trustLabel}>Community Members</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Reviews Grid */}
                <div className={styles.reviewsSection}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                            Loading community stories...
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {displayReviews.map((review, index) => (
                                <div key={review.id || index} className={styles.reviewCard}>
                                    {review.comment && (
                                        <>
                                            <div className={styles.quoteIcon}>“</div>
                                            <p className={styles.cardComment}>{review.comment}</p>
                                        </>
                                    )}
                                    {!review.comment && (
                                        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, fontStyle: 'italic', minHeight: '80px' }}>
                                            Rate only
                                        </div>
                                    )}

                                    <div className={styles.cardFooter}>
                                        <div className={styles.reviewerInfo}>
                                            <div className={styles.userAvatar}>
                                                {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                                            </div>
                                            <div className={styles.reviewerMeta}>
                                                <span className={styles.reviewerName}>{review.userName || 'Anonymous'}</span>
                                                <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className={styles.cardStars}>
                                            {'★'.repeat(review.rating)}
                                            <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - review.rating)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Call to Action Section */}
                <div className={styles.ctaSection}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Share Your Experience</h2>
                        <p className={styles.ctaText}>
                            Has DivineSpark helped you on your journey? Your words can inspire others to take the first step towards healing.
                        </p>

                        {!showForm && (
                            <button
                                className={styles.writeReviewBtn}
                                onClick={() => setShowForm(true)}
                            >
                                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>✎</span> Write a Review
                            </button>
                        )}

                        {showForm && (
                            <div className={styles.formContainer}>
                                <ReviewForm onReviewSubmitted={() => {
                                    setRefreshTrigger(prev => prev + 1);
                                    setShowForm(false);
                                }} />
                                <button
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        marginTop: '1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#64748b',
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReviewsPage;
