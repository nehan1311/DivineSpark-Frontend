import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import { sessionApi } from '../api/session.api';
import { PUBLIC_ENDPOINTS } from '../api/endpoints';
import defaultThumbnail from '../assets/defaultthumbnail.png';
import type { Session } from '../types/session.types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './SessionDetails.module.css';
import { formatDate, formatCurrency } from '../utils/format';
import { razorpayService } from '../services/razorpay.service';
import { WhatsAppConfirmationModal } from '../components/ui/WhatsAppConfirmationModal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import Contact from './Contact';
import { PaymentChoiceModal } from '../components/ui/PaymentChoiceModal';
import { InstallmentPaymentCard } from '../components/payment/InstallmentPaymentCard';
import type { UserBooking, Installment } from '../types/session.types';


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


    const [booking, setBooking] = useState<UserBooking | null>(null);
    const [installments, setInstallments] = useState<Installment[]>([]);
    const [loadingInstallments, setLoadingInstallments] = useState(false);
    const [payingInstallmentId, setPayingInstallmentId] = useState<number | null>(null);

    const [waLoading, setWaLoading] = useState(false);
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState<'full' | 'installment' | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);

    useEffect(() => {
        if (sessionId) {
            fetchSession(sessionId);
        }
    }, [sessionId]);

    useEffect(() => {
        if (isAuthenticated && session) {
            checkBookingStatus();
        }
    }, [isAuthenticated, session]);

    useEffect(() => {
        console.log("BOOKING STATE UPDATED 👉", booking);
    }, [booking]);

    useEffect(() => {
        console.log("INSTALLMENTS STATE UPDATED 👉", installments);
    }, [installments]);

    const checkBookingStatus = async () => {
        try {
            const bookings = await sessionApi.getUserBookings();
            console.log("ALL USER BOOKINGS 👉", bookings);

            // Find specific booking for this session using robust matching
            const myBooking = bookings.find((b: any) => {
                const bookingSessionId = b.session?.id ?? b.sessionId ?? b.session_id;
                return Number(bookingSessionId) === Number(session?.id);
            });

            console.log("MATCHED BOOKING 👉", myBooking);

            if (myBooking) {
                setBooking(myBooking);

                // Always try to fetch installments if we have a booking ID
                // This covers cases where status might be CONFIRMED but there are still future installments
                // or where paymentType might be missing.
                if (myBooking.bookingId) {
                    fetchInstallments(myBooking.bookingId);
                }
            } else {
                setBooking(null);
                setInstallments([]);
            }
        } catch (error) {
            console.error('Error checking booking status:', error);
        }
    };

    const fetchInstallments = async (bookingId: number) => {
        try {
            setLoadingInstallments(true);
            const data = await sessionApi.getBookingInstallments(bookingId);
            console.log("INSTALLMENTS FROM API 👉", data);
            setInstallments(data);
        } catch (error: any) {
            // If 404, it just means no installments exist (e.g. invalid ID or fully paid without installments), so we can ignore.
            // Only log if it's NOT a 404.
            if (error.response?.status !== 404) {
                console.error('Failed to fetch installments', error);
                // Optional: showToast('Failed to load installment details', 'error'); 
            }
            // Ensure we clear installments on error so we don't show stale data
            setInstallments([]);
        } finally {
            setLoadingInstallments(false);
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

            navigate('/sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppJoin = async () => {
        if (!session) return;
        setWaLoading(true);
        try {
            const link = await sessionApi.getWhatsAppLink(session.id);
            if (link) {
                window.open(link, '_blank');
            } else {
                showToast('WhatsApp link not available yet. Please check back later.', 'info');
            }
        } catch (error) {
            showToast('Failed to fetch WhatsApp link', 'error');
        } finally {
            setWaLoading(false);
        }
    };

    const handleBookClick = () => {
        if (!session) return;

        if (booking) {
            showToast('You have already booked this session.', 'info');
            return;
        }

        if (!isAuthenticated) {
            showToast('Please login to continue', 'info');
            navigate('/login', { state: { from: location } });
            return;
        }

        if (session.type === 'FREE') {
            setShowWhatsAppModal(true);
        } else {
            // For paid sessions also, show WhatsApp modal first
            setShowWhatsAppModal(true);
        }
    };

    const handlePreBookingConfirm = () => {
        // Did the user connect on WhatsApp? Yes (implied by step 2 of WA modal).
        // Now ask for final confirmation "Do you really want to join?".
        setShowConfirmModal(true);
    };

    const handleFinalProceed = () => {
        if (!session) return;

        setShowConfirmModal(false);

        if (session.type === 'FREE') {
            handleFreeBooking();
        } else {
            setShowPaymentModal(true);
        }
    };

    const handleFreeBooking = async () => {
        if (!session) return;

        // Double check auth just in case
        if (!isAuthenticated) {
            showToast('Please login to continue', 'info');
            return;
        }

        setActionLoading(true);

        try {
            await sessionApi.joinSession(session.id);
            showToast(`Successfully joined "${session.title}"`, 'success');
            setShowWhatsAppModal(false);
        } catch (error: any) {
            const data = error.response?.data;
            const message = data?.message || 'Unable to join session';
            showToast(message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleFullPayment = async () => {
        if (!session) return;
        setPaymentLoading('full');

        try {
            // Load Razorpay SDK
            const isLoaded = await razorpayService.loadRazorpay();
            if (!isLoaded) {
                showToast('Razorpay SDK failed to load. Are you online?', 'error');
                return;
            }

            // Create Razorpay order (backend)
            const orderData = await sessionApi.payForSession(session.id);

            // Open Razorpay checkout
            razorpayService.initializePayment(
                {
                    orderId: orderData.orderId,
                    amount: orderData.amount,
                    currency: orderData.currency
                },
                session,
                () => {
                    showToast('Payment successful. Booking confirmed.', 'success');
                    setShowPaymentModal(false);
                    navigate('/my-bookings');
                },
                (errorMsg) => {
                    showToast(errorMsg || 'Payment failed', 'error');
                }
            );

        } catch (error: any) {
            const data = error.response?.data;
            const message = data?.message || 'Payment initiation failed';
            showToast(message, 'error');
        } finally {
            setPaymentLoading(null);
        }
    };

    const handleInstallmentPayment = async () => {
        if (!session) return;
        setPaymentLoading('installment');

        try {
            // Load Razorpay SDK
            const isLoaded = await razorpayService.loadRazorpay();
            if (!isLoaded) {
                showToast('Razorpay SDK failed to load. Are you online?', 'error');
                return;
            }

            // Create Razorpay order for installment
            const orderData = await sessionApi.payForSessionInstallments(session.id);

            // Open Razorpay checkout
            razorpayService.initializePayment(
                {
                    orderId: orderData.razorpayOrderId,
                    amount: orderData.amount,
                    currency: 'INR' // Assuming INR as per requirements
                },
                session,
                async () => {
                    showToast('First installment paid. You have access.', 'success');
                    setShowPaymentModal(false);

                    // Verify payment first
                    await sessionApi.verifyInstallmentPayment(orderData.razorpayOrderId);

                    // Fetch plan immediately using the new booking ID
                    if (orderData.bookingId) {
                        fetchInstallments(orderData.bookingId);
                    }

                    // Refresh global booking state
                    checkBookingStatus();
                },
                (errorMsg) => {
                    showToast(errorMsg || 'Payment failed', 'error');
                }
            );

        } catch (error: any) {
            const data = error.response?.data;
            const message = data?.message || 'Payment initiation failed';
            showToast(message, 'error');
        } finally {
            setPaymentLoading(null);
        }
    };

    const handleNextInstallmentPayment = async (inst: Installment) => {
        if (!session) return;
        setPayingInstallmentId(inst.id);

        try {
            const isLoaded = await razorpayService.loadRazorpay();
            if (!isLoaded) {
                showToast('Razorpay SDK failed to load', 'error');
                return;
            }

            const orderData = await sessionApi.payNextInstallment(inst.id);

            razorpayService.initializePayment(
                {
                    orderId: orderData.razorpayOrderId,
                    amount: orderData.amount,
                    currency: 'INR'
                },
                session,
                () => {
                    showToast(`Installment #${inst.installmentNumber} paid successfully`, 'success');

                    // Force refresh installments and booking status
                    if (booking?.bookingId) {
                        fetchInstallments(booking.bookingId);
                    }
                    checkBookingStatus();
                },
                (err) => showToast(err || 'Payment failed', 'error')
            );
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Payment failed', 'error');
        } finally {
            setPayingInstallmentId(null);
        }
    };


    const getDuration = (start: string, end: string) => {
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();
        const diffMinutes = Math.round((e - s) / 60000);
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;

        if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min${mins > 1 ? 's' : ''}` : ''}`;
        }
        return `${mins} min${mins > 1 ? 's' : ''}`;
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
    const now = new Date();
    const isExpired = new Date(session.endTime) < now;
    const isOngoing = new Date(session.startTime) <= now && !isExpired;

    // Image handling matching Sessions.tsx strategy
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        // If current failed src is the thumbnail endpoint, try the stored imageUrl
        // But verify we aren't already on the imageUrl to avoid loop
        if (session.imageUrl && target.src !== session.imageUrl && !target.src.includes(session.imageUrl)) {
            target.src = session.imageUrl;
        } else {
            // Fallback to default
            target.src = defaultThumbnail;
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* 1. Hero Section (Full Bleed) */}
            <section className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    <img
                        src={PUBLIC_ENDPOINTS.THUMBNAIL(session.id)}
                        onError={handleImageError}
                        alt={session.title}
                        className={styles.bgImage}
                    />
                    <div className={styles.heroOverlay}></div>
                </div>

                <div className={styles.heroContent}>
                    {/* Badge */}
                    <div className={`${styles.badge} ${isFree ? styles.badgeFree : styles.badgePaid}`}>
                        {isFree ? 'Free Session' : 'Premium Session'}
                    </div>

                    <h1 className={styles.heroTitle}>{session.title}</h1>

                    <div className={styles.heroGuide}>
                        with {session.guideName}
                    </div>

                    <div className={styles.heroMeta}>
                        <div className={styles.metaItem}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {formatDate(session.startTime)}
                        </div>
                        <div className={styles.metaItem}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {getDuration(session.startTime, session.endTime)}
                        </div>
                    </div>

                    {/* Hero Buttons Container */}
                    <div className={styles.heroButtons}>
                        {/* Primary Hero CTA */}
                        {!booking ? (
                            <button
                                className={styles.heroCtaButton}
                                onClick={handleBookClick}
                                disabled={actionLoading || isExpired}
                            >
                                {isExpired ? 'Session Ended' : isOngoing && isFree ? 'Join Now (Live)' : isFree ? 'Join Session' : 'Book Your Spot'}
                            </button>
                        ) : (
                            <button
                                className={styles.heroCtaButton}
                                disabled={true}
                            >
                                ✓ Session Booked
                            </button>
                        )}

                        {/* WhatsApp CTA (If booked) */}
                        {booking && (
                            <div className={styles.waButtonWrapper}>
                                <Button
                                    size="md"
                                    variant="outline"
                                    onClick={handleWhatsAppJoin}
                                    disabled={waLoading}
                                    style={{
                                        borderColor: 'rgba(255,255,255,0.6)',
                                        color: '#fff',
                                        backdropFilter: 'blur(4px)',
                                        background: 'rgba(255,255,255,0.15)',
                                        padding: '0.75rem 1.5rem',
                                        fontSize: '1rem'
                                    }}
                                >
                                    {waLoading ? 'Loading Group...' : 'Access WhatsApp Group'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 2. Floating Info Panel (Glassmorphism) */}
            <div className={styles.glassPanelContainer}>
                <div className={styles.glassPanel}>
                    <div className={styles.panelItem}>
                        <span className={styles.panelLabel}>Price</span>
                        <div className={styles.panelValue}>
                            {isFree ? 'Free' : formatCurrency(session.price, session.currency)}
                        </div>
                    </div>

                    <div className={styles.panelItem}>
                        <span className={styles.panelLabel}>Availability</span>
                        <div className={styles.statusIndicator}>
                            <span className={styles.statusDot} style={{ backgroundColor: session.currentParticipants >= session.maxParticipants ? '#ef4444' : '#22c55e' }}></span>
                            {session.currentParticipants >= session.maxParticipants ? 'Full' : 'Open'}
                        </div>
                    </div>

                    <div className={styles.panelItem}>
                        <span className={styles.panelLabel}>Format</span>
                        <div className={styles.panelValue} style={{ fontSize: '1.25rem' }}>
                            Live Online
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Section */}
            <section className={styles.contentSection}>
                <div className={`${styles.contentContainer} ${installments.length > 0 && booking?.status !== 'CANCELLED' ? styles.contentGridWithSidebar : ''}`}>
                    <div className={styles.aboutBlock}>
                        <h2 className={styles.sectionHeading}>About This Session</h2>
                        <div className={styles.descriptionText}>
                            {session.description}
                        </div>
                    </div>

                    {/* Installment Plan (If applicable) */}
                    {installments.length > 0 && booking?.status !== 'CANCELLED' && (
                        <div className={styles.installmentWrapper}>
                            <h3 className={styles.installmentTitle}>Your Payment Plan</h3>
                            <InstallmentPaymentCard
                                installments={installments}
                                currency={session.currency}
                                onPayInstallment={handleNextInstallmentPayment}
                                loadingInstallmentId={payingInstallmentId}
                            />
                        </div>
                    )}

                    {/* Help / Footer */}
                    <div className={styles.helpSection} style={{ gridColumn: '1 / -1' }}>
                        <p className={styles.helpText}>
                            Have questions about this session? We are here to help.
                        </p>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className={styles.contactLink}
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </section>

            {/* Modals */}
            <WhatsAppConfirmationModal
                isOpen={showWhatsAppModal}
                onClose={() => setShowWhatsAppModal(false)}
                onConfirm={handlePreBookingConfirm}
            />
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleFinalProceed}
                title="Confirm Booking"
                message={`Do you really want to join "${session.title}"?`}
                confirmText="Yes, Proceed"
            />
            <PaymentChoiceModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onPayFull={handleFullPayment}
                onPayInstallments={handleInstallmentPayment}
                loadingFull={paymentLoading === 'full'}
                loadingInstallment={paymentLoading === 'installment'}
                amount={session.price}
                currency={session.currency}
            />
            <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </div>
    );
};

export default SessionDetails;


