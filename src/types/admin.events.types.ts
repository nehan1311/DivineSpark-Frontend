export interface EventRequest {
    title: string;
    description: string;
    startTime: string; // ISO OffsetDateTime
    durationMinutes: number;
}

export interface AdminEvent {
    id: number;
    title: string;
    description: string;
    startTime: string;
    durationMinutes: number;
}
