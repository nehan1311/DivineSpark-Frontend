import type { Session } from './session.types';

export interface DashboardStats {
    totalSessions: number;
    upcomingSessions: number;
    totalUsers: number;
    totalBookings: number;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'BLOCKED';
    createdAt: string;
}

export interface RevenueStats {
    totalRevenue: number;
    paidBookingsCount: number;
    recentTransactions: Transaction[];
}

export interface Transaction {
    id: string;
    userEmail: string;
    amount: number;
    date: string;
    status: 'PAID' | 'REFUNDED' | 'FAILED';
}

export interface AdminSession extends Session {
    availableSeats?: number;
    maxSeats?: number;
}

export interface PaginatedSessionsResponse {
    sessions: AdminSession[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    bookingType: 'FREE' | 'PAID';
    bookingStatus: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
    joinedDate: string;
}

export interface AdminSessionBookingResponse {
    id: string;
    userId: string;
    username: string;
    email: string;
    phoneNumber?: string;
    bookingType: 'FREE' | 'PAID';
    bookingStatus: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
    bookedAt: string;
}

// Payment types
export interface AdminPayment {
    id: string;
    orderId?: string;
    paymentId?: string;
    userEmail: string;
    sessionId: string;
    sessionTitle: string;
    amount: number;
    currency: string;
    status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
    paidAt: string;
    createdAt?: string;
    updatedAt?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
}

export interface PaginatedPaymentsResponse {
    payments: AdminPayment[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}


export interface AdminDonation {
    id: string;
    orderId: string;
    paymentId?: string;
    userId: string;
    userName: string;
    userEmail: string;
    contactNumber?: string;
    amount: number;
    currency: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    note?: string;
    createdAt: string;
}

export interface DonationStats {
    totalAmount: number;
    totalDonors: number;
    monthlyDonations: {
        month: number;
        year: number;
        amount: number;
    }[];
}
