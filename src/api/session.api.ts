import axiosInstance from './axios';
import { SESSION_ENDPOINTS, INSTALLMENT_ENDPOINTS } from './endpoints';
import type {
    Session,
    SessionsResponse,
    SessionFilters,
    UserBooking,
    Installment
} from '../types/session.types';

import { getToken } from '../utils/authStorage';

export const sessionApi = {

    /* -------------------- AUTH HELPERS -------------------- */

    _authHeaders: () => {
        const token = getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    _ensureAuth: () => {
        const token = getToken();
        if (!token) {
            throw {
                response: {
                    status: 401,
                    data: { message: 'Authentication required. Please login.' }
                },
                isAxiosError: false
            };
        }
        return token;
    },

    /* -------------------- PUBLIC SESSIONS -------------------- */

    getSessions: async (filters: SessionFilters = {}): Promise<SessionsResponse> => {
        const { page = 0, size = 10, type } = filters;
        const params: any = { page, size };
        if (type) params.type = type;

        const response = await axiosInstance.get<SessionsResponse>(
            SESSION_ENDPOINTS.BASE,   // /api/v1/sessions
            { params }
        );
        return response.data;
    },

    /* -------------------- USER BOOKINGS -------------------- */

    getUserBookings: async (): Promise<UserBooking[]> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        const response = await axiosInstance.get<UserBooking[]>(
            SESSION_ENDPOINTS.MY_BOOKINGS,      // /api/v1/user/bookings
            { headers }
        );
        return response.data;
    },

    /* -------------------- SESSION DETAILS -------------------- */

    getSession: async (sessionId: string): Promise<Session> => {
        const response = await axiosInstance.get<Session>(
            `${SESSION_ENDPOINTS.BASE}/${sessionId}`   // /api/v1/sessions/:id
        );
        return response.data;
    },

    /* -------------------- JOIN SESSION -------------------- */

    joinSession: async (sessionId: string): Promise<void> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        await axiosInstance.post(
            `${SESSION_ENDPOINTS.BASE}/${sessionId}/join`,   // /api/v1/sessions/:id/join
            {},
            { headers }
        );
    },

    /* -------------------- PAYMENT (PAID SESSION) -------------------- */

    payForSession: async (
        sessionId: string
    ): Promise<{ orderId: string; amount: number; currency: string; bookingId: number }> => {

        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        const response = await axiosInstance.post(
            `${SESSION_ENDPOINTS.BASE}/${sessionId}/pay`,     // /api/v1/sessions/:id/pay
            {},
            { headers }
        );

        return {
            orderId: response.data.orderId,
            amount: response.data.amount * 100,     // Razorpay amount conversion
            currency: response.data.currency,
            bookingId: response.data.bookingId
        };
    },

    payForSessionInstallments: async (
        sessionId: string
    ): Promise<{
        bookingId: number;
        installmentId: number;
        razorpayOrderId: string;
        amount: number;
    }> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        const response = await axiosInstance.post(
            `${SESSION_ENDPOINTS.BASE}/${sessionId}/pay/installments`,
            {},
            { headers }
        );

        return {
            bookingId: response.data.bookingId,
            installmentId: response.data.installmentId,
            razorpayOrderId: response.data.razorpayOrderId,
            amount: response.data.amount * 100
        };
    },

    /* -------------------- VERIFY PAYMENT -------------------- */

    verifyPayment: async (paymentData: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
        sessionId: string;
    }): Promise<void> => {

        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        await axiosInstance.post(
            `${SESSION_ENDPOINTS.BASE}/${paymentData.sessionId}/verify`,   // /api/v1/sessions/:id/verify
            paymentData,
            { headers }
        );
    },

    verifyInstallmentPayment: async (orderId: string): Promise<void> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        await axiosInstance.post(
            `/api/v1/payments/installment/verify?razorpayOrderId=${orderId}`,
            {},
            { headers }
        );
    },

    /* -------------------- CANCEL BOOKING -------------------- */

    cancelBooking: async (bookingId: number): Promise<void> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        await axiosInstance.patch(
            `${SESSION_ENDPOINTS.MY_BOOKINGS}/${bookingId}/cancel`,    // /api/v1/user/bookings/:id/cancel
            {},
            { headers }
        );
    },

    /* -------------------- SUBMIT REVIEW -------------------- */

    submitReview: async (
        bookingId: number,
        reviewData: { rating: number; comment: string }
    ): Promise<void> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        await axiosInstance.post(
            `${SESSION_ENDPOINTS.MY_BOOKINGS}/${bookingId}/review`,    // /api/v1/user/bookings/:id/review
            reviewData,
            { headers }
        );
    },

    /* -------------------- INSTALLMENTS -------------------- */

    getBookingInstallments: async (bookingId: number): Promise<Installment[]> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        const response = await axiosInstance.get<Installment[]>(
            INSTALLMENT_ENDPOINTS.GET_BY_BOOKING(bookingId),
            { headers }
        );
        return response.data;
    },

    payNextInstallment: async (
        installmentId: number
    ): Promise<{
        razorpayOrderId: string;
        amount: number;
    }> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        const response = await axiosInstance.post(
            INSTALLMENT_ENDPOINTS.PAY(installmentId),
            {},
            { headers }
        );

        return {
            razorpayOrderId: response.data.razorpayOrderId,
            amount: response.data.amount * 100 // Convert to paise
        };
    },

    /* -------------------- WHATSAPP GROUP LINK -------------------- */

    getWhatsAppLink: async (sessionId: string | number): Promise<string> => {
        sessionApi._ensureAuth();
        const headers = sessionApi._authHeaders();

        const response = await axiosInstance.get<{ whatsappLink: string }>(
            SESSION_ENDPOINTS.WHATSAPP_LINK(sessionId),     // /api/v1/sessions/:id/whatsapp-link
            { headers }
        );

        return response.data.whatsappLink;
    }
};
