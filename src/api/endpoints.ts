// Base API prefix (used by axios)
export const API_BASE_URL = '/api/v1';

/* ===================== AUTH ===================== */
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

/* ===================== SESSIONS ===================== */
export const SESSION_ENDPOINTS = {
    BASE: `/sessions`,
    MY_BOOKINGS: `/user/bookings`,
    WHATSAPP_LINK: (id: string | number) =>
        `/sessions/${id}/whatsapp-link`,
};

/* ===================== INSTALLMENTS ===================== */
export const INSTALLMENT_ENDPOINTS = {
    GET_BY_BOOKING: (bookingId: number) =>
        `/installments/booking/${bookingId}`,
    PAY: (installmentId: number) =>
        `/installments/${installmentId}/pay`,
};

/* ===================== REVIEWS ===================== */
export const REVIEW_ENDPOINTS = {
    GET_ALL: `/user/review/all`,
    SUBMIT: `/user/review`,
};

/* ===================== PUBLIC ===================== */
export const PUBLIC_ENDPOINTS = {
    THUMBNAIL: (id: string | number) =>
        `/public/thumbnail/${id}`,
    EVENTS: `/public/events/ticker`,
    PROGRAMS: `/public/programs`,
};

/* ===================== ADMIN ===================== */
export const ADMIN_ENDPOINTS = {
    // Dashboard
    STATS: `/admin/stats`,
    REVENUE: `/admin/revenue`,

    // Users
    USERS: `/admin/users`,
    GET_USER: (id: string) => `/admin/users/${id}`,
    BLOCK_USER: (id: string) => `/admin/users/${id}/block`,
    UNBLOCK_USER: (id: string) => `/admin/users/${id}/unblock`,

    // Sessions
    SESSIONS: `/admin/sessions`,
    SESSION_DETAILS: (id: string) => `/admin/sessions/${id}`,
    SESSION_STATUS: (id: string) => `/admin/sessions/${id}/status`,
    SESSION_RESOURCES: (id: string) => `/admin/sessions/${id}/resources`,
    SESSION_USERS: (id: string) => `/admin/sessions/${id}/users`,
    SESSION_BOOKINGS: (id: string) => `/admin/sessions/${id}/bookings`,
    SESSION_INSTALLMENTS: (id: string) =>
        `/admin/sessions/${id}/installments`,
    PAST_SESSIONS: `/admin/sessions/past`,

    // Payments
    PAYMENTS: `/admin/payments`,
    THUMBNAIL: (id: string) => `/admin/thumbnail/${id}`,

    // Reviews
    REVIEWS_PENDING: `/admin/reviews/pending`,
    REVIEW_DETAILS: (id: string | number) =>
        `/admin/reviews/${id}`,
    APPROVE_REVIEW: (id: string | number) =>
        `/admin/reviews/${id}/approve`,
    REJECT_REVIEW: (id: string | number) =>
        `/admin/reviews/${id}/reject`,
    REVIEW_EDIT: (id: string | number) =>
        `/admin/reviews/${id}`,

    // Blogs
    BLOGS: `/admin/blogs`,
    BLOG_DETAILS: (id: string | number) =>
        `/admin/blogs/${id}`,
    PUBLISH_BLOG: (id: string | number) =>
        `/admin/blogs/${id}/publish`,

    // Events
    EVENTS: `/admin/events`,
    EVENT_DETAILS: (id: string | number) =>
        `/admin/events/${id}`,

    // Programs
    PROGRAMS: `/admin/programs`,
    PROGRAM_DETAILS: (id: string | number) =>
        `/admin/programs/${id}`,
};

/* ===================== PAYMENTS ===================== */
export const PAYMENT_ENDPOINTS = {
    INITIATE: (sessionId: number) =>
        `/sessions/${sessionId}/pay`,
    CALLBACK: `/payments/verify`,
};

/* ===================== DONATIONS ===================== */
export const DONATION_ENDPOINTS = {
    INITIATE: `/donations`,
};

export const ADMIN_DONATION_ENDPOINTS = {
    LIST: `/admin/donations`,
    STATS: `/admin/donations/stats`,
};

/* ===================== CONTACT ===================== */
export const CONTACT_ENDPOINTS = {
    SEND: `/contact`,
};

/* ===================== BLOGS (Public) ===================== */
export const BLOG_ENDPOINTS = {
    GET_ALL: `/blogs`,
    GET_BY_SLUG: (slug: string) => `/blogs/${slug}`,
};
