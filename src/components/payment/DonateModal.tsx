import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { donationApi } from '../../api/donation.api';
import { razorpayService } from '../../services/razorpay.service';
import { useToast } from '../../context/ToastContext';
import styles from './DonateModal.module.css';

interface DonateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
    const { showToast } = useToast();
    const [amount, setAmount] = useState<number | ''>('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDonate = async () => {
        if (!amount || Number(amount) <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        try {
            setLoading(true);

            // 1. Initiate Donation
            const orderData = await donationApi.initiateDonation({
                amount: Number(amount),
                note: note.trim()
            });

            // 2. Load Razorpay
            const isLoaded = await razorpayService.loadRazorpay();
            if (!isLoaded) {
                showToast('Razorpay SDK failed to load', 'error');
                setLoading(false);
                return;
            }

            // 3. Open Checkout
            razorpayService.initializePayment(
                {
                    orderId: orderData.orderId,
                    amount: orderData.amount,
                    currency: orderData.currency
                },
                `Donation of ${orderData.currency} ${Number(amount)}`,
                () => {
                    // Success Callback
                    setSuccess(true);
                    showToast('Thank you for your generous donation!', 'success');
                    setLoading(false);
                },
                (errorMsg) => {
                    // Error Callback
                    console.error(errorMsg);
                    showToast(errorMsg || 'Payment cancelled or failed', 'error');
                    setLoading(false);
                }
            );

        } catch (error: any) {
            console.error('Donation failed:', error);
            const msg = error.response?.data?.message || 'Failed to initiate donation';
            showToast(msg, 'error');
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setAmount('');
        setNote('');
        setSuccess(false);
        setLoading(false);
        onClose();
    };

    if (success) {
        return (
            <Modal isOpen={isOpen} onClose={resetAndClose} title="Thank You!">
                <div className={styles.successContainer}>
                    <div className={styles.successIcon}>🎉</div>
                    <h3>Donation Successful!</h3>
                    <p>Your contribution means a lot to us.</p>
                    <p>A confirmation has been sent to your email.</p>
                    <div className={styles.actions}>
                        <Button onClick={resetAndClose} fullWidth>Close</Button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={resetAndClose} title="Make a Donation">
            <div className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="amount">Amount (INR)</label>
                    <input
                        id="amount"
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        disabled={loading}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="note">Message (Optional)</label>
                    <textarea
                        id="note"
                        rows={3}
                        placeholder="Leave a message..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={loading}
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.footer}>
                    <Button variant="secondary" onClick={resetAndClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleDonate} disabled={loading || !amount}>
                        {loading ? 'Processing...' : 'Donate Now'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DonateModal;
