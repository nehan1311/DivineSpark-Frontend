import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { reviewApi } from '../../api/review.api';
import Button from '../ui/Button';
import styles from './Reviews.module.css';
import { useNavigate } from 'react-router-dom';

interface ReviewFormProps {
    onReviewSubmitted: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onReviewSubmitted }) => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className={styles.formCard}>
                <div className={styles.loginPrompt} style={{ background: 'transparent', boxShadow: 'none', margin: 0, padding: 0 }}>
                    <h3 style={{ color: '#1e293b' }}>Please log in to leave a review</h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Join our community to share your experience.</p>
                    <Button onClick={() => navigate('/login', { state: { from: '/reviews' } })}>Login Now</Button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className={styles.formCard}>
                <h3 style={{ color: '#0f766e', marginBottom: '0.5rem' }}>Thank you for sharing your thoughts 💚</h3>
                <p style={{ color: '#64748b' }}>Your review helps us grow and serve better.</p>
                <div style={{ marginTop: '1.5rem' }}>
                    <Button variant="outline" onClick={() => setSuccess(false)}>Write Another</Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!comment.trim()) {
            showToast('Please write something in your review', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await reviewApi.submitPlatformReview({ rating, comment });
            showToast('Thank you for your feedback 💚', 'success');
            setSuccess(true);
            setRating(5);
            setComment('');
            onReviewSubmitted();
            // Mark as reviewed in session storage so reminder doesn't show
            sessionStorage.setItem('has_reviewed', 'true');
            // Dispatch event to hide reminder if present
            window.dispatchEvent(new Event('review_submitted'));
        } catch (error: any) {
            console.error('Submit review error:', error);
            if (error.response?.status === 409) {
                showToast('You have already submitted a review 🙏', 'info');
                setSuccess(true);
                sessionStorage.setItem('has_reviewed', 'true');
                // We don't call onReviewSubmitted() here to avoid re-fetching if nothing changed,
                // but user might want to see their review? The list is generic.
            } else {
                showToast('Failed to submit review', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formCard}>
            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Rate your experience</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.starRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`${styles.starBtn} ${star <= rating ? styles.activeStar : ''}`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <textarea
                    className={styles.textarea}
                    placeholder="What did you enjoy most about DivineSpark?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <div className={styles.actions}>
                    <Button type="submit" disabled={isSubmitting} fullWidth>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
