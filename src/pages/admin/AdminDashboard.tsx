import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Admin.module.css';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { ConfirmationModal } from '../../components/ui/Modal';
import {
    getDashboardStats,
    getAdminSessions,
    getAdminUsers,
    getRevenueStats,
    cancelSession,
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
}> = ({ sessions, onAction, isLoading }) => {
    const [filter, setFilter] = useState<'Upcoming' | 'Past'>('Upcoming');

    // Simple filter logic
    const filteredSessions = sessions.filter(s => {
        const isPast = new Date(s.startTime).getTime() < Date.now();
        if (filter === 'Upcoming') return !isPast;
        return isPast;
    });

    if (isLoading) {
        return <div className={styles.loadingState}>Loading sessions...</div>;
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Sessions Overview</h3>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${filter === 'Upcoming' ? styles.activeTab : ''}`}
                        onClick={() => setFilter('Upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={`${styles.tabBtn} ${filter === 'Past' ? styles.activeTab : ''}`}
                        onClick={() => setFilter('Past')}
                    >
                        Past
                    </button>
                </div>
            </div>

            {filteredSessions.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Date & Time</th>
                            <th>Seats</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSessions.map(session => (
                            <tr key={session.id}>
                                <td>{session.title}</td>
                                <td>
                                    <span className={`${styles.badge} ${session.type === 'FREE' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                        {session.type}
                                    </span>
                                </td>
                                <td>{new Date(session.startTime).toLocaleString()}</td>
                                <td>{session.currentParticipants}/{session.maxParticipants}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles.badgeNeutral}`}>
                                        {session.status || 'SCHEDULED'}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.actionBtn} onClick={() => onAction('view_session', session)}>View</button>
                                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onAction('cancel_session', session)}>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={styles.emptyState}>No {filter.toLowerCase()} sessions found.</div>
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
    const [isLoading, setIsLoading] = useState(false);

    // Modals state
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);

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
                const [statsData, sessionsData] = await Promise.all([
                    getDashboardStats(),
                    getAdminSessions()
                ]);
                setStats(statsData);
                setSessions(sessionsData);
            } else if (activeView === 'sessions') {
                const data = await getAdminSessions();
                setSessions(data);
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
            // Ensure UI doesn't break by setting defaults where appropriate
            if (activeView === 'dashboard') {
                setStats({ totalSessions: 0, upcomingSessions: 0, totalUsers: 0, totalBookings: 0 });
            }
        } finally {
            setIsLoading(false);
        }
    }, [activeView, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogoutConfirm = () => {
        logout();
        navigate('/admin/login');
        setLogoutModalOpen(false);
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
                        await cancelSession(item.id);
                        showToast(`Session "${item.title}" cancelled.`, 'success');
                        fetchData(); // Refresh data
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    } catch (e) {
                        showToast('Failed to cancel session', 'error');
                    }
                }
            });
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
        else if (action === 'view_session') {
            // Placeholder: could open a modal or navigate to details
            console.log('View session', item);
        }
        else {
            console.log("Action:", action, item);
        }
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
                        {activeView === 'sessions' && <Button>+ Create Session</Button>}
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
                        <SessionsTable sessions={sessions} onAction={handleAction} isLoading={isLoading} />
                    </>
                )}

                {activeView === 'sessions' && (
                    <SessionsTable sessions={sessions} onAction={handleAction} isLoading={isLoading} />
                )}

                {activeView === 'users' && (
                    <UsersTable users={users} onAction={handleAction} isLoading={isLoading} />
                )}

                {activeView === 'payments' && (
                    <PaymentsTable transactions={revenue?.recentTransactions || []} isLoading={isLoading} />
                )}
            </main>

            {/* Modals */}
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
