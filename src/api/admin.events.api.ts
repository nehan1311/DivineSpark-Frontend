import axiosInstance from './axios';
import { ADMIN_ENDPOINTS } from './endpoints';
import type { AdminEvent, EventRequest } from '../types/admin.events.types';

export const getEvents = async (): Promise<AdminEvent[]> => {
    const response = await axiosInstance.get<AdminEvent[]>(
        ADMIN_ENDPOINTS.EVENTS
    );
    return response.data;
};

export const createEvent = async (eventData: EventRequest): Promise<AdminEvent> => {
    const response = await axiosInstance.post<AdminEvent>(
        ADMIN_ENDPOINTS.EVENTS,
        eventData
    );
    return response.data;
};

export const updateEvent = async (id: number, eventData: EventRequest): Promise<AdminEvent> => {
    const response = await axiosInstance.put<AdminEvent>(
        ADMIN_ENDPOINTS.EVENT_DETAILS(id),
        eventData
    );
    return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
    await axiosInstance.delete(
        ADMIN_ENDPOINTS.EVENT_DETAILS(id)
    );
};
