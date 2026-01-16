// Re-trigger build
import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, Heart, RefreshCw } from 'lucide-react';
import { getAdminDonations, getDonationStats } from '../../api/admin.api';
import type { AdminDonation, DonationStats } from '../../types/admin.types';
import { useToast } from '../../context/ToastContext';
import styles from './Admin.module.css';
import { formatFullDateTime } from '../../utils/format';

// Simple CountUp Hook for animation
const useCountUp = (end: number, duration: number = 1000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const totalSteps = 60;
        const stepTime = duration / totalSteps;
        const increment = end / totalSteps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                clearInterval(timer);
                setCount(end);
            } else {
                setCount(Math.ceil(start));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [end, duration]);

    return count;
};

const MetricCard = ({
    label,
    value,
    icon: Icon,
    prefix = '',
    gradientClass,
    iconColor,
    helperText
}: {
    label: string;
    value: number;
    icon: any;
    prefix?: string;
    gradientClass: string;
    iconColor: string;
    helperText?: string;
}) => {
    const displayValue = useCountUp(value);
    const formattedValue = new Intl.NumberFormat('en-IN').format(displayValue);

    return (
        <div className={`${styles.statCard} ${gradientClass}`}>
            <div className={styles.statHeader}>
                <span className={styles.statLabel}>{label}</span>
                <span className={styles.statIcon} style={{ color: iconColor }}>
                    <Icon size={20} />
                </span>
            </div>
            <div className={styles.statContent}>
                <div className={styles.statValue}>
                    {prefix}{formattedValue}
                </div>
                {value === 0 && helperText && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                        {helperText}
                    </div>
                )}
            </div>
        </div>
    );
};

const DonationsTable: React.FC = () => {
    const { showToast } = useToast();
    const [donations, setDonations] = useState<AdminDonation[]>([]);
    const [stats, setStats] = useState<DonationStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        setIsRefreshing(true);
        if (!stats) setIsLoading(true);

        try {
            const [donationsData, statsData] = await Promise.all([
                getAdminDonations(),
                getDonationStats()
            ]);
            setDonations(donationsData);
            setStats(statsData);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to load donations';
            showToast(msg, 'error');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (amount: number, currency: string = 'INR') =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
        }).format(amount);

    const prepareChartData = (monthlyData: DonationStats['monthlyDonations']) => {
        if (!monthlyData) return [];

        const sorted = [...monthlyData].sort((a, b) =>
            a.year !== b.year ? a.year - b.year : a.month - b.month
        );

        return sorted.map(d => ({
            name: new Date(d.year, d.month - 1).toLocaleString('default', { month: 'short' }) + ' ' + d.year,
            amount: d.amount
        }));
    };

    const SkeletonCard = () => (
        <div className={styles.statCard} style={{ opacity: 0.7 }}>
            <div className={styles.statHeader}>
                <div style={{ height: 16, width: 100, background: '#e2e8f0', borderRadius: 4 }} />
            </div>
            <div style={{ height: 32, width: 140, background: '#e2e8f0', borderRadius: 4, marginTop: '1rem' }} />
        </div>
    );

    return (
        <div className={styles.section} style={{ paddingBottom: '2rem' }}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className={styles.sectionTitle}>Donations Overview</h3>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Track your spiritual community's contributions.
                    </p>
                </div>
                <button onClick={fetchData} className={styles.refreshBtn} disabled={isRefreshing}>
                    <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className={styles.statsGrid} style={{ marginBottom: '2.5rem' }}>
                {isLoading && !stats ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                    </>
                ) : stats ? (
                    <>
                        <MetricCard
                            label="Total Amount Donated"
                            value={stats.totalAmount}
                            icon={Heart}
                            prefix="₹"
                            gradientClass={styles.statCardGradient1}
                            iconColor="#e11d48"
                            helperText="No successful donations yet"
                        />
                        <MetricCard
                            label="Unique Donors"
                            value={stats.totalDonors}
                            icon={Users}
                            gradientClass={styles.statCardGradient2}
                            iconColor="#7c3aed"
                            helperText="Be the first to donate!"
                        />
                    </>
                ) : null}
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Monthly Trends</h4>
            <div style={{ marginBottom: '3rem', height: 300 }}>
                {stats && stats.monthlyDonations.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prepareChartData(stats.monthlyDonations)}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#4ade80" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={styles.chartEmptyState}>
                        <TrendingUp size={24} />
                        <p>No donation activity yet</p>
                    </div>
                )}
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Recent Transactions</h4>
            <div className={styles.tableContainer}>
                {donations.length > 0 ? (
                    <table className={`${styles.table} ${styles.zebraTable}`}>
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
                                    <td>{donation.orderId}</td>
                                    <td>
                                        <div>{donation.userName}</div>
                                        <div>{donation.userEmail}</div>
                                    </td>
                                    <td>{formatCurrency(donation.amount, donation.currency)}</td>
                                    <td>{donation.note || '-'}</td>
                                    <td>{formatFullDateTime(donation.createdAt)}</td>
                                    <td>{donation.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>No donations found.</div>
                )}
            </div>
        </div>
    );
};

export default DonationsTable;
