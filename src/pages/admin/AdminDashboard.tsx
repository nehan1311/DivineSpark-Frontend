import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Admin.module.css';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ConfirmationModal } from '../../components/ui/Modal';
import SessionModal from './SessionModal';
import {
    getDashboardStats,
    getAdminSessions,
    getPastSessions,
    createSession,
    updateSession,
    cancelSession as cancelSessionApi, // Using alias to avoid conflict
    deleteSession,
    getAdminUsers,
    getRevenueStats,
    blockUser,
    unblockUser
} from '../../api/admin.api';
import type {
    DashboardStats,
    AdminUser,
    RevenueStats,
    AdminSession,
    Transaction
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
                                    <td>{new Date(session.startTime).toLocaleString()}</td>
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
            )}
        </div>
    );
};


const UsersTable: React.FC<{
    users: AdminUser[];
    onAction: (action: string, item: any) => void;
    isLoading: boolean;
}> = ({ users, onAction, isLoading }) => {

    if (isLoading) {
        return <div className={styles.loadingState}>Loading users...</div>;
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>User Management</h3>
            </div>
            {users.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`${styles.badge} ${user.status === 'ACTIVE' ? styles.badgeSuccess : styles.badgeError}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.actionBtn} onClick={() => onAction('view_user', user)}>View</button>
                                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onAction('toggle_block_user', user)}>
                                        {user.status === 'BLOCKED' ? 'Unblock' : 'Block'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={styles.emptyState}>No users found.</div>
            )}
        </div>
    );
};

const PaymentsTable: React.FC<{
    transactions: Transaction[];
    isLoading: boolean;
}> = ({ transactions, isLoading }) => {

    if (isLoading) {
        return <div className={styles.loadingState}>Loading transactions...</div>;
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Recent Transactions</h3>
            </div>
            {transactions && transactions.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(txn => (
                            <tr key={txn.id}>
                                <td style={{ fontFamily: 'monospace' }}>{txn.id}</td>
                                <td>{txn.userEmail}</td>
                                <td>${txn.amount.toFixed(2)}</td>
                                <td>{new Date(txn.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`${styles.badge} ${txn.status === 'PAID' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                        {txn.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={styles.emptyState}>No transactions found.</div>
            )}
        </div>
    );
};

const DashboardWidgets: React.FC<{
    sessions: AdminSession[];
    navigate: (path: string) => void;
    openCreateModal: () => void;
}> = ({ sessions, navigate, openCreateModal }) => {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 1. Today / Next 24h
    const todaySessions = sessions
        .filter(s => {
            if (s.status !== 'UPCOMING') return false;
            const start = new Date(s.startTime);
            return start >= now && start <= next24h;
        })
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
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
            const start = new Date(s.startTime);
            // Starting soon: startTime <= now + 30 minutes
            // We interpret this as "Starts within the next 30 mins" or "Overdue but still upcoming"
            // Condition: start <= now + 30m. (And logically start could be > now, or filtered by API)
            // If start is way in the past, it might be stale, but rule says <= now + 30m.
            const timeDiffMins = (start.getTime() - now.getTime()) / (1000 * 60);

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
                                        {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [revenue, setRevenue] = useState<RevenueStats | null>(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    });

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
    const activeView = ['dashboard', 'sessions', 'users', 'payments'].includes(path) ? path : 'dashboard';

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

                setPagination({
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages
                });
            } else if (activeView === 'users') {
                const data = await getAdminUsers();
                setUsers(data);
            } else if (activeView === 'payments') {
                const data = await getRevenueStats();
                setRevenue(data);
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
                            {activeView === 'users' && 'User Directory'}
                            {activeView === 'payments' && 'Financial Overview'}
                        </h1>
                        <p className={styles.headerSubtitle}>
                            {activeView === 'dashboard' && 'Welcome back to your command center.'}
                            {activeView === 'sessions' && 'Create, edit, and oversee all healing sessions.'}
                            {activeView === 'users' && 'View and manage registered members.'}
                            {activeView === 'payments' && 'Track revenue and transaction history.'}
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
                    <UsersTable users={users} onAction={handleAction} isLoading={isLoading} />
                )}

                {activeView === 'payments' && (
                    <PaymentsTable transactions={revenue?.recentTransactions || []} isLoading={isLoading} />
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
