// Use environment variable if set, otherwise default to relative path for production (Nginx proxy)
// or standard localhost for local dev if not running behind proxy
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const AUTH_ENDPOINTS = {
    REQUEST_OTP: '/auth/request-otp',
    VERIFY_OTP: '/auth/verify-otp',
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GOOGLE_LOGIN: '/auth/google',
    GET_PROFILE: '/profile',
    UPDATE_PROFILE: '/profile',
    RESET_PASSWORD: '/auth/reset-password',
};

export const SESSION_ENDPOINTS = {
    BASE: '/sessions',
    MY_BOOKINGS: '/user/bookings',
    WHATSAPP_LINK: (id: string | number) => `/sessions/${id}/whatsapp-link`,
};

export const REVIEW_ENDPOINTS = {
    GET_ALL: '/user/review/all',
    SUBMIT: '/user/review',
};

export const PUBLIC_ENDPOINTS = {
    THUMBNAIL: (id: string | number) => `/public/thumbnail/${id}`,
};

export const ADMIN_ENDPOINTS = {

    STATS: '/admin/stats',
    REVENUE: '/admin/revenue',

    // User Management
    USERS: '/admin/users',
    GET_USER: (id: string) => `/admin/users/${id}`,
    BLOCK_USER: (id: string) => `/admin/users/${id}/block`,
    UNBLOCK_USER: (id: string) => `/admin/users/${id}/unblock`,

    // Session Management
    SESSIONS: '/admin/sessions', // GET (list), POST (create)
    SESSION_DETAILS: (id: string) => `/admin/sessions/${id}`, // GET, PUT (update), DELETE
    SESSION_STATUS: (id: string) => `/admin/sessions/${id}/status`, // PATCH
    SESSION_RESOURCES: (id: string) => `/admin/sessions/${id}/resources`, // POST
    SESSION_USERS: (id: string) => `/admin/sessions/${id}/users`, // GET
    SESSION_BOOKINGS: (id: string) => `/admin/sessions/${id}/bookings`, // GET
    PAST_SESSIONS: '/admin/sessions/past', // GET

    // Payment Management
    PAYMENTS: '/admin/payments', // GET (list with pagination)
    THUMBNAIL: (id: string) => `/admin/thumbnail/${id}`, // POST, PUT, DELETE, GET
};
export const PAYMENT_ENDPOINTS = {
    // Note: These paths were hardcoded with /api/v1 prefix, but should ideally be relative to API_BASE_URL
    // However, if the axios instance already appends API_BASE_URL, we should remove /api/v1 from here.
    // Assuming standard axios setup where baseURL is API_BASE_URL.

    // If your axios request uses the baseURL, these should just be:
    INITIATE: (sessionId: number) => `/sessions/${sessionId}/pay`,
    CALLBACK: '/payments/verify'
};


export const DONATION_ENDPOINTS = {
    INITIATE: '/donations', // POST { amount, note }
};

export const CONTACT_ENDPOINTS = {
    SEND: '/contact',
};

export const ADMIN_DONATION_ENDPOINTS = {
    LIST: '/admin/donations', // GET
    STATS: '/admin/donations/stats', // GET
};


