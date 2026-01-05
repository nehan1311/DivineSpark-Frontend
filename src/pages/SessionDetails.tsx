import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionId) {
            fetchSession(sessionId);
        }
    }, [sessionId]);

    const fetchSession = async (id: string) => {
        try {
            setLoading(true);
            const data = await sessionApi.getSession(id);
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

        if (!isAuthenticated) {
            showToast('Please login to continue', 'info');
            navigate('/login');
            return;
        }

        try {
            setActionLoading(true);

            if (session.type === 'FREE') {
                await sessionApi.joinSession(session.id);
                showToast(`Successfully joined "${session.title}"`, 'success');
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

                    // Webhook will confirm booking
                    navigate('/sessions');
                },
                (errorMsg) => {
                    showToast(errorMsg || 'Payment failed', 'error');
                }
            );

        } catch (error: any) {
            console.error('Payment Action Failed:', error);
            const msg =
                error.response?.data?.message ||
                error.message ||
                'Action failed. Please try again.';
            showToast(msg, 'error');
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
        <Section className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{session.title}</h1>
                <p className={styles.instructor}>with {session.guideName}</p>
            </div>

            <div className={styles.meta}>
                <div className={styles.metaItem}>
                    <span className={styles.label}>Date & Time</span>
                    <span className={styles.value}>{formatDate(session.startTime)}</span>
                </div>
                <div className={styles.metaItem}>
                    <span className={styles.label}>Duration</span>
                    <span className={styles.value}>{getDuration(session.startTime, session.endTime)}</span>
                </div>
                <div className={styles.metaItem}>
                    <span className={styles.label}>Type</span>
                    <span className={styles.value}>{session.type}</span>
                </div>
            </div>

            <div className={styles.description}>
                {session.description}
            </div>

            <div className={styles.actionArea}>
                <div className={styles.price}>
                    {formatCurrency(session.price, session.currency)}
                </div>
                <Button
                    size="lg"
                    variant="primary"
                    onClick={handleAction}
                    disabled={actionLoading || isExpired}
                >
                    {/* Temporarily showing button for testing even if expired */}
                    {isFree ? 'Join Free' : 'Pay For Session'}
                </Button>
            </div>
        </Section >
    );
};

export default SessionDetails;


