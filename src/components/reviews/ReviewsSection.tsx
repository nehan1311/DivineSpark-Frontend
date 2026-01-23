import React, { useEffect, useState } from 'react';
import { reviewApi, type PlatformReview } from '../../api/review.api';
import UserReviewCard from './UserReviewCard';

export const ReviewsSection: React.FC = () => {
    const [reviews, setReviews] = useState<PlatformReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await reviewApi.getAllReviews();
                setReviews(data);
            } catch (err) {
                console.error('Failed to load reviews', err);
            } finally {
                setLoading(false);
            }
        };
        loadReviews();
    }, []);

    if (loading || reviews.length === 0) return null;

    return (
        <div style={{ marginTop: '5rem', paddingBottom: '2rem' }}>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: '2.5rem',
                color: '#fff',
                fontFamily: 'var(--font-family-heading)',
                textAlign: 'center',
                letterSpacing: '0.02em'
            }}>
                Community Stories
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem'
            }}>
                {reviews.map(review => (
                    <UserReviewCard key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
};
