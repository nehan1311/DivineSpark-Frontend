import React from 'react';
import type { Installment } from '../../types/session.types';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/format';
import styles from './InstallmentPaymentCard.module.css';

interface InstallmentPaymentCardProps {
    installments: Installment[];
    currency?: string;
    onPayInstallment: (installment: Installment) => void;
    loadingInstallmentId?: number | null;
}

export const InstallmentPaymentCard: React.FC<InstallmentPaymentCardProps> = ({
    installments,
    currency = 'INR',
    onPayInstallment,
    loadingInstallmentId
}) => {
    // Sort installments just in case
    const sortedInstallments = [...installments].sort((a, b) => a.installmentNumber - b.installmentNumber);

    // Calculate total amount
    const totalAmount = sortedInstallments.reduce((sum, inst) => sum + inst.amount, 0);
    const paidAmount = sortedInstallments.filter(i => i.status === 'PAID').reduce((sum, inst) => sum + inst.amount, 0);
    const remainingAmount = totalAmount - paidAmount;

    // Find the index of the first pending installment
    const nextPayableIndex = sortedInstallments.findIndex(i => i.status === 'PENDING');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={styles.container}>
            {/* Summary Section */}
            <div className={styles.summarySection}>
                <h4 className={styles.summaryTitle}>Payment Plan</h4>
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Total Amount</span>
                        <span className={styles.summaryValue}>{formatCurrency(totalAmount, currency)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Paid</span>
                        <span className={styles.summaryValuePaid}>{formatCurrency(paidAmount, currency)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Remaining</span>
                        <span className={styles.summaryValueRemaining}>{formatCurrency(remainingAmount, currency)}</span>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className={styles.timelineSection}>
                <h5 className={styles.timelineTitle}>Installment Timeline</h5>
                <div className={styles.timeline}>
                    {sortedInstallments.map((inst, index) => {
                        const isPaid = inst.status === 'PAID';
                        const isNextPayable = !isPaid && (index === nextPayableIndex);
                        const isLocked = !isPaid && !isNextPayable;

                        return (
                            <div
                                key={inst.id}
                                className={`${styles.timelineItem} ${isPaid ? styles.paid : ''} ${isNextPayable ? styles.active : ''} ${isLocked ? styles.locked : ''}`}
                            >
                                {/* Timeline connector */}
                                {index < sortedInstallments.length - 1 && (
                                    <div className={styles.timelineConnector}></div>
                                )}

                                {/* Timeline dot */}
                                <div className={styles.timelineDot}>
                                    {isPaid && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    )}
                                    {isLocked && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    )}
                                </div>

                                {/* Content */}
                                <div className={styles.timelineContent}>
                                    <div className={styles.installmentHeader}>
                                        <div className={styles.installmentInfo}>
                                            <span className={styles.installmentNumber}>Installment {inst.installmentNumber}</span>
                                            <span className={styles.installmentAmount}>{formatCurrency(inst.amount, currency)}</span>
                                        </div>
                                        {inst.dueDate && (
                                            <span className={styles.dueDate}>
                                                Due: {formatDate(inst.dueDate)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <div className={styles.installmentAction}>
                                        {isPaid ? (
                                            <span className={styles.statusBadgePaid}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                Paid
                                            </span>
                                        ) : isNextPayable ? (
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => onPayInstallment(inst)}
                                                disabled={loadingInstallmentId === inst.id}
                                                style={{ width: '100%' }}
                                            >
                                                {loadingInstallmentId === inst.id ? 'Processing...' : 'Pay Now'}
                                            </Button>
                                        ) : (
                                            <span className={styles.statusBadgeLocked}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                    <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                </svg>
                                                Locked
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
