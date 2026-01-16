import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Admin.module.css';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ConfirmationModal, Modal } from '../../components/ui/Modal';
import SessionModal from './SessionModal';
import DonationsTable from './DonationsTable';
import {
    getDashboardStats,

    getAdminSessions,
    createSession,
    updateSession,
    cancelSession as cancelSessionApi, // Using alias to avoid conflict
    blockUser,
    unblockUser,
    getSessionBookings,
    getAdminPayments
} from '../../api/admin.api';
import { API_BASE_URL } from '../../api/endpoints';
import { getToken } from '../../utils/authStorage';
import { formatFullDateTime, formatTime } from '../../utils/format';
import dayjs from 'dayjs';
import type {
    DashboardStats,
    AdminSession,
    SessionUser,
    AdminSessionBookingResponse,
    AdminPayment
} from '../../types/admin.types';

// --- COMPONENTS ---

const StatCard: React.FC<{ label: string; value: string | number; icon: string }> = ({ label, value, icon }) => (
    <div className={styles.statCard}>
        <div className={styles.statHeader}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statIcon}>{icon}</span>
        </div>
        <div className={styles.statValue}>{value}</div>
    </div>
);

const SessionsTable: React.FC<{
    sessions: AdminSession[];
    onAction: (action: string, item: any) => void;
    isLoading: boolean;
    activeTab: 'Upcoming' | 'Past';
    onTabChange: (tab: 'Upcoming' | 'Past') => void;
}> = ({ sessions, onAction, isLoading, activeTab, onTabChange }) => {
    const { showToast } = useToast();
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');

    const filteredSessions = sessions.filter(s => {
        if (typeFilter === 'ALL') return true;
        return s.type === typeFilter;
    });

    if (isLoading) {
        return <div className={styles.loadingState}>Loading sessions...</div>;
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Sessions Overview</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className={styles.filterSelect}
                    >
                        <option value="ALL">All Types</option>
                        <option value="FREE">Free</option>
                        <option value="PAID">Paid</option>
                    </select>

                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'Upcoming' ? styles.activeTab : ''}`}
                            onClick={() => onTabChange('Upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`${styles.tabBtn} ${activeTab === 'Past' ? styles.activeTab : ''}`}
                            onClick={() => onTabChange('Past')}
                        >
                            Past
                        </button>
                    </div>
                </div>
            </div>

            {filteredSessions.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Date & Time</th>
                            <th>Seats (Avail/Max)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSessions.map(session => {
                            const { availableSeats, maxSeats } = session;
                            const isSeatsValid = typeof availableSeats === 'number' && typeof maxSeats === 'number';
                            // "Finished" means we probably shouldn't edit/cancel lightly, but update is allowed.
                            // The user said "Delete... delete/cancel session".
                            // If status is cancelled, maybe hide cancel button.

                            const isCancelled = session.status === 'CANCELLED';

                            return (
                                <tr key={session.id}>
                                    <td>{session.title}</td>
                                    <td>
                                        <span className={`${styles.badge} ${session.type === 'FREE' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {session.type}
                                        </span>
                                    </td>
                                    <td>{formatFullDateTime(session.startTime)}</td>
                                    <td>
                                        {isSeatsValid ? `${availableSeats} / ${maxSeats}` : '—'}
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                                            {session.status || 'SCHEDULED'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={styles.actionBtn} onClick={() => onAction('edit_session', session)}>Edit</button>
                                        <button
                                            type="button"
                                            className={styles.actionBtn}
                                            onClick={async () => {
                                                const token = getToken();
                                                if (!token) {
                                                    showToast("Authentication error", "error");
                                                    return;
                                                }

                                                try {
                                                    showToast("Download started...", "info");

                                                    const response = await fetch(
                                                        `${API_BASE_URL}/admin/sessions/${session.id}/users/download`,
                                                        {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                            },
                                                        }
                                                    );

                                                    if (!response.ok) {
                                                        throw new Error("Download failed");
                                                    }

                                                    const blob = await response.blob();
                                                    const url = window.URL.createObjectURL(blob);

                                                    const link = document.createElement("a");
                                                    link.href = url;
                                                    link.download = `session_${session.id}_users.csv`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    link.remove();

                                                    window.URL.revokeObjectURL(url);
                                                } catch (err) {
                                                    showToast("Failed to download CSV", "error");
                                                }
                                            }}
                                            disabled={((session.maxSeats || 0) - (session.availableSeats || 0)) <= 0}
                                            style={
                                                ((session.maxSeats || 0) - (session.availableSeats || 0)) <= 0
                                                    ? { opacity: 0.5, cursor: "not-allowed" }
                                                    : {}
                                            }
                                            title="Download CSV"
                                        >
                                            Download CSV
                                        </button>

                                        {!isCancelled && (
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => onAction('cancel_session', session)}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        {/* Optional Delete button if API supports hard delete */}
                                        {/* <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onAction('delete_session', session)}>Delete</button> */}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <div className={styles.emptyState}>No {activeTab.toLowerCase()} sessions found.</div>
            )
            }
        </div >
    );
};


const SessionParticipants: React.FC = () => {
    const { showToast } = useToast();
    const [sessions, setSessions] = useState<AdminSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string>('');
    const [sessionUsers, setSessionUsers] = useState<SessionUser[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch sessions on mount
    useEffect(() => {
        fetchSessions();
    }, []);

    // Fetch users when session is selected
    useEffect(() => {
        if (selectedSessionId) {
            fetchSessionUsers(selectedSessionId);
        } else {
            setSessionUsers([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSessionId]);

    const fetchSessions = async () => {
        setIsLoadingSessions(true);
        setError(null);
        try {
            const response = await getAdminSessions({ page: 0, size: 100 });
            setSessions(response.sessions || []);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to load sessions';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoadingSessions(false);
        }
    };

    const fetchSessionUsers = async (sessionId: string) => {
        setIsLoadingUsers(true);
        setError(null);
        try {
            const bookingsData = await getSessionBookings(sessionId);

            // Map users with booking information
            const usersWithBookings: SessionUser[] = bookingsData.map((booking: AdminSessionBookingResponse) => {
                const selectedSession = sessions.find(s => s.id === sessionId);

                return {
                    id: booking.id,
                    name: booking.username,
                    email: booking.email,
                    bookingType: booking.bookingType || (selectedSession?.type === 'FREE' ? 'FREE' : 'PAID'),
                    bookingStatus: booking.bookingStatus,
                    joinedDate: booking.bookedAt
                };
            });

            setSessionUsers(usersWithBookings);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to load session participants';
            setError(msg);
            showToast(msg, 'error');
            setSessionUsers([]);
        } finally {
            setIsLoadingUsers(false);
        }
    };



    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Session Participants</h3>
            </div>

            {/* Session Selector */}
            {/* Session Card Selector */}
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-body)' }}>Select Session</h4>
            <div className={styles.sessionListContainer}>
                {sessions.map(session => (
                    <div
                        key={session.id}
                        className={`${styles.sessionCard} ${selectedSessionId === session.id ? styles.sessionCardActive : ''}`}
                        onClick={() => setSelectedSessionId(session.id)}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle} title={session.title}>{session.title}</div>
                            <span className={`${styles.badge} ${session.type === 'FREE' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                {session.type}
                            </span>
                        </div>
                        <div className={styles.cardDateTime}>
                            <span>📅</span> {formatFullDateTime(session.startTime)}
                        </div>
                    </div>
                ))}

                {sessions.length === 0 && !isLoadingSessions && (
                    <div className={styles.emptyState} style={{ minWidth: '300px' }}>No sessions available.</div>
                )}
            </div>

            {/* Error State */}
            {error && !isLoadingUsers && (
                <div className={styles.emptyState} style={{ color: '#dc3545' }}>
                    <p>Error: {error}</p>
                    <button
                        onClick={() => selectedSessionId ? fetchSessionUsers(selectedSessionId) : fetchSessions()}
                        className={styles.actionBtn}
                        style={{ marginTop: '1rem' }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading State */}
            {isLoadingUsers && (
                <div className={styles.loadingState}>Loading participants...</div>
            )}

            {/* Users Table */}
            {!isLoadingUsers && !error && selectedSessionId && (
                sessionUsers.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Booking Type</th>
                                <th>Booking Status</th>
                                <th>Joined Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessionUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`${styles.badge} ${user.bookingType === 'FREE' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {user.bookingType}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${user.bookingStatus === 'CONFIRMED' ? styles.badgeSuccess :
                                            user.bookingStatus === 'CANCELLED' ? styles.badgeError :
                                                styles.badgeWarning
                                            }`}>
                                            {user.bookingStatus}
                                        </span>
                                    </td>
                                    <td>{formatFullDateTime(user.joinedDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        No users enrolled for this session.
                    </div>
                )
            )}

            {/* No Session Selected */}
            {!selectedSessionId && !isLoadingUsers && !error && (
                <div className={styles.emptyState}>
                    Please select a session to view participants.
                </div>
            )}
        </div>
    );
};

const PaymentsTable: React.FC = () => {
    const { showToast } = useToast();
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'REFUNDED'>('ALL');
    const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0
    });

    const fetchPayments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getAdminPayments({
                page: pagination.page,
                size: pagination.size,
                status: statusFilter !== 'ALL' ? statusFilter : undefined
            });

            // Handle different possible response structures
            const paymentsList = Array.isArray(response)
                ? response
                : (response.payments || []);

            setPayments(paymentsList);

            // Handle pagination if available
            if (response && typeof response === 'object' && !Array.isArray(response)) {
                setPagination(prev => ({
                    ...prev,
                    totalElements: response.totalElements || paymentsList.length,
                    totalPages: response.totalPages || Math.ceil((response.totalElements || paymentsList.length) / pagination.size)
                }));
            } else {
                setPagination(prev => ({
                    ...prev,
                    totalElements: paymentsList.length,
                    totalPages: 1
                }));
            }
        } catch (err: any) {
            console.error('Error fetching payments:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to load payments';
            setError(msg);
            showToast(msg, 'error');
            setPayments([]);
            setPagination(prev => ({
                ...prev,
                totalElements: 0,
                totalPages: 0
            }));
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, pagination.page, pagination.size, showToast]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return '—';
        return formatFullDateTime(dateString);
    };

    const formatCurrency = (amount: number, currency: string = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const handleRowClick = (payment: AdminPayment) => {
        setSelectedPayment(payment);
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return (
        <>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Payments</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as any);
                                setPagination(prev => ({ ...prev, page: 0 }));
                            }}
                            className={styles.filterSelect}
                        >
                            <option value="ALL">All</option>
                            <option value="SUCCESS">Success</option>
                            <option value="FAILED">Failed</option>
                            <option value="REFUNDED">Refunded</option>
                        </select>
                    </div>
                </div>

                {/* Error State */}
                {error && !isLoading && (
                    <div className={styles.emptyState} style={{ color: '#dc3545' }}>
                        <p>Error: {error}</p>
                        <button
                            onClick={fetchPayments}
                            className={styles.actionBtn}
                            style={{ marginTop: '1rem' }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className={styles.loadingState}>Loading payments...</div>
                )}

                {/* Payments Table */}
                {!isLoading && !error && (
                    payments.length > 0 ? (
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Payment ID / Order ID</th>
                                        <th>User Email</th>
                                        <th>Session Title</th>
                                        <th>Amount</th>
                                        <th>Payment Status</th>
                                        <th>Paid On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.filter(p => statusFilter === 'ALL' || p.status === statusFilter).map(payment => (
                                        <tr
                                            key={payment.id || payment.paymentId}
                                            onClick={() => handleRowClick(payment)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                                {payment.orderId || payment.paymentId || payment.id}
                                            </td>
                                            <td>{payment.userEmail}</td>
                                            <td>{payment.sessionTitle}</td>
                                            <td>{formatCurrency(payment.amount, payment.currency)}</td>
                                            <td>
                                                <span className={`${styles.badge} ${payment.status === 'SUCCESS' ? styles.badgeSuccess :
                                                    payment.status === 'FAILED' ? styles.badgeError :
                                                        styles.badgeWarning
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td>{formatDateTime(payment.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '1.5rem',
                                    paddingTop: '1.5rem',
                                    borderTop: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ color: 'var(--color-text-body)', fontSize: '0.9rem' }}>
                                        Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} payments
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 0}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages - 1}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.emptyState}>No payments found.</div>
                    )
                )}
            </div>

            {/* Payment Details Modal */}
            {selectedPayment && (
                <Modal
                    isOpen={!!selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                    title="Payment Details"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <strong>Payment ID:</strong>
                            <div style={{ fontFamily: 'monospace', marginTop: '0.25rem' }}>{selectedPayment.id}</div>
                        </div>
                        {selectedPayment.orderId && (
                            <div>
                                <strong>Order ID:</strong>
                                <div style={{ fontFamily: 'monospace', marginTop: '0.25rem' }}>{selectedPayment.orderId}</div>
                            </div>
                        )}
                        {selectedPayment.paymentId && (
                            <div>
                                <strong>Payment ID:</strong>
                                <div style={{ fontFamily: 'monospace', marginTop: '0.25rem' }}>{selectedPayment.paymentId}</div>
                            </div>
                        )}
                        <div>
                            <strong>User Email:</strong>
                            <div style={{ marginTop: '0.25rem' }}>{selectedPayment.userEmail}</div>
                        </div>
                        <div>
                            <strong>Session:</strong>
                            <div style={{ marginTop: '0.25rem' }}>{selectedPayment.sessionTitle}</div>
                        </div>
                        <div>
                            <strong>Amount:</strong>
                            <div style={{ marginTop: '0.25rem' }}>{formatCurrency(selectedPayment.amount, selectedPayment.currency)}</div>
                        </div>
                        <div>
                            <strong>Status:</strong>
                            <div style={{ marginTop: '0.25rem' }}>
                                <span className={`${styles.badge} ${selectedPayment.status === 'SUCCESS' ? styles.badgeSuccess :
                                    selectedPayment.status === 'FAILED' ? styles.badgeError :
                                        styles.badgeWarning
                                    }`}>
                                    {selectedPayment.status}
                                </span>
                            </div>
                        </div>
                        <div>
                            <strong>Paid On:</strong>
                            <div style={{ marginTop: '0.25rem' }}>{formatDateTime(selectedPayment.createdAt)}</div>
                        </div>
                        {selectedPayment.razorpayOrderId && (
                            <div>
                                <strong>Razorpay Order ID:</strong>
                                <div style={{ fontFamily: 'monospace', marginTop: '0.25rem' }}>{selectedPayment.razorpayOrderId}</div>
                            </div>
                        )}
                        {selectedPayment.razorpayPaymentId && (
                            <div>
                                <strong>Razorpay Payment ID:</strong>
                                <div style={{ fontFamily: 'monospace', marginTop: '0.25rem' }}>{selectedPayment.razorpayPaymentId}</div>
                            </div>
                        )}

                        {selectedPayment.updatedAt && (
                            <div>
                                <strong>Updated At:</strong>
                                <div style={{ marginTop: '0.25rem' }}>{formatDateTime(selectedPayment.updatedAt)}</div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
};

const DashboardWidgets: React.FC<{
    sessions: AdminSession[];
    navigate: (path: string) => void;
    openCreateModal: () => void;
}> = ({ sessions, navigate, openCreateModal }) => {
    const now = dayjs();
    const next24h = now.add(24, 'hour');

    // 1. Today / Next 24h
    const todaySessions = sessions
        .filter(s => {
            if (s.status !== 'UPCOMING') return false;
            const start = dayjs(s.startTime);
            return (start.isSame(now) || start.isAfter(now)) && (start.isSame(next24h) || start.isBefore(next24h));
        })
        .sort((a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf())
        .slice(0, 3);

    // 2. Alerts
    // Buckets for prioritization: Cancelled > Starting Soon > Low Seats
    const cancelledAlerts: { id: string; type: 'urgent' | 'warning' | 'info'; message: string }[] = [];
    const soonAlerts: { id: string; type: 'urgent' | 'warning' | 'info'; message: string }[] = [];
    const seatsAlerts: { id: string; type: 'urgent' | 'warning' | 'info'; message: string }[] = [];

    sessions.forEach(s => {
        if (s.status === 'CANCELLED') {
            cancelledAlerts.push({
                id: `${s.id}-cancelled`,
                type: 'urgent',
                message: `Session "${s.title}" is CANCELLED.`
            });
        } else if (s.status === 'UPCOMING') {
            const start = dayjs(s.startTime);
            // Starting soon: startTime <= now + 30 minutes
            const timeDiffMins = start.diff(now, 'minute');

            if (timeDiffMins <= 30) {
                // For display nicety: if diff is negative, it started X mins ago. If positive, starts in X mins.
                const timeMsg = timeDiffMins < 0
                    ? `started ${Math.abs(Math.round(timeDiffMins))} mins ago`
                    : `starts in ${Math.round(timeDiffMins)} mins`;

                soonAlerts.push({
                    id: `${s.id}-soon`,
                    type: 'urgent',
                    message: `Session "${s.title}" ${timeMsg}.`
                });
            }

            // Low seats: availableSeats <= 5
            if (typeof s.availableSeats === 'number' && s.availableSeats <= 5) {
                seatsAlerts.push({
                    id: `${s.id}-seats`,
                    type: 'warning',
                    message: `Low seats (${s.availableSeats}) for "${s.title}".`
                });
            }
        }
    });

    const alerts = [...cancelledAlerts, ...soonAlerts, ...seatsAlerts];

    return (
        <>
            {/* Quick Actions Bar */}
            <div className={styles.quickActionsSection}>
                <div className={styles.quickActionsTitle}>
                    <span>🚀</span> Quick Actions
                </div>
                <div className={styles.quickActionsBar}>
                    <button className={styles.actionCardBtn} onClick={openCreateModal}>
                        <span>➕</span> Create Session
                    </button>
                    <button className={styles.actionCardBtn} onClick={() => navigate('/admin/sessions')}>
                        <span>🧘</span> Manage Sessions
                    </button>
                    <button className={styles.actionCardBtn} onClick={() => navigate('/admin/users')}>
                        <span>👥</span> View Users
                    </button>
                    <button className={styles.actionCardBtn} onClick={() => navigate('/admin/payments')}>
                        <span>💳</span> View Payments
                    </button>
                </div>
            </div>

            <div className={styles.dashboardWidgetsGrid}>
                {/* Today's Sessions */}
                <div className={styles.widgetCard}>
                    <div className={styles.widgetTitle}>
                        <span>📅</span> Today / Next 24h
                    </div>
                    <div className={styles.widgetContent}>
                        {todaySessions.length > 0 ? (
                            todaySessions.map(s => (
                                <div key={s.id} className={styles.sessionItem}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 500 }}>{s.title}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{s.guideName}</span>
                                    </div>
                                    <span className={styles.sessionTime}>
                                        {formatTime(s.startTime)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
                                No sessions in the next 24 hours.
                            </div>
                        )}
                    </div>
                </div>

                {/* Alerts */}
                <div className={styles.widgetCard}>
                    <div className={styles.widgetTitle}>
                        <span>⚠️</span> Session Alerts
                    </div>
                    <div className={styles.widgetContent} style={{ overflowY: 'auto', maxHeight: '200px' }}>
                        {alerts.length > 0 ? (
                            alerts.map(alert => (
                                <div key={alert.id} className={`${styles.alertItem} ${alert.type === 'urgent' ? styles.urgent : ''}`}>
                                    <span className={styles.alertIcon}>{alert.type === 'urgent' ? '🔴' : '🟠'}</span>
                                    <div>{alert.message}</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
                                No active alerts.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

// --- MAIN PAGE ---

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Data State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [sessions, setSessions] = useState<AdminSession[]>([]);

    // UI State
    const [sessionTab, setSessionTab] = useState<'Upcoming' | 'Past'>('Upcoming');
    const [isLoading, setIsLoading] = useState(false);

    // Modals state
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

    const [sessionModalOpen, setSessionModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<AdminSession | null>(null);

    // Generic confirmation state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        variant: 'primary' | 'danger';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        variant: 'primary',
        onConfirm: () => { },
    });

    // Determine active view based on path
    const path = location.pathname.split('/').pop() || 'dashboard';
    const activeView = ['dashboard', 'sessions', 'users', 'payments', 'donations'].includes(path) ? path : 'dashboard';


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeView === 'dashboard') {
                const [statsData, sessionsResponse] = await Promise.all([
                    getDashboardStats(),
                    getAdminSessions({ size: 100 })
                ]);
                setStats(statsData);
                setSessions(sessionsResponse.sessions || []);
            } else if (activeView === 'sessions') {
                // Fetch All Sessions and filter client-side to strictly enforce tab rules
                // This ensures Cancelled/Completed appear ONLY in Past, and Upcoming ONLY in Upcoming.
                const response = await getAdminSessions({ size: 100 }); // Fetching a larger batch to facilitate client filtering
                const allSessions = response.sessions || [];

                if (sessionTab === 'Upcoming') {
                    setSessions(allSessions.filter(s => s.status === 'UPCOMING' || !s.status));
                } else {
                    // Past Tab: Completed or Cancelled
                    setSessions(allSessions.filter(s => s.status === 'COMPLETED' || s.status === 'CANCELLED'));
                }

            } else if (activeView === 'users') {
                // Session participants are now fetched by the SessionParticipants component
                // No need to fetch here
            } else if (activeView === 'payments') {
                // Payments are now fetched by the PaymentsTable component
                // No need to fetch here
            } else if (activeView === 'donations') {
                // Donations are fetched by DonationsTable
            }
        } catch (error) {

            console.error(error);
            showToast('Failed to fetch admin data', 'error');
            if (activeView === 'dashboard') {
                setStats({ totalSessions: 0, upcomingSessions: 0, totalUsers: 0, totalBookings: 0 });
            }
        } finally {
            setIsLoading(false);
        }
    }, [activeView, sessionTab, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogoutConfirm = () => {
        logout();
        navigate('/admin/login');
        setLogoutModalOpen(false);
    };

    const handleSaveSession = async (sessionData: Partial<AdminSession>) => {
        try {
            if (editingSession) {
                await updateSession(editingSession.id, sessionData);
                showToast('Session updated successfully', 'success');
            } else {
                await createSession(sessionData);
                showToast('Session created successfully', 'success');
            }
            fetchData();
            setSessionModalOpen(false);
            setEditingSession(null);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to save session';
            showToast(msg, 'error');
            throw error;
        }
    };

    const handleAction = (action: string, item: any) => {
        if (action === 'cancel_session') {
            setConfirmModal({
                isOpen: true,
                title: 'Cancel Session',
                message: `Are you sure you want to cancel "${item.title}"? This action cannot be undone.`,
                variant: 'danger',
                onConfirm: async () => {
                    try {
                        await cancelSessionApi(item.id);
                        showToast(`Session "${item.title}" cancelled.`, 'success');
                        fetchData();
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    } catch (e) {
                        showToast('Failed to cancel session', 'error');
                    }
                }
            });
        }
        else if (action === 'edit_session') {
            setEditingSession(item);
            setSessionModalOpen(true);
        }
        else if (action === 'toggle_block_user') {
            const isBlocking = item.status !== 'BLOCKED';
            setConfirmModal({
                isOpen: true,
                title: isBlocking ? 'Block User' : 'Unblock User',
                message: isBlocking
                    ? `Are you sure you want to block ${item.name}? They will no longer be able to login.`
                    : `Unblock ${item.name}? They will regain access to the platform.`,
                variant: isBlocking ? 'danger' : 'primary',
                onConfirm: async () => {
                    try {
                        if (isBlocking) await blockUser(item.id);
                        else await unblockUser(item.id);

                        showToast(`${item.name} has been ${isBlocking ? 'blocked' : 'unblocked'}.`, 'success');
                        fetchData(); // Refresh data
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    } catch (e) {
                        showToast(`Failed to ${isBlocking ? 'block' : 'unblock'} user`, 'error');
                    }
                }
            });
        }
    };

    const openCreateModal = () => {
        setEditingSession(null);
        setSessionModalOpen(true);
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { label: 'Sessions', path: '/admin/sessions', icon: '🧘' },
        { label: 'Users', path: '/admin/users', icon: '👥' },
        { label: 'Payments', path: '/admin/payments', icon: '💳' },
        { label: 'Donations', path: '/admin/donations', icon: '❤️' },
    ];


    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>DivineSpark Admin</div>
                <nav className={styles.nav}>
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`${styles.navLink} ${location.pathname.includes(item.path) ? styles.activeLink : ''}`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className={styles.userProfile}>
                    <div className={styles.avatar}>AD</div>
                    <div className={styles.userInfo}>
                        <div style={{ fontWeight: 600 }}>Admin User</div>
                        <div className={styles.userEmail}>admin@divinespark.com</div>
                    </div>
                    <button onClick={() => setLogoutModalOpen(true)} className={styles.logoutBtn} title="Sign Out">
                        ⏻
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <h1>
                            {activeView === 'dashboard' && 'Dashboard Overview'}
                            {activeView === 'sessions' && 'Manage Sessions'}
                            {activeView === 'users' && 'Session Participants'}
                            {activeView === 'payments' && 'Financial Overview'}
                            {activeView === 'donations' && 'Donations Overview'}
                        </h1>

                        <p className={styles.headerSubtitle}>
                            {activeView === 'dashboard' && 'Welcome back to your command center.'}
                            {activeView === 'sessions' && 'Create, edit, and oversee all healing sessions.'}
                            {activeView === 'users' && 'View participants enrolled in each session.'}
                            {activeView === 'payments' && 'Track revenue and transaction history.'}
                            {activeView === 'donations' && 'Track all donations and donor details.'}
                        </p>

                    </div>
                    <div className={styles.headerActions}>
                        {activeView === 'sessions' && (
                            <Button onClick={openCreateModal}>+ Create Session</Button>
                        )}
                    </div>
                </header>

                {activeView === 'dashboard' && (
                    <>
                        <div className={styles.statsGrid}>
                            {stats ? (
                                <>
                                    <StatCard label="Total Sessions" value={stats.totalSessions} icon="🧘‍♀️" />
                                    <StatCard label="Upcoming Sessions" value={stats.upcomingSessions} icon="📅" />
                                    <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
                                    <StatCard label="Total Bookings" value={stats.totalBookings} icon="🎟️" />
                                </>
                            ) : (
                                <div>Loading stats...</div>
                            )}
                        </div>

                        <DashboardWidgets
                            sessions={sessions}
                            navigate={navigate}
                            openCreateModal={openCreateModal}
                        />
                    </>
                )}

                {activeView === 'sessions' && (
                    <SessionsTable
                        sessions={sessions}
                        onAction={handleAction}
                        isLoading={isLoading}
                        activeTab={sessionTab}
                        onTabChange={setSessionTab}
                    />
                )}

                {activeView === 'users' && (
                    <SessionParticipants />
                )}

                {activeView === 'payments' && (
                    <PaymentsTable />
                )}

                {activeView === 'donations' && (
                    <DonationsTable />
                )}
            </main>


            {/* Modals */}
            <SessionModal
                isOpen={sessionModalOpen}
                onClose={() => setSessionModalOpen(false)}
                onSave={handleSaveSession}
                session={editingSession}
            />

            <ConfirmationModal
                isOpen={logoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to end your session?"
                confirmText="Sign Out"
                variant="danger"
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />
        </div>
    );
};

export default AdminDashboard;
