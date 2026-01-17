export type SessionType = 'FREE' | 'PAID';

export interface Session {
    id: string;
    title: string;
    description: string;
    type: SessionType;
    startTime: string; // ISO String
    endTime: string; // ISO String
    guideName: string;
    price?: number;
    currency?: string;
    maxParticipants: number;
    currentParticipants: number;
    status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    imageUrl?: string;
    whatsappGroupLink?: string;
}

export interface SessionsResponse {
    sessions: Session[];
    page: number;
    size: number;
    totalPages: number;
}


export interface SessionFilters {
    page?: number;
    size?: number;
    type?: SessionType;
}

export interface UserBooking {
    bookingId?: string;
    sessionId: string;
    sessionTitle: string;
    sessionType: SessionType;
    startTime: string;
    endTime: string;
    guideName?: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'PENDING' | 'COMPLETED' | string;
    joinLink?: string;
}
