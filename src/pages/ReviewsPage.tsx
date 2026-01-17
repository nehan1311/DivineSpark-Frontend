import React, { useState } from 'react';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { ReviewList } from '../components/reviews/ReviewList';

import styles from '../components/reviews/Reviews.module.css';

const ReviewsPage: React.FC = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    return (
        <div className={styles.pageWrapper} style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
            <div className={styles.meshContainer}></div>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 1.5rem',
                fontFamily: "'Outfit', sans-serif"
            }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: '#0f766e',
                        marginBottom: '0.5rem',
                        fontFamily: "'Outfit', sans-serif"
                    }}>
                        Community Reviews
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                        See what others are saying about their journey with DivineSpark.
                    </p>
                </div>

                <div className={styles.splitLayout}>
                    <div className={styles.stickyForm}>
                        <ReviewForm onReviewSubmitted={() => setRefreshTrigger(prev => prev + 1)} />
                    </div>
                    <div>
                        <ReviewList refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;
