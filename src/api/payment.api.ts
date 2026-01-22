import axiosInstance from './axios';
import { PAYMENT_ENDPOINTS } from './endpoints';

import type {
    PaymentInitiateResponse,
    PaymentCallbackRequest,
    PaymentCallbackResponse
} from '../types/payment.types';

export const paymentApi = {

    /**
     * Initiate payment for a session
     */
    initiatePayment: async (
        sessionId: number
    ): Promise<PaymentInitiateResponse> => {

        // axiosInstance automatically prefixes /api/v1
        const response = await axiosInstance.post<PaymentInitiateResponse>(
            PAYMENT_ENDPOINTS.INITIATE(sessionId)   // /api/v1/sessions/:id/pay
        );

        return response.data;
    },

    /**
     * Handle payment callback / verification
     */
    handleCallback: async (
        request: PaymentCallbackRequest
    ): Promise<PaymentCallbackResponse> => {

        const response = await axiosInstance.post<PaymentCallbackResponse>(
            PAYMENT_ENDPOINTS.CALLBACK,            // /api/v1/payments/verify
            request
        );

        return response.data;
    }
};
