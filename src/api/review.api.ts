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

    /**
     * Fetch all platform reviews
     */
    getAllReviews: async (): Promise<PlatformReview[]> => {
        const response = await axiosInstance.get<PlatformReview[]>(REVIEW_ENDPOINTS.GET_ALL);
        return response.data;
    },

    /**
     * Submit a new review (requires authentication)
     */
    submitPlatformReview: async (data: CreateReviewRequest): Promise<void> => {
        // Token is attached automatically by axiosInstance interceptor
        await axiosInstance.post(REVIEW_ENDPOINTS.SUBMIT, data);
    }
};
