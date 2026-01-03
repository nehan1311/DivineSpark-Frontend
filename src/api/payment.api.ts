import axiosInstance from './axios';
import { PAYMENT_ENDPOINTS } from './endpoints';
import { getToken } from '../utils/authStorage';
import type { PaymentInitiateRequest, PaymentInitiateResponse, PaymentCallbackRequest, PaymentCallbackResponse } from '../types/payment.types';

export const paymentApi = {
    // Initiate payment - creates Razorpay order
    initiatePayment: async (request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
        const token = getToken();
        if (!token) {
            throw new Error('Authentication token is required');
        }

        const response = await axiosInstance.post<PaymentInitiateResponse>(
            PAYMENT_ENDPOINTS.INITIATE,
            request,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    },

    // Handle Razorpay callback
    handleCallback: async (request: PaymentCallbackRequest): Promise<PaymentCallbackResponse> => {
        const token = getToken();
        if (!token) {
            throw new Error('Authentication token is required');
        }

        const response = await axiosInstance.post<PaymentCallbackResponse>(
            PAYMENT_ENDPOINTS.CALLBACK,
            request,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    },
};

