import axios from 'axios';
import type {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';

import { getToken, removeToken } from '../utils/authStorage';
import { API_BASE_URL } from './endpoints';   // ✅ Use correct base URL from central file

// Create axios instance with Nginx reverse-proxy friendly API base path
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,                     // ✅ All requests automatically go to /api/v1/*
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,                     // ✅ Allow cookies if backend uses them
});

// ---------------------- REQUEST INTERCEPTOR ----------------------
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// ---------------------- RESPONSE INTERCEPTOR ----------------------
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                // Token invalid or expired → remove & notify app
                removeToken();
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
