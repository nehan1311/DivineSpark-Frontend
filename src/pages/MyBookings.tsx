import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/session.api';
import type { UserBooking } from '../types/session.types';
import styles from './MyBookings.module.css';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import { formatDate, formatTime } from '../utils/format';

// Review Modal Component (Internal)
interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    isSubmitting: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(rating, comment);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>Rate your experience</h3>
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
                        className={styles.commentInput}
                        placeholder="Share your thoughts..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                    <div className={styles.modalActions}>
                        <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [bookings, setBookings] = useState<{ upcoming: UserBooking[]; past: UserBooking[] }>({
        upcoming: [],
        past: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // active actions state
    const [cancellingId, setCancellingId] = useState<number | null>(null);
    const [ratingId, setRatingId] = useState<number | null>(null); // bookingId for review
    const [submittingReview, setSubmittingReview] = useState(false);
    const [waLoadingId, setWaLoadingId] = useState<number | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await sessionApi.getUserBookings();

            // Strict filtering based on bookingStatus ONLY
            const upcoming = data.filter(b => b.bookingStatus === 'CONFIRMED');
            const past = data.filter(b => b.bookingStatus === 'COMPLETED' || b.bookingStatus === 'CANCELLED');

            setBookings({ upcoming, past });
            setError(null);
        } catch (err: any) {
            console.error('Error fetching bookings:', err);
            if (err.response?.status === 401) {
                showToast('Please login to view bookings', 'error');
                navigate('/login');
                return;
            }
            const errorMessage = err.response?.data?.message || err.message || 'Failed to load bookings.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinSession = (link?: string) => {
        if (link) window.open(link, '_blank');
    };

    const handleWhatsAppJoin = async (sessionId: number, bookingId: number) => {
        setWaLoadingId(bookingId);
        try {
            const link = await sessionApi.getWhatsAppLink(sessionId);
            if (link) {
                window.open(link, '_blank');
            } else {
                showToast('WhatsApp link not available yet.', 'info');
            }
        } catch (error) {
            showToast('Failed to fetch WhatsApp link', 'error');
        } finally {
            setWaLoadingId(null);
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            setCancellingId(bookingId);
            await sessionApi.cancelBooking(bookingId);
            showToast('Booking cancelled successfully', 'success');
            fetchBookings(); // Refetch to update list
        } catch (error) {
            console.error('Cancel booking error:', error);
            showToast('Failed to cancel booking', 'error');
        } finally {
            setCancellingId(null);
        }
    };

    const handleSubmitReview = async (rating: number, comment: string) => {
        if (!ratingId) return;

        try {
            setSubmittingReview(true);
            await sessionApi.submitReview(ratingId, { rating, comment });
            showToast('Review submitted successfully', 'success');
            setRatingId(null); // Close modal
            fetchBookings(); // Refetch
        } catch (error) {
            console.error('Review error:', error);
            showToast('Failed to submit review', 'error');
        } finally {
            setSubmittingReview(false);
        }
    };

    const displayedBookings = activeTab === 'upcoming' ? bookings.upcoming : bookings.past;

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return styles.statusConfirmed;
            case 'COMPLETED': return styles.statusCompleted; // Need to add to CSS
            case 'CANCELLED': return styles.statusCancelled;
            default: return styles.statusPending;
        }
    };

    if (loading && !bookings.upcoming.length && !bookings.past.length) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', color: '#fff', marginTop: '3rem' }}>
                    Loading bookings...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '3rem' }}>
                    <p>{error}</p>
                    <Button onClick={fetchBookings}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.bgContainer} />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>My Bookings</h1>

                    <p className={styles.subtitle}>Manage and join your scheduled sessions.</p>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming ({bookings.upcoming.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'past' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past ({bookings.past.length})
                    </button>
                </div>

                {displayedBookings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>
                            No {activeTab} bookings found.
                        </p>
                        {activeTab === 'upcoming' && (
                            <Button onClick={() => navigate('/sessions')}>Browse Sessions</Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className={styles.sectionLabel}>
                            {activeTab === 'upcoming' ? 'Upcoming Sessions' : 'Past Sessions'}
                        </div>
                        <div className={styles.bookingGrid}>
                            {displayedBookings.map((booking) => (
                                <div key={booking.bookingId} className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.sessionType}>
                                            {booking.sessionType}
                                        </span>
                                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(booking.bookingStatus)}`}>
                                            {booking.bookingStatus}
                                        </span>
                                        <h3 className={styles.sessionTitle}>{booking.sessionTitle}</h3>
                                    </div>

                                    <div className={styles.cardDetails}>
                                        <div className={styles.detailRow}>
                                            <span>📅</span>
                                            <span>{formatDate(booking.startTime)}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>⏰</span>
                                            <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                                        </div>
                                        {booking.guideName && (
                                            <div className={styles.detailRow}>
                                                <span>🧘</span>
                                                <span>{booking.guideName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.cardActions}>
                                        {/* Actions for Upcoming (CONFIRMED) */}
                                        {booking.bookingStatus === 'CONFIRMED' && (
                                            <>
                                                {booking.joinLink ? (
                                                    <button
                                                        className={styles.joinButton}
                                                        onClick={() => handleJoinSession(booking.joinLink)}
                                                    >
                                                        Join Session
                                                    </button>
                                                ) : (
                                                    <span className={styles.disabledLinkText}>Link not available yet</span>
                                                )}

                                                <button
                                                    className={styles.joinButton}
                                                    style={{ backgroundColor: '#25D366', borderColor: '#25D366', marginTop: '0.5rem', marginBottom: '0.5rem' }}
                                                    onClick={() => handleWhatsAppJoin(booking.sessionId, booking.bookingId)}
                                                    disabled={waLoadingId === booking.bookingId}
                                                >
                                                    {waLoadingId === booking.bookingId ? 'Fetching...' : 'Join WhatsApp Group'}
                                                </button>

                                                <button
                                                    className={styles.cancelButton}
                                                    disabled={cancellingId === booking.bookingId}
                                                    onClick={() => handleCancelBooking(booking.bookingId)}
                                                >
                                                    {cancellingId === booking.bookingId ? 'Cancelling...' : 'Cancel Booking'}
                                                </button>
                                            </>
                                        )}

                                        {/* Actions for Completed */}
                                        {booking.bookingStatus === 'COMPLETED' && (
                                            <>
                                                {!booking.reviewSubmitted ? (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => setRatingId(booking.bookingId)}
                                                    >
                                                        Write a Review
                                                    </Button>
                                                ) : (
                                                    <span className={styles.reviewBadge}>✓ Review Submitted</span>
                                                )}
                                            </>
                                        )}

                                        {/* Actions for Cancelled - just text */}
                                        {booking.bookingStatus === 'CANCELLED' && (
                                            <span className={styles.cancelledText}>Booking Cancelled</span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Info Card when only 1 booking */}
                            {displayedBookings.length === 1 && activeTab === 'upcoming' && (
                                <div className={styles.infoCard}>
                                    <h3 className={styles.infoCardTitle}>
                                        <span className={styles.infoIcon}>💡</span> Preparing for your session
                                    </h3>
                                    <ul className={styles.infoList}>
                                        <li className={styles.infoItem}>
                                            <span className={styles.infoIcon}>📍</span> Find a quiet, comfortable space where you won't be disturbed.
                                        </li>
                                        <li className={styles.infoItem}>
                                            <span className={styles.infoIcon}>💧</span> Keep some water nearby to stay hydrated.
                                        </li>
                                        <li className={styles.infoItem}>
                                            <span className={styles.infoIcon}>🎧</span> Use headphones for the best audio experience.
                                        </li>
                                        <li className={styles.infoItem}>
                                            <span className={styles.infoIcon}>⏰</span> Join 5 minutes early to check your connection.
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                )}


                {/* Review Modal */}
                <ReviewModal
                    isOpen={!!ratingId}
                    onClose={() => setRatingId(null)}
                    onSubmit={handleSubmitReview}
                    isSubmitting={submittingReview}
                />
            </div>
        </>
    );
};

export default MyBookings;
