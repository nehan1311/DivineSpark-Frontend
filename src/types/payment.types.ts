export interface PaymentInitiateResponse {
    bookingId: number;
    orderId: string;
    amount: number;
    currency: string;
}
