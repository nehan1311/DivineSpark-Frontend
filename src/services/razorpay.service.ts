import type { Session } from '../types/session.types';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const razorpayService = {
    loadRazorpay: (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    },

    initializePayment: (
        order: { id: string; amount: number; currency: string; key?: string },
        session: Session,
        onSuccess: (response: any) => void,
        onError: (error: any) => void
    ) => {
        const RAZORPAY_KEY_ID = 'rzp_test_RwvdN24x3arIw6'; // User provided key

        console.log('Initializing Razorpay with order:', order);

        const options = {
            key: order.key || RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'Divine Spark',
            description: `Payment for ${session.title}`,
            image: '/logo.png', // Optional
            order_id: order.id,
            handler: function (response: any) {
                console.log('Razorpay success:', response);
                onSuccess(response);
            },
            prefill: {
                name: 'User Name', // ideally fetch from user context
                email: 'user@example.com', // ideally fetch from user context
                contact: '9999999999', // ideally fetch from user context
            },
            notes: {
                session_id: session.id,
            },
            theme: {
                color: '#3399cc',
            },
            modal: {
                ondismiss: function () {
                    console.log('Razorpay modal dismissed');
                    onError('Payment cancelled by user');
                }
            }
        };

        try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                console.error('Razorpay payment failed:', response.error);
                onError(response.error);
            });
            rzp.open();
        } catch (err) {
            console.error('Razorpay initialization failed:', err);
            onError('Failed to open payment gateway');
        }
    }
};
