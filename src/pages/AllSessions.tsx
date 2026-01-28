import React, { useEffect, useState, useMemo } from 'react';
import { sessionApi } from '../api/session.api';
import type { Session } from '../types/session.types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AllSessions.module.css';
import Button from '../components/ui/Button';
import { formatFullDateTime, formatCurrency } from '../utils/format';
import { razorpayService } from '../services/razorpay.service';
import defaultThumbnail from '../assets/defaultthumbnail.jpg';
import { PUBLIC_ENDPOINTS } from '../api/endpoints';
import { WhatsAppConfirmationModal } from '../components/ui/WhatsAppConfirmationModal';

type BookingLike = {
    id?: any;
    status?: any;
    sessionId?: any;
    session_id?: any;
    session?: { id?: any };
};

const AllSessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [userBookings, setUserBookings] = useState<BookingLike[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [confirmationSession, setConfirmationSession] = useState<Session | null>(null);

    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch Bookings
    useEffect(() => {
        if (isAuthenticated) fetchUserBookings();
        else setUserBookings([]);
    }, [isAuthenticated]);

    const fetchUserBookings = async () => {
        try {
            const bookings = await sessionApi.getUserBookings();
            const normalized: BookingLike[] = (bookings || []).map((b: any) => ({
                ...b,
                sessionId: Number(b.sessionId ?? b.session_id ?? b.session?.id),
                status: String(b.status ?? '').toUpperCase().trim(),
            }));
            setUserBookings(normalized);
        } catch (error) {
            setUserBookings([]);
        }
    };

    const bookingBySessionId = useMemo(() => {
        const map = new Map<number, BookingLike>();
        for (const b of userBookings) {
            const sid = Number((b as any).sessionId ?? (b as any).session_id ?? (b as any).session?.id);
            if (!Number.isNaN(sid)) map.set(sid, b);
        }
        return map;
    }, [userBookings]);

    const isConfirmedBooking = (booking?: BookingLike) => {
        const status = String(booking?.status ?? '').toUpperCase().trim();
        return ['CONFIRMED', 'PARTIALLY_PAID'].includes(status);
    };

    // Fetch All Sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                // Fetch a large number to emulate "All" for now
                const data: any = await sessionApi.getSessions({ page: 0, size: 100 });

                if (Array.isArray(data)) setSessions(data);
                else if (data?.sessions) setSessions(data.sessions);
                else if (data?.content) setSessions(data.content);
                else setSessions([]);
            } catch (error) {
                showToast('Failed to load sessions', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [showToast]);

    // Booking Logic (Reused)
    const initiateBooking = (session: Session) => {
        if (!isAuthenticated) {
            showToast('Please login to join this session', 'info');
            navigate('/login', { state: { from: location } });
            return;
        }
        setConfirmationSession(session);
    };

    const executeSessionBooking = async (session: Session) => {
        if (!isAuthenticated) {
            showToast('Please login to join this session', 'info');
            return;
        }

        setActionLoading(session.id);

        try {
            // Fresh check
            const bookings = await sessionApi.getUserBookings();
            const normalizedBookings = (bookings || []).map((b: any) => ({
                ...b,
                sessionId: Number(b.sessionId ?? b.session_id ?? b.session?.id),
                status: String(b.status ?? '').toUpperCase().trim(),
            }));
            setUserBookings(normalizedBookings);

            const booking = normalizedBookings.find(b => b.sessionId === Number(session.id));
            if (booking && ['CONFIRMED', 'PARTIALLY_PAID'].includes(booking.status)) {
                showToast('Session already Booked! Please check details.', 'info');
                setActionLoading(null);
                return;
            }
        } catch (ignored) { }

        try {
            if (session.type === 'FREE') {
                await sessionApi.joinSession(session.id);
                showToast(`Successfully joined "${session.title}"`, 'success');
                await fetchUserBookings();
                navigate(`/sessions/${session.id}`, { state: { session } });
            } else {
                const isLoaded = await razorpayService.loadRazorpay();
                if (!isLoaded) {
                    showToast('Razorpay SDK failed to load. Are you online?', 'error');
                    return;
                }
                const orderData = await sessionApi.payForSession(session.id);
                razorpayService.initializePayment(
                    {
                        orderId: orderData.orderId,
                        amount: orderData.amount,
                        currency: orderData.currency,
                    },
                    session,
                    async () => {
                        showToast('Payment successful!', 'success');
                        await fetchUserBookings();
                        navigate(`/sessions/${session.id}`, { state: { session } });
                    },
                    (errorMsg) => showToast(errorMsg || 'Payment failed', 'error')
                );
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Unable to book session.';
            showToast(msg, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.meshContainer}></div>

            <div className={styles.titleSection}>
                <h1 className={styles.pageTitle}>All Meditation Sessions</h1>
                <p className={styles.pageSubtitle}>Explore our full range of spiritual journeys and healing experiences.</p>
            </div>

            {loading ? (
                <div className={styles.loadingState}>Loading sessions...</div>
            ) : sessions.length === 0 ? (
                <div className={styles.emptyState}>No sessions available at the moment.</div>
            ) : (
                <div className={styles.gridContainer}>
                    {sessions.map(session => {
                        const isFree = session.type === 'FREE';
                        const isExpired = new Date(session.startTime) < new Date();
                        const booking = bookingBySessionId.get(Number(session.id));
                        const isBooked = isConfirmedBooking(booking);
                        const disabled = actionLoading === session.id || isExpired || isBooked;

                        return (
                            <div key={session.id} className={styles.card}>
                                <img
                                    src={PUBLIC_ENDPOINTS.THUMBNAIL(session.id)}
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        if (session.imageUrl && target.src !== session.imageUrl) {
                                            target.src = session.imageUrl;
                                        } else {
                                            target.src = defaultThumbnail;
                                        }
                                    }}
                                    alt={session.title}
                                    className={styles.cardImage}
                                />
                                <div className={styles.cardContent}>
                                    <div className={styles.instructor}>{session.guideName}</div>
                                    <h3 className={styles.cardTitle}>{session.title}</h3>
                                    <p className={styles.description}>{session.description}</p>

                                    <div className={styles.metaGrid}>
                                        <div className={styles.metaItem}>
                                            <span className={styles.metaLabel}>Date</span>
                                            <span className={styles.metaValue}>{formatFullDateTime(session.startTime)}</span>
                                        </div>
                                        {!isFree && (
                                            <div className={styles.metaItem}>
                                                <span className={styles.metaLabel}>Price</span>
                                                <span className={styles.metaValue}>{formatCurrency(session.price, session.currency)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.actions}>
                                        <Button
                                            variant="secondary"
                                            onClick={() => navigate(`/sessions/${session.id}`, { state: { session } })}
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => !isBooked && initiateBooking(session)}
                                            disabled={disabled}
                                            style={isBooked ? { backgroundColor: '#4a5568', borderColor: '#4a5568', cursor: 'not-allowed' } : {}}
                                        >
                                            {isBooked ? 'Booked' : isExpired ? 'Expired' : 'Book Now'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <WhatsAppConfirmationModal
                isOpen={!!confirmationSession}
                onClose={() => setConfirmationSession(null)}
                onConfirm={() => {
                    if (confirmationSession) {
                        executeSessionBooking(confirmationSession);
                        setConfirmationSession(null);
                    }
                }}
            />
        </div>
    );
};

export default AllSessions;
