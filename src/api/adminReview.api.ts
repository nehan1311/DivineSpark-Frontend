import axiosInstance from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { PlatformReview } from './review.api';

// Admin Review Type - might be same as PlatformReview but context implies it works for Admin
export interface AdminReview extends PlatformReview {
    status?: string;
    sessionTitle?: string; // Prompt mentions "Session title (if available)"
    submittedDate?: string;
}

export interface ReviewUpdateRequest {
    comment: string;
    rating: number;
}

export const adminReviewApi = {

    /**
     * Fetch pending reviews
     */
    getPendingReviews: async (): Promise<AdminReview[]> => {
        const response = await axiosInstance.get<AdminReview[]>(ADMIN_ENDPOINTS.REVIEWS_PENDING);
        // Map backend response to AdminReview if needed, assuming direct match for now
        return response.data;
    },

    /**
     * Edit review content
     */
    editReview: async (reviewId: number, data: ReviewUpdateRequest): Promise<AdminReview> => {
        const response = await axiosInstance.put<AdminReview>(ADMIN_ENDPOINTS.REVIEW_DETAILS(reviewId), data);
        return response.data;
    },

    /**
     * Approve review
     */
    approveReview: async (reviewId: number): Promise<void> => {
        await axiosInstance.patch(ADMIN_ENDPOINTS.APPROVE_REVIEW(reviewId));
    },

    /**
     * Reject review
     */
    rejectReview: async (reviewId: number): Promise<void> => {
        await axiosInstance.patch(ADMIN_ENDPOINTS.REJECT_REVIEW(reviewId));
    }
};
