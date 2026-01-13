export interface InitiateDonationRequest {
    amount: number;
    note?: string;
}

export interface InitiateDonationResponse {
    orderId: string;
    amount: number;
    currency: string;
    key?: string;
}
