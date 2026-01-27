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

    return (
        <div className={styles.card}>
            <h4 className={styles.title}>
                Installment Plan ({formatCurrency(totalAmount, currency)})
            </h4>
            <div className={styles.list}>
                {sortedInstallments.map((inst, index) => {
                    const isPaid = inst.status === 'PAID';
                    // Enable if it's pending AND (it's the first one OR the previous one is paid)
                    const prevPaid = index === 0 || sortedInstallments[index - 1].status === 'PAID';
                    // const isPayable = !isPaid && prevPaid; // Unused
                    const isLocked = !isPaid && !prevPaid;

                    return (
                        <div key={inst.id} className={styles.item}>
                            <div className={styles.info}>
                                <span className={styles.number}>Installment {inst.installmentNumber}</span>
                                <span className={styles.amount}>{formatCurrency(inst.amount, currency)}</span>
                            </div>
                            <div className={styles.status}>
                                {isPaid ? (
                                    <span className={styles.paidBadge}>✔ Paid</span>
                                ) : isLocked ? (
                                    <span className={styles.lockedBadge}>🔒 Locked</span>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => onPayInstallment(inst)}
                                        disabled={loadingInstallmentId === inst.id}
                                    >
                                        {loadingInstallmentId === inst.id ? 'Processing...' : 'Pay Now'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
