import axiosInstance from './axios';
import { AUTH_ENDPOINTS } from './endpoints';

import type {
    RequestOtpPayload,
    VerifyOtpPayload,
    RegisterPayload,
    LoginPayload,
    AuthResponse,
    User,
    UpdateProfilePayload,
    ResetPasswordPayload
} from '../types/auth.types';

/**
 * Request OTP
 */
export const requestOtp = async (payload: RequestOtpPayload): Promise<void> => {
    await axiosInstance.post(AUTH_ENDPOINTS.REQUEST_OTP, payload);
};

/**
 * Verify OTP → login/register
 */
export const verifyOtp = async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.VERIFY_OTP, payload);
    return response.data;
};

/**
 * Register new user
 */
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, payload);
    return response.data;
};

/**
 * Standard login
 */
export const login = async (payload: LoginPayload) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, payload);
    console.log('[Auth API Debug] Raw Axios Response Data:', response.data);

    // Support flexible backend token shapes
    const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.jwt ||
        response.data;

    return { token };
};

/**
 * Google OAuth Login
 */
export const googleLogin = async (code: string) => {
    const url = `${AUTH_ENDPOINTS.GOOGLE_LOGIN}?code=${encodeURIComponent(code)}`;
    const response = await axiosInstance.post(url);

    const token =
        response.data?.token ||
        response.data?.accessToken ||
        response.data?.jwt ||
        response.data;

    return { token };
};

/**
 * Get logged-in user's profile
 */
export const getUserProfile = async (): Promise<User> => {
    const response = await axiosInstance.get<User>(AUTH_ENDPOINTS.GET_PROFILE);
    return response.data;
};

/**
 * Update profile
 */
export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<void> => {
    await axiosInstance.put(AUTH_ENDPOINTS.UPDATE_PROFILE, payload);
};

/**
 * Reset password
 */
export const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
    await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);
};
