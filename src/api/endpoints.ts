export const API_BASE_URL = '/api/v1';

/* AUTH */
export const AUTH_ENDPOINTS = {
    REQUEST_OTP: `/auth/request-otp`,
    VERIFY_OTP: `/auth/verify-otp`,
    REGISTER: `/auth/register`,
    LOGIN: `/auth/login`,
    GOOGLE_LOGIN: `/auth/google`,
    GET_PROFILE: `/profile`,
    UPDATE_PROFILE: `/profile`,
    RESET_PASSWORD: `/auth/reset-password`,
};

/* SESSIONS */
export const SESSION_ENDPOINTS = {
    BASE: `/sessions`,
    MY_BOOKINGS: `/user/bookings`,
    WHATSAPP_LINK: (id: string | number) => `/sessions/${id}/whatsapp-link`,
};

/* REVIEWS */
export const REVIEW_ENDPOINTS = {
    GET_ALL: `/user/review/all`,
    SUBMIT: `/user/review`,
};

/* PUBLIC */
export const PUBLIC_ENDPOINTS = {
    THUMBNAIL: (id: string | number) => `/public/thumbnail/${id}`,
};

/* ADMIN */
export const ADMIN_ENDPOINTS = {
    STATS: `/admin/stats`,
    REVENUE: `/admin/revenue`,
    USERS: `/admin/users`,
    GET_USER: (id: string) => `/admin/users/${id}`,
    BLOCK_USER: (id: string) => `/admin/users/${id}/block`,
    UNBLOCK_USER: (id: string) => `/admin/users/${id}/unblock`,
    SESSIONS: `/admin/sessions`,
    SESSION_DETAILS: (id: string) => `/admin/sessions/${id}`,
    SESSION_STATUS: (id: string) => `/admin/sessions/${id}/status`,
    SESSION_RESOURCES: (id: string) => `/admin/sessions/${id}/resources`,
    SESSION_USERS: (id: string) => `/admin/sessions/${id}/users`,
    SESSION_BOOKINGS: (id: string) => `/admin/sessions/${id}/bookings`,
    PAST_SESSIONS: `/admin/sessions/past`,
    PAYMENTS: `/admin/payments`,
    THUMBNAIL: (id: string) => `/admin/thumbnail/${id}`,
};

/* PAYMENTS */
export const PAYMENT_ENDPOINTS = {
    INITIATE: (sessionId: number) => `/sessions/${sessionId}/pay`,
    CALLBACK: `/payments/verify`,
};

/* DONATIONS */
export const DONATION_ENDPOINTS = {
    INITIATE: `/donations`,
};

export const ADMIN_DONATION_ENDPOINTS = {
    LIST: `/admin/donations`,
    STATS: `/admin/donations/stats`,
};

/* CONTACT */
export const CONTACT_ENDPOINTS = {
    SEND: `/contact`,
};
