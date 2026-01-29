import axios from 'axios';
import type {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';

import { getToken, removeToken } from '../utils/authStorage';
import { API_BASE_URL } from './endpoints'; // /api/v1

// --------------------------------------------------
// Axios instance (Nginx / Reverse Proxy friendly)
// --------------------------------------------------
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL, // e.g. /api/v1
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // safe for future cookie-based auth
});

// --------------------------------------------------
// REQUEST INTERCEPTOR
// Attach JWT only for protected routes
// --------------------------------------------------
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();

        // Avoid attaching token to public APIs
        const isPublicEndpoint = config.url?.includes('/public/');

        if (token && !isPublicEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// --------------------------------------------------
// RESPONSE INTERCEPTOR
// Centralized auth error handling
// --------------------------------------------------
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;
            const isPublicEndpoint = error.config?.url?.includes('/public/');

            // Handle unauthorized access for protected APIs
            if (status === 401 && !isPublicEndpoint) {
                console.error('[Axios] Unauthorized - logging out');

                removeToken();

                // Let AuthProvider / AppRouter handle redirect
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
