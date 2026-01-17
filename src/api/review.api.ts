import axiosInstance from './axios';
import { REVIEW_ENDPOINTS } from './endpoints';

export interface PlatformReview {
    id: number;
    rating: number;
    comment: string;
    userName: string;
    createdAt: string;
    userId?: number;
}

export interface CreateReviewRequest {
    rating: number;
    comment: string;
}

export const reviewApi = {
    getAllReviews: async (): Promise<PlatformReview[]> => {
        const response = await axiosInstance.get(REVIEW_ENDPOINTS.GET_ALL);
        return response.data;
    },

    submitPlatformReview: async (data: CreateReviewRequest): Promise<void> => {
        const token = localStorage.getItem('token'); // Manual auth header just in case
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axiosInstance.post(REVIEW_ENDPOINTS.SUBMIT, data, { headers });
    }
};
