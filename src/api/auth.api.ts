import axiosInstance from './axios';
import { AUTH_ENDPOINTS } from './endpoints';
import type {
    RequestOtpPayload,
    VerifyOtpPayload,
    RegisterPayload,
    LoginPayload,
    AuthResponse
} from '../types/auth.types';

/**
 * Request an OTP for a given identifier (e.g. email).
 */
export const requestOtp = async (payload: RequestOtpPayload): Promise<void> => {
    await axiosInstance.post(AUTH_ENDPOINTS.REQUEST_OTP, payload);
};

/**
 * Verify the OTP to complete login or verification.
 */
export const verifyOtp = async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.VERIFY_OTP, payload);
    return response.data;
};

/**
 * Register a new user.
 */
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, payload);
    return response.data;
};

/**
 * Login an existing user (standard password flow).
 */
export const login = async (payload: LoginPayload) => {
    const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, payload);

    const token =
        response.data.token ||
        response.data.accessToken ||
        response.data.jwt ||
        response.data; // fallback if backend returns raw string

    return { token };
};
