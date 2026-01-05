import axiosInstance from './axios';
import { PAYMENT_ENDPOINTS } from './endpoints';
import type {
    PaymentInitiateResponse,
    PaymentCallbackRequest,
    PaymentCallbackResponse
} from '../types/payment.types';

export const paymentApi = {

    initiatePayment: async (
        sessionId: number
    ): Promise<PaymentInitiateResponse> => {

        const response = await axiosInstance.post<PaymentInitiateResponse>(
            PAYMENT_ENDPOINTS.INITIATE(sessionId)
        );

        return response.data;
    },

    handleCallback: async (
        request: PaymentCallbackRequest
    ): Promise<PaymentCallbackResponse> => {

        const response = await axiosInstance.post<PaymentCallbackResponse>(
            PAYMENT_ENDPOINTS.CALLBACK,
            request
        );

        return response.data;
    }
};
