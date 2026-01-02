import React, { useEffect, useState, useRef } from 'react';
import { sessionApi } from '../api/session.api';
import type { Session } from '../types/session.types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import styles from './Sessions.module.css';
import Button from '../components/ui/Button'; // Assuming we can use UI button or style generic ones
import { formatDate, formatCurrency } from '../utils/format';
import { razorpayService } from '../services/razorpay.service';

// Fallback images if session image is missing
const FALLBACK_BG = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1920';

const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0); // Track active slide for animations

    const containerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSessions();
        // Cleanup observer on unmount
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    // Set up IntersectionObserver after sessions load
    useEffect(() => {
        if (sessions.length === 0) return;

        // Disconnect previous
        if (observerRef.current) observerRef.current.disconnect();

        // Initialize new observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setActiveIndex(index);
                    }
                });
            },
            { threshold: 0.6 } // Slide must be 60% visible to be 'active'
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

            if (Array.isArray(data)) {
                setSessions(data);
            } else if (data?.sessions) {
                setSessions(data.sessions);
            } else if (data?.content) {
                setSessions(data.content);
            } else {
                setSessions([]);
            }
        } catch (error) {
            showToast('Failed to load upcoming sessions', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSessionAction = async (session: Session) => {
        if (!isAuthenticated) {
            showToast('Please login to join this session', 'info');
            navigate('/login');
            return;
        }

        try {
            setActionLoading(session.id);
            if (session.type === 'FREE') {
                await sessionApi.joinSession(session.id);
                showToast(`Successfully joined "${session.title}"`, 'success');
                navigate(`/sessions/${session.id}`);
            } else {
                // Load Razorpay script first
                const isLoaded = await razorpayService.loadRazorpay();
                if (!isLoaded) {
                    showToast('Razorpay SDK failed to load. Are you online?', 'error');
                    return;
                }

                // 1. Create Order
                const orderData = await sessionApi.payForSession(session.id);

                // 2. Open Payment Modal
                razorpayService.initializePayment(
                    orderData,
                    session,
                    async (response) => {
                        // 3. Verify Payment
                        try {
                            await sessionApi.verifyPayment({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                sessionId: session.id
                            });
                            showToast(`Payment successful for "${session.title}"`, 'success');
                            navigate(`/sessions/${session.id}`);
                        } catch (err: any) {
                            showToast('Payment verification failed', 'error');
                        }
                    },
                    (errorMsg) => {
                        showToast(errorMsg || 'Payment failed', 'error');
                    }
                );
            }
        } catch (error: any) {
            console.error('List Action Failed:', error);
            const msg = error.response?.data?.message || error.message || 'Action failed. Please try again.';
            showToast(msg, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleNavigation = (index: number) => {
        const slides = containerRef.current?.children;
        if (slides && slides[index]) {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        }
    };

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
        <div className={styles.container} ref={containerRef}>
            {sessions.map((session, index) => {
                const isActive = index === activeIndex;
                const isFree = session.type === 'FREE';
                const isExpired = new Date(session.startTime) < new Date();

                return (
                    <div
                        key={session.id}
                        className={`${styles.slide} ${isActive ? styles.active : ''}`}
                        data-index={index}
                    >
                        {/* Background */}
                        <div className={styles.background}>
                            <img
                                src={session.imageUrl || FALLBACK_BG}
                                alt={session.title}
                                className={styles.bgImage}
                            />
                            <div className={styles.overlay} />
                        </div>

                        {/* Content */}
                        <div className={styles.content}>

                            <h1 className={styles.title}>{session.title}</h1>
                            <p className={styles.description}>{session.description}</p>

                            <div className={styles.meta}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Instructor</span>
                                    <span className={styles.metaValue}>{session.guideName}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Date</span>
                                    <span className={styles.metaValue}>{formatDate(session.startTime)}</span>
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
                                    size="lg"
                                    variant={isFree ? 'outline' : 'primary'}
                                    onClick={() => handleSessionAction(session)}
                                    disabled={actionLoading === session.id || isExpired}
                                    style={{ borderColor: 'white', color: 'white' }}
                                >
                                    {/* Temporarily showing button for testing even if expired */}
                                    {isFree ? 'Join Now' : 'Pay For Session'}
                                </Button>

                                <Button
                                    size="lg"
                                    variant="secondary"
                                    onClick={() => navigate(`/sessions/${session.id}`)}
                                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Navigation Dots */}
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
        </div >
    );
};

export default Sessions;
