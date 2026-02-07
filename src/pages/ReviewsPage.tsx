import React, { useState, useEffect } from 'react';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

import { type PlatformReview, reviewApi } from '../api/review.api';
import styles from '../components/reviews/Reviews.module.css';

const ReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<PlatformReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showForm, setShowForm] = useState(false);

    // Carousel State
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = 2; // Default to 2 items visible

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

    const nextSlide = () => {
        if (currentIndex < reviews.length - itemsPerView) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Loop back to start or stop? Let's loop for infinite feel
            setCurrentIndex(0);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            // Loop to end
            setCurrentIndex(Math.max(0, reviews.length - itemsPerView));
        }
    };

    // Calculate effective average rating
    const averageRating = reviews.length
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const numStars = Math.round(Number(averageRating));

    return (
        <div className={styles.pageWrapper}>
            {/* Background Mesh */}
            <div className={styles.meshContainer}></div>

            <div className={styles.pageContainer} style={{ paddingTop: 'calc(var(--header-height) + 2rem)' }}>

                {/* 1. Header Section */}
                <div className={styles.feedbackHeader}>
                    <span className={styles.label}>FEEDBACK</span>
                    <h2 className={styles.mainTitle}>What our clients are saying</h2>
                </div>

                {/* 2. Main Widget */}
                <div className={styles.widgetContainer}>
                    {/* Left: Summary */}
                    <div className={styles.widgetLeft}>
                        <div className={styles.excellentText}>EXCELLENT</div>
                        <div className={styles.aggregateStars}>
                            {'★'.repeat(numStars)}
                            <span style={{ color: '#e2e8f0' }}>{'★'.repeat(5 - numStars)}</span>
                        </div>
                        <div className={styles.reviewCount}>
                            Based on <strong>{reviews.length} reviews</strong>
                        </div>
                        {/* Removed Google Logo as requested */}
                    </div>

                    {/* Right: Carousel */}
                    <div className={styles.widgetRight}>
                        {!loading && reviews.length > 0 ? (
                            <>
                                <button className={`${styles.navButton} ${styles.navPrev}`} onClick={prevSlide}>
                                    <ChevronLeft size={20} />
                                </button>

                                <div className={styles.carouselContainer}>
                                    <motion.div
                                        className={styles.carouselTrack}
                                        animate={{ x: `-${currentIndex * (300 + 24)}px` }} // 300px card width + 1.5rem gap (24px)
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        {reviews.map((review, index) => (
                                            <div key={review.id || index} className={styles.googleStyleCard}>
                                                <div className={styles.cardHeader}>
                                                    <div className={styles.avatarDisplay}>
                                                        {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                                                    </div>
                                                    <div className={styles.headerInfo}>
                                                        <span className={styles.reviewerName}>{review.userName || 'Anonymous'}</span>
                                                        <span className={styles.reviewTime}>
                                                            {/* Convert date to 'time ago' roughly or just date */}
                                                            {new Date(review.createdAt).getFullYear() === new Date().getFullYear()
                                                                ? new Date(review.createdAt).toLocaleDateString()
                                                                : `${new Date().getFullYear() - new Date(review.createdAt).getFullYear()} years ago`}
                                                        </span>
                                                    </div>
                                                    {/* Google G Logo REMOVED here */}
                                                </div>

                                                <div className={styles.cardStarsRow}>
                                                    {'★'.repeat(review.rating)}
                                                    <span style={{ color: '#e2e8f0' }}>{'★'.repeat(5 - review.rating)}</span>
                                                    {/* Blue Verified Check */}
                                                    <span className={styles.verifiedBadge}><CheckCircle size={14} fill="currentColor" color="white" /></span>
                                                </div>

                                                <p className={styles.reviewText}>
                                                    {review.comment}
                                                </p>

                                                {/* Read more link (visual only for now) */}
                                                <span className={styles.readMore}>Read more</span>
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>

                                <button className={`${styles.navButton} ${styles.navNext}`} onClick={nextSlide}>
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        ) : (
                            <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8' }}>
                                {loading ? 'Loading reviews...' : 'No reviews yet.'}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Call to Action Section (Keep existing functional part) */}
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
