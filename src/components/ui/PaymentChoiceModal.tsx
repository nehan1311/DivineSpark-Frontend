import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import Button from './Button';
import styles from './PaymentChoiceModal.module.css';
import { formatCurrency } from '../../utils/format';

interface PaymentChoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPayFull: () => void;
    onPayInstallments: () => void;
    loadingFull?: boolean;
    loadingInstallment?: boolean;
    amount?: number;
    currency?: string;
}

export const PaymentChoiceModal: React.FC<PaymentChoiceModalProps> = ({
    isOpen,
    onClose,
    onPayFull,
    onPayInstallments,
    loadingFull = false,
    loadingInstallment = false,
    amount = 0,
    currency = 'INR'
}) => {
    const [step, setStep] = useState<'choice' | 'installment-confirm'>('choice');

    // Reset step when modal closes
    useEffect(() => {
        if (!isOpen) {
            setStep('choice');
        }
    }, [isOpen]);

    const handleInstallmentClick = () => {
        setStep('installment-confirm');
    };

    const installmentAmount = amount ? Math.ceil(amount / 3) : 0; // Assuming rounding up or standard division

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={step === 'choice' ? "Choose Payment Option" : "Installment Plan Breakdown"}
        >
            <div className={styles.container}>
                {step === 'choice' ? (
                    <>
                        <div className={styles.optionWrapper}>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={onPayFull}
                                disabled={loadingFull || loadingInstallment}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {loadingFull ? 'Processing...' : 'Pay Full Amount'}
                            </Button>
                        </div>

                        <div className={styles.optionWrapper}>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleInstallmentClick}
                                disabled={loadingFull || loadingInstallment}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Pay with Installments
                            </Button>

                            <div className={styles.installmentsNote}>
                                ℹ️ You will get immediate access after first installment.
                                Remaining amount can be paid later.
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.installmentConfirmWrapper}>
                        <div className={styles.installmentInfo}>
                            <div className={styles.amountBreakdown}>
                                <span>Total Amount:</span>
                                <strong>{formatCurrency(amount, currency)}</strong>
                            </div>

                            <div className={styles.breakdownBox}>
                                <p>You will pay in 3 installments of</p>
                                <h3>{formatCurrency(installmentAmount, currency)}</h3>
                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>per installment</p>
                            </div>

                            <p className={styles.note}>
                                ⓘ You will be redirected to pay the first installment of <b>{formatCurrency(installmentAmount, currency)}</b> now.
                            </p>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                variant="secondary"
                                onClick={() => setStep('choice')}
                                disabled={loadingInstallment}
                            >
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={onPayInstallments}
                                disabled={loadingInstallment}
                                style={{ justifyContent: 'center' }}
                            >
                                {loadingInstallment ? 'Processing...' : 'Proceed to Pay'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
