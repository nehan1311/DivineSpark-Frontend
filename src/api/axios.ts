import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getToken, removeToken } from '../utils/authStorage';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// Endpoints from endpoints.ts now include '/api/v1', so we only need the origin for local dev
const AXIOS_BASE = isLocal ? 'http://localhost:8080' : '';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: AXIOS_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();

        // Check if the URL is public; if so, we generally prefer NOT to send the token
        // to avoid "401" if the backend is picky about tokens on public routes,
        // or if the token is arguably invalid but the user should still see public content.
        const isPublicEndpoint = config.url?.includes('/public/');

        if (token && !isPublicEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);



// ... (imports)

// Response Interceptor: Handle Errors (401, 403)
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;

            // IGNORE 401s from public endpoints to prevent loops/auto-logout
            const isPublicEndpoint = error.config?.url?.includes('/public/');

            if (status === 401 && !isPublicEndpoint) {
                console.error('[Axios Debug] 401 Unauthorized for URL:', error.config?.url);
                // Token is invalid or expired
                removeToken();
                // Dispatch event so AuthProvider can handle the UI transition/state clearing
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            } else if (status === 401 && isPublicEndpoint) {
                console.warn('[Axios Debug] Ignored 401 for public endpoint:', error.config?.url);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
