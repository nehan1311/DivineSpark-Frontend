import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { getSessionInstallments } from '../../api/admin.api';
import { type UserInstallmentSummary } from '../../types/admin.types';
import { useToast } from '../../context/ToastContext';
import styles from './Admin.module.css';

interface SessionInstallmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: string;
    sessionTitle: string;
}

const SessionInstallmentsModal: React.FC<SessionInstallmentsModalProps> = ({
    isOpen,
    onClose,
    sessionId,
    sessionTitle
}) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserInstallmentSummary[]>([]);
    const [expandedUserId, setExpandedUserId] = useState<string | number | null>(null);

    const toggleExpand = (id: string | number) => {
        setExpandedUserId(prev => prev === id ? null : id);
    };

    useEffect(() => {
        if (isOpen && sessionId) {
            fetchInstallments();
        } else {
            setData([]); // Reset on close
            setExpandedUserId(null);
        }
    }, [isOpen, sessionId]);

    const fetchInstallments = async () => {
        setLoading(true);
        try {
            const response = await getSessionInstallments(sessionId);
            setData(response);
        } catch (error: any) {
            console.error("Failed to fetch installments", error);
            showToast("Failed to fetch installment details", "error");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Installment Breakdown: ${sessionTitle}`}
            maxWidth="900px"
        >
            <div className={styles.modalContent} style={{ maxWidth: '900px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                {loading ? (
                    <div className={styles.loadingState}>Loading installment details...</div>
                ) : data.length === 0 ? (
                    <div className={styles.emptyState}>
                        No users have chosen installments for this session.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {data.map((userStats, index) => {
                            const uniqueId = userStats.bookingId || index;
                            const isExpanded = expandedUserId === uniqueId;

                            return (
                                <div
                                    key={uniqueId}
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                        border: '1px solid #e5e7eb',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: isExpanded ? '1.5rem' : '0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => toggleExpand(uniqueId)}
                                >
                                    {/* 1. User Header & Summary Row */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap',
                                        gap: '2rem',
                                        borderBottom: isExpanded ? '1px solid #f3f4f6' : 'none',
                                        paddingBottom: isExpanded ? '1.5rem' : '0'
                                    }}>
                                        {/* User Details */}
                                        <div style={{ minWidth: '200px' }}>
                                            <div style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 700,
                                                color: 'var(--color-primary)',
                                                marginBottom: '0.25rem',
                                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                                            }}>
                                                {userStats.username}
                                                <span style={{ fontSize: '0.8rem', color: '#9ca3af', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                            </div>
                                            <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.1rem' }}>
                                                {userStats.email}
                                            </div>
                                            {userStats.contactNumber && (
                                                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                                    {userStats.contactNumber}
                                                </div>
                                            )}
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <span className={`${styles.badge} ${userStats.remainingAmount <= 0 ? styles.badgeSuccess : styles.badgeWarning
                                                    }`}>
                                                    {userStats.remainingAmount <= 0 ? 'Fully Paid' : 'Pending Dues'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Payment Summary */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '2rem',
                                            alignItems: 'center',
                                            backgroundColor: '#f9fafb',
                                            padding: '1rem 1.5rem',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>Total</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                                                    {formatCurrency(userStats.totalAmount)}
                                                </div>
                                            </div>
                                            <div style={{ width: '1px', height: '30px', backgroundColor: '#e5e7eb' }}></div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>Paid</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>
                                                    {formatCurrency(userStats.paidAmount)}
                                                </div>
                                            </div>
                                            <div style={{ width: '1px', height: '30px', backgroundColor: '#e5e7eb' }}></div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>Remaining</div>
                                                <div style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: 700,
                                                    color: userStats.remainingAmount > 0 ? '#dc2626' : '#9ca3af'
                                                }}>
                                                    {formatCurrency(userStats.remainingAmount)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Installment Timeline */}
                                    {isExpanded && (
                                        <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
                                            <h4 style={{
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                color: '#374151',
                                                marginBottom: '1rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Installment Timeline
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {userStats.installments.map((inst, i) => (
                                                    <div
                                                        key={inst.installmentId || i}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '1rem',
                                                            backgroundColor: '#fff',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: '8px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <span style={{
                                                                background: '#f3f4f6',
                                                                color: '#4b5563',
                                                                padding: '0.25rem 0.75rem',
                                                                borderRadius: '6px',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 600,
                                                                border: '1px solid #e5e7eb'
                                                            }}>
                                                                #{inst.installmentNumber}
                                                            </span>
                                                            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', fontFamily: 'monospace' }}>
                                                                {formatCurrency(inst.amount)}
                                                            </span>
                                                        </div>

                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                            <div style={{ textAlign: 'right' }}>
                                                                {inst.paidAt ? (
                                                                    <div style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                        <span style={{ fontWeight: 500 }}>Paid on</span>
                                                                        <span>{formatDate(inst.paidAt)}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div style={{ fontSize: '0.85rem', color: '#dc2626', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                                        <span style={{ fontWeight: 500 }}>Due by</span>
                                                                        <span>{inst.dueDate ? formatDate(inst.dueDate) : 'No due date'}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <span className={`${styles.badge} ${inst.status === 'PAID' ? styles.badgeSuccess :
                                                                inst.status === 'OVERDUE' ? styles.badgeError :
                                                                    styles.badgeWarning
                                                                }`} style={{ minWidth: '80px', textAlign: 'center' }}>
                                                                {inst.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className={styles.modalFooter}>
                    <button className={styles.secondaryBtn} onClick={onClose}>Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default SessionInstallmentsModal;
