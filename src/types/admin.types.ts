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
    // any extra admin specific fields if needed
}
