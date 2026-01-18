import axiosInstance from './axios';
import { DONATION_ENDPOINTS } from './endpoints';
import { getToken } from '../utils/authStorage';
import type {
    InitiateDonationRequest,
    InitiateDonationResponse
} from '../types/donation.types';

export const donationApi = {

    // Ensure the user is authenticated before donation
    _ensureAuth: () => {
        const token = getToken();
        if (!token) {
            throw {
                response: {
                    data: { message: 'Authentication required. Please login.' }
                }
            };
        }
        return token;
    },

    // Build authorization headers
    _authHeaders: () => {
        const token = getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    /**
     * Initiate a Donation
     */
    initiateDonation: async (
        data: InitiateDonationRequest
    ): Promise<InitiateDonationResponse> => {

        donationApi._ensureAuth();   // Verify logged-in

        const headers = donationApi._authHeaders();

        // axiosInstance already has baseURL = "/api/v1"
        const response = await axiosInstance.post<InitiateDonationResponse>(
            DONATION_ENDPOINTS.INITIATE,  // "/api/v1/donations"
            data,
            { headers }
        );

        return response.data;
    }
};
