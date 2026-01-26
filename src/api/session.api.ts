import axiosInstance from './axios';
import { SESSION_ENDPOINTS } from './endpoints';
import type {
    Session,
    SessionsResponse,
    SessionFilters,
    UserBooking
} from '../types/session.types';



export const sessionApi = {

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
        const response = await axiosInstance.get<UserBooking[]>(
            SESSION_ENDPOINTS.MY_BOOKINGS      // /api/v1/user/bookings
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
        await axiosInstance.post(
            `${SESSION_ENDPOINTS.BASE}/${sessionId}/join`,   // /api/v1/sessions/:id/join
            {}
        );
    },

    /* -------------------- PAYMENT (PAID SESSION) -------------------- */

    payForSession: async (
        sessionId: string
    ): Promise<{ orderId: string; amount: number; currency: string }> => {

        const response = await axiosInstance.post(
            `${SESSION_ENDPOINTS.BASE}/${sessionId}/pay`,     // /api/v1/sessions/:id/pay
            {}
        );

        return {
            orderId: response.data.orderId,
            amount: response.data.amount * 100,     // Razorpay amount conversion
            currency: response.data.currency
        };
    },

    /* -------------------- VERIFY PAYMENT -------------------- */

    verifyPayment: async (paymentData: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
        sessionId: string;
    }): Promise<void> => {

        await axiosInstance.post(
            `${SESSION_ENDPOINTS.BASE}/${paymentData.sessionId}/verify`,   // /api/v1/sessions/:id/verify
            paymentData
        );
    },

    /* -------------------- CANCEL BOOKING -------------------- */

    cancelBooking: async (bookingId: number): Promise<void> => {
        await axiosInstance.patch(
            `${SESSION_ENDPOINTS.MY_BOOKINGS}/${bookingId}/cancel`,    // /api/v1/user/bookings/:id/cancel
            {}
        );
    },

    /* -------------------- SUBMIT REVIEW -------------------- */

    submitReview: async (
        bookingId: number,
        reviewData: { rating: number; comment: string }
    ): Promise<void> => {
        await axiosInstance.post(
            `${SESSION_ENDPOINTS.MY_BOOKINGS}/${bookingId}/review`,    // /api/v1/user/bookings/:id/review
            reviewData
        );
    },

    /* -------------------- WHATSAPP GROUP LINK -------------------- */

    getWhatsAppLink: async (sessionId: string | number): Promise<string> => {
        const response = await axiosInstance.get<{ whatsappLink: string }>(
            SESSION_ENDPOINTS.WHATSAPP_LINK(sessionId)     // /api/v1/sessions/:id/whatsapp-link
        );

        return response.data.whatsappLink;
    }
};
