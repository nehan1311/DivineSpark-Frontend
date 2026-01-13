import axiosInstance from './axios';
import { DONATION_ENDPOINTS } from './endpoints';
import { getToken } from '../utils/authStorage';
import type { InitiateDonationRequest, InitiateDonationResponse } from '../types/donation.types';

export const donationApi = {
    _ensureAuth: () => {
        const token = getToken();
        if (!token) {
            throw { response: { data: { message: 'Authentication required. Please login.' } } };
        }
        return token;
    },

    _authHeaders: () => {
        const token = getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    initiateDonation: async (data: InitiateDonationRequest): Promise<InitiateDonationResponse> => {
        donationApi._ensureAuth();
        const headers = donationApi._authHeaders();
        const response = await axiosInstance.post<InitiateDonationResponse>(DONATION_ENDPOINTS.INITIATE, data, { headers });
        return response.data;
    }
};
