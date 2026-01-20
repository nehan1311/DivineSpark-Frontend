<<<<<<< HEAD
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
=======
// Base URL for all backend API calls
export const API_BASE_URL = '/api/v1';

/* ---------------- AUTH ---------------- */
export const AUTH_ENDPOINTS = {
    REQUEST_OTP: `${API_BASE_URL}/auth/request-otp`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    GOOGLE_LOGIN: `${API_BASE_URL}/auth/google`,
    GET_PROFILE: `${API_BASE_URL}/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/profile`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
};

/* ---------------- SESSIONS (Public/User) ---------------- */
export const SESSION_ENDPOINTS = {
    BASE: `${API_BASE_URL}/sessions`,                         // GET upcoming sessions
    MY_BOOKINGS: `${API_BASE_URL}/user/bookings`,            // GET user bookings
    WHATSAPP_LINK: (id: string | number) =>
        `${API_BASE_URL}/sessions/${id}/whatsapp-link`,      // WhatsApp join link
};

/* ---------------- REVIEWS ---------------- */
export const REVIEW_ENDPOINTS = {
    GET_ALL: `${API_BASE_URL}/user/review/all`,
    SUBMIT: `${API_BASE_URL}/user/review`,
};

/* ---------------- PUBLIC ---------------- */
>>>>>>> 9c80cbd (Review issue !)
export const PUBLIC_ENDPOINTS = {
    THUMBNAIL: (id: string | number) =>
        `${API_BASE_URL}/public/thumbnail/${id}`,
};

<<<<<<< HEAD
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
=======
/* ---------------- ADMIN ---------------- */
export const ADMIN_ENDPOINTS = {
    STATS: `${API_BASE_URL}/admin/stats`,
    REVENUE: `${API_BASE_URL}/admin/revenue`,

    // Users
    USERS: `${API_BASE_URL}/admin/users`,
    GET_USER: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
    BLOCK_USER: (id: string) => `${API_BASE_URL}/admin/users/${id}/block`,
    UNBLOCK_USER: (id: string) => `${API_BASE_URL}/admin/users/${id}/unblock`,

    // Sessions
    SESSIONS: `${API_BASE_URL}/admin/sessions`,
    SESSION_DETAILS: (id: string) => `${API_BASE_URL}/admin/sessions/${id}`,
    SESSION_STATUS: (id: string) => `${API_BASE_URL}/admin/sessions/${id}/status`,
    SESSION_RESOURCES: (id: string) => `${API_BASE_URL}/admin/sessions/${id}/resources`,
    SESSION_USERS: (id: string) => `${API_BASE_URL}/admin/sessions/${id}/users`,
    SESSION_BOOKINGS: (id: string) => `${API_BASE_URL}/admin/sessions/${id}/bookings`,
    PAST_SESSIONS: `${API_BASE_URL}/admin/sessions/past`,

    // Payments
    PAYMENTS: `${API_BASE_URL}/admin/payments`,
    THUMBNAIL: (id: string) => `${API_BASE_URL}/admin/thumbnail/${id}`,
};

/* ---------------- PAYMENTS ---------------- */
export const PAYMENT_ENDPOINTS = {
    INITIATE: (sessionId: number) =>
        `${API_BASE_URL}/sessions/${sessionId}/pay`,
    CALLBACK: `${API_BASE_URL}/payments/verify`,
};

/* ---------------- DONATIONS ---------------- */
export const DONATION_ENDPOINTS = {
    INITIATE: `${API_BASE_URL}/donations`,
};

export const ADMIN_DONATION_ENDPOINTS = {
    LIST: `${API_BASE_URL}/admin/donations`,
    STATS: `${API_BASE_URL}/admin/donations/stats`,
};

/* ---------------- CONTACT ---------------- */
export const CONTACT_ENDPOINTS = {
    SEND: `${API_BASE_URL}/contact`,
>>>>>>> 9c80cbd (Review issue !)
};

/* CONTACT */
export const CONTACT_ENDPOINTS = {
    SEND: `/contact`,
};
