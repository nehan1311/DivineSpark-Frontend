import axiosInstance from './axios';
import { SESSION_ENDPOINTS } from './endpoints';
import type { Session, SessionsResponse, SessionFilters } from '../types/session.types';

export const sessionApi = {
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
        await axiosInstance.post(`${SESSION_ENDPOINTS.BASE}/${sessionId}/join`);
    },

    // Pay for Paid Session
    payForSession: async (sessionId: string): Promise<void> => {
        await axiosInstance.post(`${SESSION_ENDPOINTS.BASE}/${sessionId}/pay`);
    }
};
