
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getSessionDetails,
    getSessionBookings,
    getAdminPayments
} from '../../api/admin.api';
import type {
    AdminInstallmentResponse,
    AdminSession,
    AdminSessionBookingResponse,
    AdminInstallmentItem
} from '../../types/admin.types';
import styles from './SessionPayments.module.css';

import AdminLayout from './AdminLayout';

const SessionPayments: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionData, setSessionData] = useState<AdminSession | null>(null);
    const [payments, setPayments] = useState<AdminInstallmentResponse[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'PARTIALLY_PAID' | 'PENDING'>('ALL');

    useEffect(() => {
        const fetchData = async () => {
            if (!sessionId) return;
            try {
                setLoading(true);

                // Fetch Session, Bookings, and ALL Payments (fallback logic)
                const [sessionRes, bookingsRes, paymentsRes] = await Promise.all([
                    getSessionDetails(sessionId),
                    getSessionBookings(sessionId),
                    getAdminPayments({ size: 1000 }) // Fetch enough to find ours
                ]);

                setSessionData(sessionRes);

                // Filter payments for this session
                const sessionPayments = (paymentsRes.payments || []).filter(p =>
                    p.sessionId === sessionId ||
                    (sessionRes.title && p.sessionTitle === sessionRes.title)
                );

                // Merge Bookings with Payments to create Installment Response structure
                const mergedData: AdminInstallmentResponse[] = bookingsRes.map((booking: AdminSessionBookingResponse) => {
                    // Find payments for this user
                    const userPayments = sessionPayments.filter(p =>
                        p.userEmail === booking.email && p.status === 'SUCCESS'
                    );

                    // Calculate totals
                    // If session has price, use it. If free, 0.
                    const totalAmount = sessionRes.price || 0;
                    const paidAmount = userPayments.reduce((sum, p) => sum + p.amount, 0);
                    const remainingAmount = Math.max(0, totalAmount - paidAmount);

                    // Map payments to installments
                    const installments: AdminInstallmentItem[] = userPayments.map((p, index) => ({
                        installmentNumber: index + 1,
                        amount: p.amount,
                        status: 'PAID',
                        paidAt: p.paidAt
                    }));

                    // If remaining > 0, show pending block
                    if (remainingAmount > 0) {
                        installments.push({
                            installmentNumber: installments.length + 1,
                            amount: remainingAmount,
                            status: 'PENDING' as const,
                            paidAt: null
                        });
                    }

                    return {
                        bookingId: parseInt(booking.id), // converting to number as per type, if booking.id is string number
                        userId: parseInt(booking.userId),
                        username: booking.username,
                        email: booking.email,
                        contactNumber: booking.phoneNumber,
                        bookingStatus: booking.bookingStatus,
                        totalAmount,
                        paidAmount,
                        remainingAmount,
                        installments
                    };
                });

                setPayments(mergedData);
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.message || 'Unable to load payment data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sessionId]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return styles.badgeConfirmed; // Green
            case 'PARTIALLY_PAID': return styles.badgePartiallyPaid; // Yellow/Orange
            case 'PENDING': return styles.badgePending; // Red
            default: return styles.badgeCancelled;
        }
    };

    const filteredPayments = payments.filter(p => {
        if (filter === 'ALL') return true;
        // The backend returns bookingStatus exactly as matched in the select buttons
        return p.bookingStatus === filter;
    });

    // Calculate Summary Stats from the payments data directly
    const stats = {
        totalBookings: payments.length,
        fullyPaid: payments.filter(p => p.bookingStatus === 'CONFIRMED' || p.remainingAmount === 0).length,
        partiallyPaid: payments.filter(p => p.bookingStatus === 'PARTIALLY_PAID').length,
        pending: payments.filter(p => p.bookingStatus === 'PENDING').length,
        expectedRevenue: payments.reduce((acc, curr) => acc + curr.totalAmount, 0),
        totalCollected: payments.reduce((acc, curr) => acc + curr.paidAmount, 0),
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.pageContainer}>
                    <div className={`${styles.header} animate-pulse`}>
                        <div style={{ height: '32px', width: '300px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }}></div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error || !sessionData) {
        return (
            <AdminLayout>
                <div className={styles.errorState}>
                    <div className={styles.emptyStateIcon}>⚠️</div>
                    <p>{error || 'Session not found.'}</p>
                    <button onClick={() => navigate('/admin/sessions')} className={styles.backBtn}>Back to Sessions</button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            <h1 className={styles.title}>Session Payments Overview</h1>
                            <div className={styles.subtitle}>{sessionData.title}</div>
                        </div>
                    </div>
                </header>

                {/* KPI Cards */}
                <div className={styles.summaryGrid}>
                    <div className={`${styles.kpiCard} ${styles.cardTotal}`}>
                        <span className={styles.cardLabel}>Total Bookings</span>
                        <span className={styles.cardValue}>{stats.totalBookings}</span>
                    </div>
                    <div className={`${styles.kpiCard} ${styles.cardFullyPaid}`}>
                        <span className={styles.cardLabel}>Fully Paid</span>
                        <span className={styles.cardValue}>{stats.fullyPaid}</span>
                    </div>
                    <div className={`${styles.kpiCard} ${styles.cardPartiallyPaid}`}>
                        <span className={styles.cardLabel}>Partially Paid</span>
                        <span className={styles.cardValue}>{stats.partiallyPaid}</span>
                    </div>
                    <div className={`${styles.kpiCard} ${styles.cardPending}`}>
                        <span className={styles.cardLabel}>Pending</span>
                        <span className={styles.cardValue}>{stats.pending}</span>
                    </div>
                    <div className={`${styles.kpiCard} ${styles.cardExpected}`}>
                        <span className={styles.cardLabel}>Expected Revenue</span>
                        <span className={styles.cardValue}>{formatCurrency(stats.expectedRevenue)}</span>
                    </div>
                    <div className={`${styles.kpiCard} ${styles.cardCollected}`}>
                        <span className={styles.cardLabel}>Collected Amount</span>
                        <span className={styles.cardValue}>{formatCurrency(stats.totalCollected)}</span>
                    </div>
                </div>

                {/* Filter Controls */}
                <div className={styles.sectionHeader} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle}>User Payment Cards</h2>
                    <div className={styles.filterContainer}>
                        <button className={`${styles.filterBtn} ${filter === 'ALL' ? styles.filterBtnActive : ''}`} onClick={() => setFilter('ALL')}>All</button>
                        <button className={`${styles.filterBtn} ${filter === 'CONFIRMED' ? styles.filterBtnActive : ''}`} onClick={() => setFilter('CONFIRMED')}>Fully Paid</button>
                        <button className={`${styles.filterBtn} ${filter === 'PARTIALLY_PAID' ? styles.filterBtnActive : ''}`} onClick={() => setFilter('PARTIALLY_PAID')}>Partially Paid</button>
                        <button className={`${styles.filterBtn} ${filter === 'PENDING' ? styles.filterBtnActive : ''}`} onClick={() => setFilter('PENDING')}>Pending</button>
                    </div>
                </div>

                {/* User Payment Cards */}
                <div className={styles.cardsContainer}>
                    {filteredPayments.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No bookings found for this category.</p>
                        </div>
                    ) : (
                        filteredPayments.map((p) => (
                            <div key={p.bookingId} className={styles.paymentCard}>
                                {/* Card Header: User Info & Status */}
                                <div className={styles.cardHeader}>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userName}>{p.username}</div>
                                        <div className={styles.userMeta}>
                                            <span>📧 {p.email}</span>
                                            {p.contactNumber && <span>📞 {p.contactNumber}</span>}
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`${styles.badge} ${getStatusBadgeClass(p.bookingStatus)}`}>
                                            {p.bookingStatus.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking & Payment Summary */}
                                <div className={styles.cardSummary}>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>Total Amount</span>
                                        <span className={styles.summaryValue}>{formatCurrency(p.totalAmount)}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>Paid Amount</span>
                                        <span className={styles.summaryValue} style={{ color: '#16a34a' }}>{formatCurrency(p.paidAmount)}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>Remaining</span>
                                        <span className={styles.summaryValue} style={{ color: p.remainingAmount > 0 ? '#ea580c' : '#16a34a' }}>
                                            {formatCurrency(p.remainingAmount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Installment Breakdown Timeline */}
                                <div className={styles.installmentsContainer}>
                                    <h4 className={styles.installmentsTitle}>Payment History</h4>
                                    <div className={styles.timeline}>
                                        {p.installments.map((inst, index) => (
                                            <div key={index} className={`${styles.timelineItem} ${inst.status === 'PAID' ? styles.timelineItemPaid : styles.timelineItemPending}`}>
                                                <div className={styles.timelineContent}>
                                                    <div className={styles.instNumber}>
                                                        {inst.status === 'PAID' ? `Paid #${index + 1}` : `Remaining`}
                                                    </div>
                                                    <div className={styles.instAmount}>{formatCurrency(inst.amount)}</div>
                                                    <div className={styles.instStatus}>
                                                        {inst.status === 'PAID' ? '✔ Paid' : '🔒 Pending'}
                                                    </div>
                                                    {inst.paidAt && <div className={styles.instDate}>{formatDate(inst.paidAt)}</div>}
                                                </div>
                                            </div>
                                        ))}
                                        {p.installments.length === 0 && (
                                            <div className={styles.noInstallments}>No payment records found.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default SessionPayments;
