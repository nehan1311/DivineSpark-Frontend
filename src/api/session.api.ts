import axiosInstance from './axios';
import { SESSION_ENDPOINTS } from './endpoints';
import type { Session, SessionsResponse, SessionFilters } from '../types/session.types';

import { getToken } from '../utils/authStorage';

export const sessionApi = {
    // Helper to build auth headers only when token exists
    _authHeaders: () => {
        const token = getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
    // Ensure token exists, otherwise throw a structured error similar to axios error
    _ensureAuth: () => {
        const token = getToken();
        if (!token) {
            throw { response: { data: { message: 'Authentication required. Please login.' } } };
        }
        return token;
    },
    // Get Upcoming Sessions
    getSessions: async (filters: SessionFilters = {}): Promise<SessionsResponse> => {
        const { page = 0, size = 10, type } = filters;
        const params: any = { page, size };
        if (type) params.type = type;

        const response = await axiosInstance.get<SessionsResponse>(SESSION_ENDPOINTS.BASE, { params });
        return response.data;
    },

    // Get Session Details
    getSession: async (sessionId: string): Promise<Session> => {
        const response = await axiosInstance.get<Session>(`${SESSION_ENDPOINTS.BASE}/${sessionId}`);
        return response.data;
    },

    // Join Free Session
    joinSession: async (sessionId: string): Promise<void> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();
        await axiosInstance.post(`${SESSION_ENDPOINTS.BASE}/${sessionId}/join`, {}, { headers });
    },

    // Pay for Paid Session - Returns Razorpay Order Details
    payForSession: async (sessionId: string): Promise<{ id: string; amount: number; currency: string; key?: string }> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();
        const response = await axiosInstance.post(`${SESSION_ENDPOINTS.BASE}/${sessionId}/pay`, {}, { headers });
        console.log('Backend Pay Response:', response.data);

        return {
            id: response.data.orderId,
            amount: response.data.amount * 100,
            currency: response.data.currency
        };
    },

    // Verify Payment
    verifyPayment: async (paymentData: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
        sessionId: string; // passing sessionId if needed by backend URL
    }): Promise<void> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();
        await axiosInstance.post(`${SESSION_ENDPOINTS.BASE}/${paymentData.sessionId}/verify`, paymentData, { headers });
    }
};
