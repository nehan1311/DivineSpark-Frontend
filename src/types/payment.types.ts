export interface PaymentInitiateResponse {
    bookingId: number;
    orderId: string;
    amount: number;
    currency: string;
}

export interface PaymentCallbackRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface PaymentCallbackResponse {
    success: boolean;
    message: string;
    bookingId?: number;
}
