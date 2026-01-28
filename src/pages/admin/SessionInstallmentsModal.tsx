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

    useEffect(() => {
        if (isOpen && sessionId) {
            fetchInstallments();
        } else {
            setData([]); // Reset on close
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
            <div className={styles.modalContent} style={{ maxWidth: '900px', width: '100%' }}>
                {loading ? (
                    <div className={styles.loadingState}>Loading installment details...</div>
                ) : data.length === 0 ? (
                    <div className={styles.emptyState}>
                        No users have chosen installments for this session.
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Remaining</th>
                                    <th>Breakdown</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((userStats, index) => (
                                    <tr key={userStats.bookingId || index}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{userStats.username}</div>
                                            <div style={{ fontSize: '0.85em', color: 'var(--color-text-light)' }}>
                                                {userStats.email}
                                            </div>
                                            {userStats.contactNumber && (
                                                <div style={{ fontSize: '0.85em', color: 'var(--color-text-light)' }}>
                                                    {userStats.contactNumber}
                                                </div>
                                            )}
                                        </td>
                                        <td>{formatCurrency(userStats.totalAmount)}</td>
                                        <td style={{ color: 'var(--color-success)' }}>
                                            {formatCurrency(userStats.paidAmount)}
                                        </td>
                                        <td style={{ color: 'var(--color-error)' }}>
                                            {formatCurrency(userStats.remainingAmount)}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {userStats.installments.map((inst, i) => (
                                                    <div
                                                        key={inst.installmentId || i}
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: '40px 100px 90px 1fr',
                                                            alignItems: 'center',
                                                            gap: '0.8rem',
                                                            fontSize: '0.9em',
                                                            padding: '0.35rem 0.5rem',
                                                            background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                                                            borderRadius: '4px',
                                                            borderBottom: '1px solid rgba(0,0,0,0.03)'
                                                        }}
                                                    >
                                                        <span style={{
                                                            background: 'var(--color-surface)',
                                                            padding: '0.1rem 0',
                                                            textAlign: 'center',
                                                            borderRadius: '4px',
                                                            border: '1px solid var(--color-border)',
                                                            fontSize: '0.8em',
                                                            fontWeight: 600,
                                                            color: 'var(--color-text-light)'
                                                        }}>
                                                            #{inst.installmentNumber}
                                                        </span>
                                                        <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                                            {formatCurrency(inst.amount)}
                                                        </span>
                                                        <span className={`${styles.badge} ${inst.status === 'PAID' ? styles.badgeSuccess :
                                                            inst.status === 'OVERDUE' ? styles.badgeError :
                                                                styles.badgeWarning
                                                            }`} style={{ fontSize: '0.75em', padding: '0.15rem 0.5rem', textAlign: 'center' }}>
                                                            {inst.status}
                                                        </span>
                                                        <span style={{ fontSize: '0.8em', color: 'var(--color-text-light)' }}>
                                                            {inst.paidAt ? `Paid: ${formatDate(inst.paidAt)}` : (inst.dueDate ? `Due: ${formatDate(inst.dueDate)}` : '')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
