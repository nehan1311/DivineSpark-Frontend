import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { donationApi } from '../api/donation.api';
import { razorpayService } from '../services/razorpay.service';
import Button from '../components/ui/Button';
import styles from './Donate.module.css';

const Donate: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [amount, setAmount] = useState<number | ''>('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            showToast('Please login to make a donation', 'info');
            navigate('/login');
        }
    }, [isAuthenticated, navigate, showToast]);

    const handleDonate = async () => {
        if (!amount || Number(amount) <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        try {
            setLoading(true);

            const orderData = await donationApi.initiateDonation({
                amount: Number(amount),
                note: note.trim()
            });

            const isLoaded = await razorpayService.loadRazorpay();
            if (!isLoaded) {
                showToast('Razorpay SDK failed to load', 'error');
                setLoading(false);
                return;
            }

            razorpayService.initializePayment(
                {
                    orderId: orderData.orderId,
                    amount: orderData.amount,
                    currency: orderData.currency
                },
                `Donation of ${orderData.currency} ${Number(amount)}`,
                () => {
                    setSuccess(true);
                    showToast('Thank you for your generous donation!', 'success');
                    setLoading(false);
                },
                (errorMsg) => {
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

    return (
        <div className={styles.splitLayout}>
            <div className={styles.meshContainer}></div>
            {/* Left Panel: Info & Inspiration */}
            <div className={styles.leftPanel}>
                <div className={styles.leftContent}>
                    <span className={styles.brandLabel}>DivineSpark Philanthropy</span>
                    <h1 className={styles.title}>Ignite Change,<br />One Spark at a Time.</h1>
                    <p className={styles.missionText}>
                        Your contribution empowers us to bring mindfulness, wellness, and holistic health to communities worldwide.
                        Join us in creating a more conscious and connected world.
                    </p>
                    <blockquote className={styles.quote}>
                        "The best way to find yourself is to lose yourself in the service of others." <br />
                        — Mahatma Gandhi
                    </blockquote>
                </div>
            </div>

            {/* Right Panel: Form or Success State */}
            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    {success ? (
                        <div className={styles.successWrapper}>
                            <div className={styles.successIcon}>🎉</div>
                            <h2 className={styles.successTitle}>Thank You!</h2>
                            <p className={styles.successDesc}>
                                Your generous donation helps us continue our mission. <br />
                                A confirmation receipt has been sent to your email.
                            </p>
                            <div style={{ marginTop: '2rem', width: '100%' }}>
                                <Button size="lg" onClick={() => navigate('/')} fullWidth>
                                    Return Home
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.formHeader}>
                                <h2 className={styles.formTitle}>Make a Contribution</h2>
                                <p className={styles.formSubtitle}>Choose an amount to support our cause.</p>
                            </div>

                            <div className={styles.form}>
                                <div className={styles.field}>
                                    <label htmlFor="amount" className={styles.label}>Donation Amount (INR)</label>
                                    <input
                                        id="amount"
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 1000"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        disabled={loading}
                                        className={styles.input}
                                        autoFocus
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="note" className={styles.label}>Personal Message (Optional)</label>
                                    <textarea
                                        id="note"
                                        rows={3}
                                        placeholder="Share why you're donating..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        disabled={loading}
                                        className={styles.textarea}
                                    />
                                </div>

                                <div className={styles.actions}>
                                    <Button
                                        onClick={handleDonate}
                                        disabled={loading || !amount}
                                        size="lg"
                                        fullWidth
                                    >
                                        {loading ? 'Processing...' : 'Donate Securely'}
                                    </Button>
                                    <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#888' }}>
                                        <span role="img" aria-label="lock">🔒</span> Secured by Razorpay
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Donate;
