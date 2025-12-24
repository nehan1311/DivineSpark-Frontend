import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from './endpoints';
import { getToken, removeToken } from '../utils/authStorage';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors (401, 403)
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                // Token is invalid or expired
                removeToken();
                // Dispatch event so AuthProvider can handle the UI transition/state clearing
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
