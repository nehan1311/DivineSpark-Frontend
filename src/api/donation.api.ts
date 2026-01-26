import axiosInstance from './axios';
import { DONATION_ENDPOINTS } from './endpoints';

import type {
    InitiateDonationRequest,
    InitiateDonationResponse
} from '../types/donation.types';

export const donationApi = {

    /**
     * Initiate a Donation
     */
    initiateDonation: async (
        data: InitiateDonationRequest
    ): Promise<InitiateDonationResponse> => {

        // axiosInstance already has baseURL = "/api/v1"
        const response = await axiosInstance.post<InitiateDonationResponse>(
            DONATION_ENDPOINTS.INITIATE,  // "/api/v1/donations"
            data
        );

        return response.data;
    }
};
