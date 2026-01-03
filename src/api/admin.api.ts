import axiosInstance from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type {
    DashboardStats,
    AdminUser,
    RevenueStats,
    AdminSession,
    PaginatedSessionsResponse
} from '../types/admin.types';

// --- DASHBOARD STATS ---

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>(ADMIN_ENDPOINTS.STATS);
    return response.data;
};

export const getRevenueStats = async (): Promise<RevenueStats> => {
    const response = await axiosInstance.get<RevenueStats>(ADMIN_ENDPOINTS.REVENUE);
    return response.data;
};

// --- USER MANAGEMENT ---

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

// --- SESSION MANAGEMENT ---

/**
 * List all sessions with optional filters
 */
export const getAdminSessions = async (filters?: { page?: number; size?: number; type?: string; status?: string }): Promise<PaginatedSessionsResponse> => {
    const response = await axiosInstance.get<PaginatedSessionsResponse>(ADMIN_ENDPOINTS.SESSIONS, { params: filters });
    return response.data;
};

/**
 * List past sessions
 */
export const getPastSessions = async (): Promise<AdminSession[]> => {
    const response = await axiosInstance.get<AdminSession[]>(ADMIN_ENDPOINTS.PAST_SESSIONS);
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
export const updateSession = async (sessionId: string, sessionData: Partial<AdminSession>): Promise<AdminSession> => {
    const response = await axiosInstance.put<AdminSession>(ADMIN_ENDPOINTS.SESSION_DETAILS(sessionId), sessionData);
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
export const updateSessionStatus = async (sessionId: string, status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED'): Promise<void> => {
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
export const getSessionBookings = async (sessionId: string): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(ADMIN_ENDPOINTS.SESSION_BOOKINGS(sessionId));
    return response.data;
};

/**
 * Upload session resources
 */
export const uploadSessionResources = async (sessionId: string, formData: FormData): Promise<void> => {
    await axiosInstance.post(ADMIN_ENDPOINTS.SESSION_RESOURCES(sessionId), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// --- REPLACED / DEPRECATED HELPERS ---

/**
 * @deprecated Use updateSessionStatus(id, 'CANCELLED') instead if possible, or keep as wrapper
 */
export const cancelSession = async (sessionId: string): Promise<void> => {
    // Mapping old cancel behavior to new status update endpoint
    await updateSessionStatus(sessionId, 'CANCELLED');
};
