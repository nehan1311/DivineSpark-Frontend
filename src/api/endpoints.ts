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
export const PUBLIC_ENDPOINTS = {
    THUMBNAIL: (id: string | number) =>
        `${API_BASE_URL}/public/thumbnail/${id}`,
};

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

    // Reviews
    REVIEWS_PENDING: `${API_BASE_URL}/admin/reviews/pending`,
    REVIEW_DETAILS: (id: string | number) => `${API_BASE_URL}/admin/reviews/${id}`,
    APPROVE_REVIEW: (id: string | number) => `${API_BASE_URL}/admin/reviews/${id}/approve`,
    REJECT_REVIEW: (id: string | number) => `${API_BASE_URL}/admin/reviews/${id}/reject`,
    REVIEW_EDIT: (id: string | number) => `${API_BASE_URL}/admin/reviews/${id}`,
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
};


