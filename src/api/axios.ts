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
        } else if (error.message === 'Network Error' && !error.response) {
            // Sometimes 302 redirects to CORS-blocked URLs appear as Network Error
            console.warn('[Axios] Network Error - possibly a CORS blocked redirect.');
        }

        return Promise.reject(error);
    }
);

// Add a specific interceptor for 200 OK responses that are actually HTML (redirects)
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        const contentType = response.headers['content-type'];
        if (
            contentType &&
            (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) &&
            response.config.url?.startsWith('/api/') &&
            response.config.responseType !== 'blob' &&
            response.config.responseType !== 'text'
        ) {
            console.error('[Axios] Received HTML response for API request. Likely an auth redirect.');
            removeToken();
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            return Promise.reject(new axios.AxiosError('Session expired (HTML response)', '401', response.config, response.request, response));
        }
        return response;
    }
);

export default axiosInstance;
