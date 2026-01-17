import React, { useEffect, useState, useRef, useMemo } from 'react';
import { sessionApi } from '../api/session.api';
import type { Session } from '../types/session.types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sessions.module.css';
import Button from '../components/ui/Button';
import { formatFullDateTime, formatCurrency } from '../utils/format';
import { razorpayService } from '../services/razorpay.service';
import RetreatContentSection from '../components/sessions/RetreatContentSection';

import { API_BASE_URL, ADMIN_ENDPOINTS } from '../api/endpoints';



type BookingLike = {
    id?: any;
    status?: any;
    sessionId?: any;
    session_id?: any;
    session?: { id?: any };
};

const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [userBookings, setUserBookings] = useState<BookingLike[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchSessions();
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    // Fetch bookings whenever user becomes authenticated
    useEffect(() => {
        if (isAuthenticated) fetchUserBookings();
        else setUserBookings([]);
    }, [isAuthenticated]);

    const fetchUserBookings = async () => {
        try {
            const bookings = await sessionApi.getUserBookings();

            // Normalize to always have sessionId (number)
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

    // A fast lookup map: sessionId -> booking
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
        return status === 'CONFIRMED';
    };

    // Set up IntersectionObserver after sessions load
    useEffect(() => {
        if (sessions.length === 0) return;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setActiveIndex(index);
                    }
                });
            },
            { threshold: 0.6 }
        );

        const slides = document.querySelectorAll(`.${styles.slide}`);
        slides.forEach((slide) => {
            if (observerRef.current) observerRef.current.observe(slide);
        });
    }, [sessions]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data: any = await sessionApi.getSessions({ page: 0, size: 20 });

            if (Array.isArray(data)) setSessions(data);
            else if (data?.sessions) setSessions(data.sessions);
            else if (data?.content) setSessions(data.content);
            else setSessions([]);
        } catch (error) {
            showToast('Failed to load upcoming sessions', 'error');
            setSessions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionAction = async (session: Session) => {
        if (!isAuthenticated) {
            showToast('Please login to join this session', 'info');
            navigate('/login', { state: { from: location } });
            return;
        }

        setActionLoading(session.id); // Show loading immediately

        // 1. Fresh check for bookings to avoid stale state (Best Effort)
        try {
            const bookings = await sessionApi.getUserBookings();
            const normalizedBookings = (bookings || []).map((b: any) => ({
                ...b,
                sessionId: Number(b.sessionId ?? b.session_id ?? b.session?.id),
                status: String(b.status ?? '').toUpperCase().trim(),
            }));

            // Update state too so UI reflects it
            setUserBookings(normalizedBookings);

            const booking = normalizedBookings.find(b => b.sessionId === Number(session.id));

            if (booking && booking.status === 'CONFIRMED') {
                showToast('Session already Booked! Please check your email.', 'info');
                setActionLoading(null);
                return;
            }
        } catch (ignored) {

        }

        try {

            // Proceed if not booked
            if (session.type === 'FREE') {
                await sessionApi.joinSession(session.id);
                showToast(`Successfully joined "${session.title}"`, 'success');
                await fetchUserBookings(); // refresh
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
                        showToast('Payment successful! You will receive session details shortly.', 'success');
                        await fetchUserBookings(); // refresh after payment
                        navigate(`/sessions/${session.id}`, { state: { session } });
                    },
                    (errorMsg) => {
                        showToast(errorMsg || 'Payment failed', 'error');
                    }
                );
            }
        } catch (error: any) {

            console.dir(error);

            const data = error.response?.data;
            const messageFromData = typeof data === 'string' ? data : (data?.message || data?.error);
            const errorMsg = String(messageFromData || error.message || '').toLowerCase();

            if (errorMsg.includes('already booked')) {
                showToast('Session already Booked!', 'info');
                fetchUserBookings();
                return;
            }

            // Fallback: Check if we are actually booked now (handling 500s masked)
            try {
                const bookings = await sessionApi.getUserBookings();
                const isBookedNow = bookings.some((b: any) => {
                    const bSid = Number(b.sessionId ?? b.session_id ?? b.session?.id);
                    return bSid === Number(session.id) && String(b.status).toUpperCase() === 'CONFIRMED';
                });
                if (isBookedNow) {
                    showToast('Session already Booked!', 'info');
                    // Update local state to reflect this
                    setUserBookings(bookings);
                    return;
                }
            } catch (ignore) { }

            const displayMsg = typeof messageFromData === 'string' ? messageFromData : 'Unable to book session. Please try again.';
            showToast(displayMsg, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleNavigation = (index: number) => {
        const container = containerRef.current;
        if (!container) return;

        const slides = container.children;
        const targetSlide = slides[index] as HTMLElement;

        if (targetSlide) {
            container.scrollTo({
                left: targetSlide.offsetLeft,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        if (loading || sessions.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % sessions.length;
            handleNavigation(nextIndex);
        }, 5000);

        return () => clearInterval(interval);
    }, [activeIndex, sessions.length, loading, isPaused]);

    if (loading) {
        return (
            <div className={styles.emptyState}>
                <h2>Loading Experiences...</h2>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className={styles.emptyState}>
                <h3>No Upcoming Sessions</h3>
                <p>Check back soon for new spiritual journeys.</p>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.meshContainer}></div>

            <div
                className={styles.horizontalSection}
                ref={containerRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {sessions.map((session, index) => {
                    const isActive = index === activeIndex;
                    const isFree = session.type === 'FREE';
                    const isExpired = new Date(session.startTime) < new Date();

                    const booking = bookingBySessionId.get(Number(session.id));
                    const isBooked = isConfirmedBooking(booking);

                    // Disable if expired OR currently processing OR already booked
                    const disabled = actionLoading === session.id || isExpired || isBooked;

                    return (
                        <div
                            key={session.id}
                            className={`${styles.slide} ${isActive ? styles.active : ''}`}
                            data-index={index}
                        >
                            <div className={styles.background}>
                                <img
                                    src={`${API_BASE_URL}${ADMIN_ENDPOINTS.THUMBNAIL(session.id)}`}
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        // If primary fails, try session.imageUrl (if different/valid)
                                        if (session.imageUrl && target.src !== session.imageUrl && target.src !== new URL(session.imageUrl, window.location.href).href) {
                                            target.src = session.imageUrl;
                                        }
                                    }}
                                    alt={session.title}
                                    className={styles.bgImage}
                                />
                                <div className={styles.overlay} />
                            </div>

                            <div className={styles.content}>
                                <h1 className={styles.title}>{session.title}</h1>
                                <p className={styles.description}>{session.description}</p>

                                <div className={styles.meta}>
                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Instructor</span>
                                        <span className={styles.metaValue}>{session.guideName}</span>
                                    </div>

                                    <div className={styles.metaItem}>
                                        <span className={styles.metaLabel}>Date & Time</span>
                                        <span className={styles.metaValue}>{formatFullDateTime(session.startTime)}</span>
                                    </div>

                                    {!isFree && (
                                        <div className={styles.metaItem}>
                                            <span className={styles.metaLabel}>Price</span>
                                            <span className={styles.metaValue}>
                                                {formatCurrency(session.price, session.currency)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.actions}>
                                    {/* Wrapper allows showing toast even when Button is disabled */}
                                    <div
                                        onClick={() => {
                                            if (isBooked) {
                                                showToast(
                                                    'Already booked. Please check your email/WhatsApp for details.',
                                                    'info'
                                                );
                                            }
                                        }}
                                    >
                                        <Button
                                            size="lg"
                                            variant={isFree ? 'outline' : 'primary'}
                                            onClick={() => {
                                                if (!isBooked) handleSessionAction(session);
                                            }}
                                            disabled={disabled}
                                            style={
                                                isBooked
                                                    ? {
                                                        backgroundColor: '#4a5568', // Gray
                                                        borderColor: '#4a5568',
                                                        color: '#e2e8f0',
                                                        opacity: 0.8,
                                                        cursor: 'not-allowed',
                                                    }
                                                    : { borderColor: 'white', color: 'white' }
                                            }
                                        >
                                            {isBooked ? 'Already Booked' : isFree ? 'Join Now' : 'Book Session'}
                                        </Button>
                                    </div>

                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        onClick={() => navigate(`/sessions/${session.id}`, { state: { session } })}
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            border: 'none',
                                        }}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className={styles.dots}>
                    {sessions.map((_, idx) => (
                        <div
                            key={idx}
                            className={`${styles.dot} ${idx === activeIndex ? styles.active : ''}`}
                            onClick={() => handleNavigation(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            <RetreatContentSection />
        </div>
    );
};

export default Sessions;
