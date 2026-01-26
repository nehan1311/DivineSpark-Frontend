export interface PublicEvent {
    id: number;
    title: string;
    description: string;
    startTime: string; // ISO OffsetDateTime
    durationMinutes: number;
}
