import axiosInstance from './axios';
import { ADMIN_ENDPOINTS, ADMIN_DONATION_ENDPOINTS } from './endpoints';

import type {
    DashboardStats,
    AdminUser,
    RevenueStats,
    AdminSession,
    PaginatedSessionsResponse,
    AdminSessionBookingResponse,
    PaginatedPaymentsResponse,
    AdminDonation,
    DonationStats
} from '../types/admin.types';

/* ----------------------- DASHBOARD STATS ----------------------- */

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>(ADMIN_ENDPOINTS.STATS);
    return response.data;
};

export const getRevenueStats = async (): Promise<RevenueStats> => {
    const response = await axiosInstance.get<RevenueStats>(ADMIN_ENDPOINTS.REVENUE);
    return response.data;
};

/* ----------------------- USER MANAGEMENT ----------------------- */

export const getAdminUsers = async (): Promise<AdminUser[]> => {
    const response = await axiosInstance.get<AdminUser[]>(ADMIN_ENDPOINTS.USERS);
    return response.data;
};

export const blockUser = async (userId: string): Promise<void> => {
    await axiosInstance.post(ADMIN_ENDPOINTS.BLOCK_USER(userId));
};

export const unblockUser = async (userId: string): Promise<void> => {
    await axiosInstance.post(ADMIN_ENDPOINTS.UNBLOCK_USER(userId));
};

/* ----------------------- SESSION MANAGEMENT ----------------------- */

/**
 * Get all sessions (w/ filters)
 */
export const getAdminSessions = async (
    filters?: { page?: number; size?: number; type?: string; status?: string }
): Promise<PaginatedSessionsResponse> => {
    const response = await axiosInstance.get<PaginatedSessionsResponse>(ADMIN_ENDPOINTS.SESSIONS, {
        params: filters
    });
    return response.data;
};

/**
 * List past sessions
 */
export const getPastSessions = async (
    page: number = 0,
    size: number = 20
): Promise<PaginatedSessionsResponse> => {
    const response = await axiosInstance.get<PaginatedSessionsResponse>(ADMIN_ENDPOINTS.PAST_SESSIONS, {
        params: { page, size }
    });
    return response.data;
};

/**
 * Create a new session
 */
export const createSession = async (sessionData: Partial<AdminSession>): Promise<AdminSession> => {
    const response = await axiosInstance.post<AdminSession>(ADMIN_ENDPOINTS.SESSIONS, sessionData);
    return response.data;
};

/**
 * Update an existing session
 */
export const updateSession = async (
    sessionId: string,
    sessionData: Partial<AdminSession>
): Promise<AdminSession> => {
    const response = await axiosInstance.put<AdminSession>(
        ADMIN_ENDPOINTS.SESSION_DETAILS(sessionId),
        sessionData
    );
    return response.data;
};

/**
 * Delete a session
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
    await axiosInstance.delete(ADMIN_ENDPOINTS.SESSION_DETAILS(sessionId));
};

/**
 * Update session status
 */
export const updateSessionStatus = async (
    sessionId: string,
    status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
): Promise<void> => {
    await axiosInstance.patch(ADMIN_ENDPOINTS.SESSION_STATUS(sessionId), { status });
};

/**
 * Get users registered for a session
 */
export const getSessionUsers = async (sessionId: string): Promise<AdminUser[]> => {
    const response = await axiosInstance.get<AdminUser[]>(ADMIN_ENDPOINTS.SESSION_USERS(sessionId));
    return response.data;
};

/**
 * Get bookings for a session
 */
export const getSessionBookings = async (
    sessionId: string
): Promise<AdminSessionBookingResponse[]> => {
    const response = await axiosInstance.get<AdminSessionBookingResponse[]>(
        ADMIN_ENDPOINTS.SESSION_BOOKINGS(sessionId)
    );
    return response.data;
};

/**
 * Upload session resources (PDF, images, docs)
 */
export const uploadSessionResources = async (
    sessionId: string,
    formData: FormData
): Promise<void> => {
    await axiosInstance.post(ADMIN_ENDPOINTS.SESSION_RESOURCES(sessionId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

/**
 * Upload session thumbnail (Create)
 */
export const uploadSessionThumbnail = async (sessionId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('thumbnail', file);

    await axiosInstance.post(ADMIN_ENDPOINTS.THUMBNAIL(sessionId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

/**
 * Update session thumbnail
 */
export const updateSessionThumbnail = async (sessionId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('thumbnail', file);

    await axiosInstance.put(ADMIN_ENDPOINTS.THUMBNAIL(sessionId), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

/**
 * Delete session thumbnail
 */
export const deleteSessionThumbnail = async (sessionId: string): Promise<void> => {
    await axiosInstance.delete(ADMIN_ENDPOINTS.THUMBNAIL(sessionId));
};

/* ----------------------- PAYMENT MANAGEMENT ----------------------- */

export const getAdminPayments = async (filters?: {
    page?: number;
    size?: number;
    status?: 'SUCCESS' | 'FAILED' | 'REFUNDED';
}): Promise<PaginatedPaymentsResponse> => {
    const response = await axiosInstance.get<PaginatedPaymentsResponse>(
        ADMIN_ENDPOINTS.PAYMENTS,
        { params: filters }
    );
    return response.data;
};

/* ----------------------- DONATION MANAGEMENT ----------------------- */

export const getAdminDonations = async (): Promise<AdminDonation[]> => {
    const response = await axiosInstance.get<AdminDonation[]>(ADMIN_DONATION_ENDPOINTS.LIST);
    return response.data;
};

export const getDonationStats = async (): Promise<DonationStats> => {
    const response = await axiosInstance.get<DonationStats>(ADMIN_DONATION_ENDPOINTS.STATS);
    return response.data;
};


export const cancelSession = async (sessionId: string): Promise<void> => {
    await updateSessionStatus(sessionId, 'CANCELLED');
};