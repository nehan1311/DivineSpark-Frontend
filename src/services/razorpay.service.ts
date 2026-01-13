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
        order: {
            orderId: string;
            amount: number;
            currency: string;
        },
        details: Session | string,
        onSuccess: (response: any) => void,
        onError: (error: any) => void
    ) => {
        const description = typeof details === 'string'
            ? details
            : `Payment for ${details.title}`;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            order_id: order.orderId,
            name: 'DivineSpark',
            description: description,
            handler: onSuccess,
            modal: {
                ondismiss: () => onError('Payment cancelled')
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }


};
