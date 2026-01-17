export const API_BASE_URL = 'http://localhost:8080/api/v1';

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
    INITIATE: (sessionId: number) =>
        `/api/v1/sessions/${sessionId}/pay`,


    CALLBACK: '/api/v1/payments/verify'
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


