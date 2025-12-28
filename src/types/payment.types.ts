export interface PaymentInitiateResponse {
    razorpayKey: string;
    orderId: string;
    amount: number;
    currency: string;
    sessionId: string;
    bookingId: string;
}
