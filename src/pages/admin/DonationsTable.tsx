import React, { useState, useEffect } from 'react';
import { getAdminDonations, getDonationStats } from '../../api/admin.api';
import type { AdminDonation, DonationStats } from '../../types/admin.types';
import { useToast } from '../../context/ToastContext';
import styles from './Admin.module.css';

const DonationsTable: React.FC = () => {
    const { showToast } = useToast();
    const [donations, setDonations] = useState<AdminDonation[]>([]);
    const [stats, setStats] = useState<DonationStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [donationsData, statsData] = await Promise.all([
                getAdminDonations(),
                getDonationStats()
            ]);
            setDonations(donationsData);
            setStats(statsData);
        } catch (err: any) {
            console.error('Error fetching donations:', err);
            const msg = err.response?.data?.message || 'Failed to load donations';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (amount: number, currency: string = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Donations</h3>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className={styles.statsGrid} style={{ marginBottom: '2rem' }}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statLabel}>Total Donations</span>
                            <span className={styles.statIcon}>❤️</span>
                        </div>
                        <div className={styles.statValue}>{formatCurrency(stats.totalAmount)}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <span className={styles.statLabel}>Total Donors</span>
                            <span className={styles.statIcon}>👥</span>
                        </div>
                        <div className={styles.statValue}>{stats.count}</div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className={styles.emptyState} style={{ color: '#dc3545' }}>
                    <p>Error: {error}</p>
                    <button onClick={fetchData} className={styles.actionBtn} style={{ marginTop: '1rem' }}>
                        Retry
                    </button>
                </div>
            )}

            {/* Loading State */}
            {isLoading && <div className={styles.loadingState}>Loading donations...</div>}

            {/* Table */}
            {!isLoading && !error && (
                donations.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Donor</th>
                                <th>Amount</th>
                                <th>Note</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(donation => (
                                <tr key={donation.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{donation.orderId}</td>
                                    <td>
                                        <div>{donation.userName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{donation.userEmail}</div>
                                    </td>
                                    <td>{formatCurrency(donation.amount, donation.currency)}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={donation.note}>
                                        {donation.note || '-'}
                                    </td>
                                    <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`${styles.badge} ${donation.status === 'SUCCESS' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {donation.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>No donations found.</div>
                )
            )}
        </div>
    );
};

export default DonationsTable;
