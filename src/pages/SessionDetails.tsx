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
            } else {
                await sessionApi.payForSession(session.id);
                showToast(`Payment successful for "${session.title}"`, 'success');
            }
            // Optionally refresh session or user state?
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Action failed. Please try again.';
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
                <p className={styles.instructor}>with {session.instructorName}</p>
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
                    {isExpired ? 'Session Expired' : (isFree ? 'Join Free' : 'Book Now')}
                </Button>
            </div>
        </Section>
    );
};

export default SessionDetails;
