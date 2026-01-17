import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Reviews.module.css';
import Button from '../ui/Button';

export const ReviewReminder: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const checkVisibility = () => {
            const hasClosed = localStorage.getItem('has_closed_reminder');
            const hasReviewed = sessionStorage.getItem('has_reviewed');
            // Don't show on the reviews page itself
            const isReviewPage = location.pathname === '/reviews';

            if (isAuthenticated && !isReviewPage) {
                // Note: Checks for hasClosed and hasReviewed removed for demo/testing purposes
                // Small delay for entrance animation and non-intrusiveness
                timer = setTimeout(() => setIsVisible(true), 1500);
            } else {
                setIsVisible(false);
            }
        };

        const handleSubmitted = () => setIsVisible(false);
        window.addEventListener('review_submitted', handleSubmitted);

        checkVisibility();

        return () => {
            window.removeEventListener('review_submitted', handleSubmitted);
            if (timer) clearTimeout(timer);
        };
    }, [isAuthenticated, location.pathname]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('has_closed_reminder', 'true');
    };

    const handleClick = () => {
        navigate('/reviews');
        setIsVisible(false);
        // Requirement: Hide after clicking
        localStorage.setItem('has_closed_reminder', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className={styles.reminder}>
            <button
                className={styles.closeBtn}
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                aria-label="Close reminder"
            >
                ×
            </button>
            <div className={styles.reminderContent}>
                <div className={styles.reminderTitle}>Loved DivineSpark? 💚</div>
                <Button size="sm" fullWidth onClick={handleClick}>
                    Leave a Review
                </Button>
            </div>
        </div>
    );
};
