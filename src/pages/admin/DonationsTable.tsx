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

// Simple CountUp Hook for animation
const useCountUp = (end: number, duration: number = 1000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const totalSteps = 60; // 60fps
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
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = async () => {
        setIsRefreshing(true);
        // If not already loading (initial load), keep old data visible while refreshing
        if (!stats) setIsLoading(true);

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
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (amount: number, currency: string = 'INR') => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const prepareChartData = (monthlyData: DonationStats['monthlyDonations']) => {
        if (!monthlyData) return [];

        // Sort chronologically
        const sorted = [...monthlyData].sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });

        // Format for chart
        return sorted.map(d => ({
            name: new Date(d.year, d.month - 1).toLocaleString('default', { month: 'short' }) + ' ' + d.year,
            amount: d.amount
        }));
    };

    const SkeletonCard = () => (
        <div className={styles.statCard} style={{ opacity: 0.7 }}>
            <div className={styles.statHeader}>
                <div style={{ height: '16px', width: '100px', background: '#e2e8f0', borderRadius: '4px' }} />
            </div>
            <div style={{ height: '32px', width: '140px', background: '#e2e8f0', borderRadius: '4px', marginTop: '1rem' }} />
        </div>
    );

    return (
        <div className={styles.section} style={{ paddingBottom: '2rem' }}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className={styles.sectionTitle}>Donations Overview</h3>
                    <p style={{ color: 'var(--color-text-body)', opacity: 0.7, fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Track your spiritual community's contributions.
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className={styles.refreshBtn}
                    disabled={isRefreshing}
                >
                    <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Stats Cards */}
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

            {/* Chart Section */}
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Monthly Trends</h4>
            <div style={{ marginBottom: '3rem', height: '300px', width: '100%' }}>
                {isLoading && !stats ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                        Loading chart...
                    </div>
                ) : stats && stats.monthlyDonations.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prepareChartData(stats.monthlyDonations)}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number | undefined) => [`₹${(value ?? 0).toLocaleString()}`, 'Amount']}
                            />
                            <Bar
                                dataKey="amount"
                                fill="#4ade80"
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={styles.chartEmptyState}>
                        <div style={{
                            width: '48px', height: '48px',
                            borderRadius: '50%', background: '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1rem', color: '#94a3b8'
                        }}>
                            <TrendingUp size={24} />
                        </div>
                        <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
                            No donation activity yet
                        </h5>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '300px' }}>
                            Monthly donation trends will appear here once donations are received.
                        </p>
                    </div>
                )}
            </div>

            {/* Error State */}
            {error && !isLoading && (
                <div className={styles.emptyState} style={{ color: '#dc3545', marginBottom: '1rem' }}>
                    <p>Error: {error}</p>
                </div>
            )}

            {/* Table */}
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Recent Transactions</h4>
            <div className={styles.tableContainer} style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {isLoading && !stats ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading transactions...</div>
                ) : donations.length > 0 ? (
                    <table className={`${styles.table} ${styles.zebraTable}`} style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Donor</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                <th style={{ padding: '1rem' }}>Note</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map(donation => (
                                <tr key={donation.id} style={{ transition: 'all 0.2s' }}>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{donation.orderId}</td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: '#334155' }}>{donation.userName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{donation.userEmail}</div>
                                    </td>
                                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(donation.amount, donation.currency)}</td>
                                    <td style={{ maxWidth: '200px' }}>
                                        {donation.note ? (
                                            <span title={donation.note} style={{
                                                display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem'
                                            }}>
                                                "{donation.note}"
                                            </span>
                                        ) : (
                                            <span style={{ color: '#cbd5e1' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.9rem' }}>{formatDate(donation.createdAt)}</td>
                                    <td>
                                        <span className={`${styles.badge} ${donation.status === 'SUCCESS' ? styles.badgeSuccess :
                                            styles.badgeWarning
                                            }`} style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                paddingLeft: '0.5rem', paddingRight: '0.75rem'
                                            }}>
                                            <span style={{
                                                width: '6px', height: '6px', borderRadius: '50%',
                                                backgroundColor: donation.status === 'SUCCESS' ? '#059669' : '#d97706'
                                            }}></span>
                                            {donation.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState} style={{ padding: '4rem 2rem' }}>
                        <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>📭</div>
                        <p style={{ color: '#64748b' }}>No donations found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationsTable;
