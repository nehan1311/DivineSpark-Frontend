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

                console.log("Checking Installment Fetch Conditions:", {
                    status: myBooking.status,
                    bookingId: myBooking.bookingId
                });

                // Fetch installments if status is PARTIALLY_PAID
                if (myBooking.status === 'PARTIALLY_PAID' && myBooking.bookingId) {
                    fetchInstallments(myBooking.bookingId);
                }
            } else {
                setBooking(null);
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
        } catch (error) {
            console.error('Failed to fetch installments', error);
            showToast('Failed to load installment details', 'error');
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
                    {/* Left: Payment & Booking (Primary) */}
                    <div className={styles.paymentColumn}>
                        <div className={styles.paymentCard}>
                            <div className={styles.priceTag}>
                                <span className={styles.priceLabel}>{isFree ? 'Entry' : 'Price'}</span>
                                <span className={styles.priceValue}>
                                    {isFree ? 'Free' : formatCurrency(session.price, session.currency)}
                                </span>
                            </div>

                            {!booking && (
                                <Button
                                    size="lg"
                                    variant="primary"
                                    onClick={handleBookClick}
                                    disabled={actionLoading || isExpired}
                                    className={styles.actionButton}
                                    style={{ width: '100%' }}
                                >
                                    {isExpired ? 'Session Ended' : actionLoading ? 'Processing...' : 'Book Session'}
                                </Button>
                            )}

                            {/* Booking Status Indicator */}
                            {booking && (
                                <Button
                                    size="lg"
                                    variant="primary"
                                    disabled={true}
                                    className={styles.actionButton}
                                    style={{ width: '100%', cursor: 'default' }}
                                >
                                    Session Booked
                                </Button>
                            )}

                            {isExpired && (
                                <p className={styles.expiredNotice}>This session has ended</p>
                            )}
                        </div>

                        {/* INSTALLMENT FLOW (Partially Paid) */}
                        {booking?.status === 'PARTIALLY_PAID' && (
                            <div className={styles.installmentSection}>
                                {loadingInstallments ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading plan...</div>
                                ) : (
                                    <InstallmentPaymentCard
                                        installments={installments}
                                        currency={session.currency}
                                        onPayInstallment={handleNextInstallmentPayment}
                                        loadingInstallmentId={payingInstallmentId}
                                    />
                                )}
                            </div>
                        )}

                        {/* WhatsApp CTA */}
                        {booking && ['PARTIALLY_PAID', 'CONFIRMED'].includes(booking.status) && (
                            <div className={styles.ctaSection}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={handleWhatsAppJoin}
                                    disabled={waLoading}
                                    className={styles.actionButton}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    {waLoading ? 'Fetching Link...' : (
                                        <>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Join WhatsApp Group
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Right: Description (Secondary) */}
                    <div className={styles.descriptionColumn}>
                        <div className={styles.descriptionCard}>
                            <h3 className={styles.cardTitle}>About this Session</h3>
                            <p className={styles.descriptionText}>{session.description}</p>
                        </div>

                        <div className={styles.contactNote}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>
                                Need assistance? Feel free to{' '}
                                <button
                                    onClick={() => setIsContactOpen(true)}
                                    className={styles.contactLink}
                                >
                                    contact us directly
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
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
            />
            <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />


        </Section >
    );
};

export default SessionDetails;


