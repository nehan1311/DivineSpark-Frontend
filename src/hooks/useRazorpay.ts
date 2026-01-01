import { useState, useCallback } from 'react';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id: string;
    handler: (response: any) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

export const useRazorpay = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    const loadRazorpay = useCallback(() => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                setIsLoaded(true);
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = RAZORPAY_SCRIPT;
            script.onload = () => {
                setIsLoaded(true);
                resolve(true);
            };
            script.onerror = () => {
                setIsLoaded(false);
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }, []);

    const openCheckout = useCallback((options: RazorpayOptions) => {
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    }, []);

    return { loadRazorpay, isLoaded, openCheckout };
};
