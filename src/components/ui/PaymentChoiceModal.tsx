import React from 'react';
import { Modal } from './Modal';
import Button from './Button';
import styles from './PaymentChoiceModal.module.css';

interface PaymentChoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPayFull: () => void;
    onPayInstallments: () => void;
    loadingFull?: boolean;
    loadingInstallment?: boolean;
}

export const PaymentChoiceModal: React.FC<PaymentChoiceModalProps> = ({
    isOpen,
    onClose,
    onPayFull,
    onPayInstallments,
    loadingFull = false,
    loadingInstallment = false
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Choose Payment Option"
        >
            <div className={styles.container}>
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
                        onClick={onPayInstallments}
                        disabled={loadingFull || loadingInstallment}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {loadingInstallment ? 'Processing...' : 'Pay with Installments'}
                    </Button>

                    <div className={styles.installmentsNote}>
                        ℹ️ You will get immediate access after first installment.
                        Remaining amount can be paid later.
                    </div>
                </div>
            </div>
        </Modal>
    );
};
