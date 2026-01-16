import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/session.api';
import type { UserBooking } from '../types/session.types';
import styles from './MyBookings.module.css';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button'; // Assuming generic Button exists
import { formatDate, formatTime } from '../utils/format';

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

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await sessionApi.getUserBookings();
            setBookings({
                upcoming: data.upcoming || [],
                past: data.past || []
            });
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch bookings:', err);
            if (err.isAxiosError) {
                console.error('Axios config:', err.config);
                console.error('Axios response:', err.response);
                console.error('Axios request:', err.request);
            }
            // Handle 401 specifically if needed, though usually handled by interceptors or _ensureAuth throwing
            if (err.response?.status === 401) {
                showToast('Please login to view bookings', 'error');
                navigate('/login');
                return;
            }
            setError(err.response?.data?.message || err.message || 'Failed to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinSession = (link?: string) => {
        if (link) {
            window.open(link, '_blank');
        }
    };



    const displayedBookings = activeTab === 'upcoming' ? bookings.upcoming : bookings.past;

    if (loading) {
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
                <div className={styles.bookingGrid}>
                    {displayedBookings.map((booking) => (
                        <div key={booking.bookingId || booking.sessionId} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={`${styles.sessionType} ${booking.sessionType === 'FREE' ? styles.typeFree : styles.typePaid}`}>
                                    {booking.sessionType}
                                </span>
                                <h3 className={styles.sessionTitle}>{booking.sessionTitle}</h3>
                            </div>

                            <div className={styles.cardDetails}>
                                <div className={styles.detailRow}>
                                    <span>📅</span>
                                    <span>{formatDate(booking.startTime)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>⏳</span>
                                    <span>{formatTime(booking.endTime)} End</span>
                                </div>
                                {booking.guideName && (
                                    <div className={styles.detailRow}>
                                        <span>👤</span>
                                        <span>Guide: {booking.guideName}</span>
                                    </div>
                                )}
                                <div className={`${styles.status} ${booking.status === 'CONFIRMED' ? styles.statusConfirmed :
                                    booking.status === 'CANCELLED' ? styles.statusCancelled :
                                        styles.statusPending
                                    }`}>
                                    Status: {booking.status}
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                {activeTab === 'upcoming' && booking.status !== 'CANCELLED' ? (
                                    booking.joinLink ? (
                                        <button
                                            className={styles.joinButton}
                                            onClick={() => handleJoinSession(booking.joinLink)}
                                        >
                                            Join Session
                                        </button>
                                    ) : (
                                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>
                                            Link not available yet
                                        </div>
                                    )
                                ) : (
                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>
                                        {booking.status === 'CANCELLED' ? 'Booking Cancelled' : 'Session Completed'}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
