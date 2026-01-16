import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { sessionApi } from '../api/session.api';
import type { Session } from '../types/session.types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './SessionDetails.module.css';
import { formatDate, formatCurrency } from '../utils/format';
import { razorpayService } from '../services/razorpay.service';

const SessionDetails: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const location = useLocation();
    const initialSession = location.state?.session as Session | undefined;

    // Initialize with passed session if available to avoid loading state if we have data
    const [session, setSession] = useState<Session | null>(initialSession || null);

    // If we have initial data, we aren't "loading" in the visual sense, but we still fetch fresh data
    const [loading, setLoading] = useState(!initialSession);
    const [actionLoading, setActionLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [isBooked, setIsBooked] = useState(false);

    useEffect(() => {
        if (sessionId) {
            fetchSession(sessionId);
        }
    }, [sessionId]);

    useEffect(() => {
        if (isAuthenticated && session) {
            checkBookingStatus();
        } else {
            setIsBooked(false);
        }
    }, [isAuthenticated, session]);

    const checkBookingStatus = async () => {
        try {
            const bookings = await sessionApi.getUserBookings();
            const currentSessionId = Number(session?.id);

            const hasBooking = bookings.some((b: any) => {
                const bSid = Number(b.sessionId ?? b.session_id ?? b.session?.id);
                // Check if session ID matches AND status is confirmed (or pending if you want to block duplicates too)
                // Ususally confirmed is the strict check.
                const status = String(b.status ?? '').toUpperCase().trim();
                return bSid === currentSessionId && status === 'CONFIRMED';
            });

            setIsBooked(hasBooking);
        } catch (error) {
            console.error('Failed to check booking status', error);
        }
    };

    const fetchSession = async (id: string) => {
        try {
            setLoading(true);
            const data = await sessionApi.getSession(id);
            // Fallback for guideName if missing in detail but present in list
            if (!data.guideName && initialSession?.guideName) {
                data.guideName = initialSession.guideName;
            }
            setSession(data);
        } catch (error) {
            showToast('Failed to load session details', 'error');
            console.error(error);
            navigate('/sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!session) return;

        if (isBooked) {
            showToast('You have already booked this session.', 'info');
            return;
        }

        if (!isAuthenticated) {
            showToast('Please login to continue', 'info');
            navigate('/login', { state: { from: location } });
            return;
        }

        setActionLoading(true);

        // 1. Pre-check: Verify booking status from backend fresh (Best Effort)
        try {
            const bookings = await sessionApi.getUserBookings();
            const currentSessionId = Number(session.id);
            const freshIsBooked = bookings.some((b: any) => {
                const bSid = Number(b.sessionId ?? b.session_id ?? b.session?.id);
                const status = String(b.status ?? '').toUpperCase().trim();
                return bSid === currentSessionId && status === 'CONFIRMED';
            });

            if (freshIsBooked) {
                setIsBooked(true);
                showToast('Session already Booked!', 'info');
                setActionLoading(false);
                return;
            }
        } catch (ignored) {
            console.warn('Pre-booking check failed', ignored);
        }

        try {

            if (session.type === 'FREE') {
                await sessionApi.joinSession(session.id);
                showToast(`Successfully joined "${session.title}"`, 'success');
                setIsBooked(true); // Optimistically update
                return;
            }

            // ---- PAID SESSION FLOW ----

            // Load Razorpay SDK
            const isLoaded = await razorpayService.loadRazorpay();
            if (!isLoaded) {
                showToast('Razorpay SDK failed to load. Are you online?', 'error');
                return;
            }

            //Create Razorpay order (backend)
            const orderData = await sessionApi.payForSession(session.id);

            //Open Razorpay checkout
            razorpayService.initializePayment(
                {
                    orderId: orderData.orderId,
                    amount: orderData.amount,
                    currency: orderData.currency
                },
                session,
                () => {
                    showToast(
                        'Payment successful! You will receive session details shortly.',
                        'success'
                    );
                    setIsBooked(true); // Optimistically update
                    // Webhook will confirm booking
                    // navigate('/sessions'); // Optional: stay on page to see "Booked" status
                },
                (errorMsg) => {
                    showToast(errorMsg || 'Payment failed', 'error');
                }
            );

        } catch (error: any) {
            console.error('Payment Action Failed:', error);

            // Extract error message from various possible locations
            const status = error.response?.status;
            const data = error.response?.data;
            const messageFromData = typeof data === 'string' ? data : (data?.message || data?.error);
            const errorMsg = String(messageFromData || error.message || '').toLowerCase();

            // Handle duplicate booking specific case
            if ((status === 400 || status === 409) && (errorMsg.includes('already booked') || errorMsg.includes('duplicate'))) {
                const displayMsg = messageFromData || 'You have already booked this session.';
                showToast(displayMsg, 'info');
                setIsBooked(true); // Sync state
            } else {
                const displayMsg = typeof messageFromData === 'string' ? messageFromData : 'Unable to book session. Please try again.';
                showToast(displayMsg, 'error');
            }
        } finally {
            setActionLoading(false);
        }
    };


    const getDuration = (start: string, end: string) => {
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();
        const diffMinutes = Math.round((e - s) / 60000);
        return `${diffMinutes} mins`;
    };

    if (loading) {
        return (
            <Section>
                <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.6 }}>Loading details...</div>
            </Section>
        );
    }

    if (!session) return null;

    const isFree = session.type === 'FREE';
    const isExpired = new Date(session.startTime) < new Date();

    return (
        <Section className={styles.pageWrapper}>
            <div className={styles.meshContainer}></div>
            <div className={styles.container}>
                {/* Hero Header */}
                <div className={styles.heroHeader}>
                    <h1 className={styles.title}>{session.title}</h1>
                    <div className={styles.instructorRow}>
                        <span className={styles.instructorLabel}>with</span>
                        <span className={styles.instructorName}>{session.guideName}</span>
                    </div>
                </div>

                {/* Divider */}
                <hr className={styles.divider} />

                {/* Meta Info Row */}
                <div className={styles.metaRow}>
                    <div className={styles.metaPill}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{formatDate(session.startTime)}</span>
                    </div>
                    <div className={styles.metaPill}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{getDuration(session.startTime, session.endTime)}</span>
                    </div>
                    <div className={styles.metaPill}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        <span>{session.type} Session</span>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className={styles.mainLayout}>
                    {/* Left: Description */}
                    <div className={styles.descriptionCard}>
                        <h3 className={styles.cardTitle}>About this Session</h3>
                        <p className={styles.descriptionText}>{session.description}</p>
                    </div>

                    {/* Right: Action/Booking Card */}
                    <div className={styles.actionColumn}>
                        <div className={styles.actionCard}>
                            <div className={styles.priceTag}>
                                <span className={styles.priceLabel}>{isFree ? 'Entry' : 'Price'}</span>
                                <span className={styles.priceValue}>
                                    {isFree ? 'Free' : formatCurrency(session.price, session.currency)}
                                </span>
                            </div>

                            <Button
                                size="lg"
                                variant="primary"
                                onClick={handleAction}
                                disabled={actionLoading || isExpired || isBooked}
                                className={styles.actionButton}
                                style={{ width: '100%', cursor: isBooked ? 'not-allowed' : 'pointer' }}
                            >
                                {isBooked ? 'Already Booked' : actionLoading ? 'Processing...' : (isFree ? 'Join Now' : 'Book Session')}
                            </Button>

                            {isExpired && (
                                <p className={styles.expiredNotice}>This session has ended</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Section >
    );
};

export default SessionDetails;


