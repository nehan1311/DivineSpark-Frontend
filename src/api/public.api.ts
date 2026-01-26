import axios from './axios';
import { PUBLIC_ENDPOINTS } from './endpoints';
import type { PublicEvent } from '../types/public.types';

export const getPublicEvents = async (): Promise<PublicEvent[]> => {
    const response = await axios.get<PublicEvent[]>(PUBLIC_ENDPOINTS.EVENTS);
    return response.data;
};
