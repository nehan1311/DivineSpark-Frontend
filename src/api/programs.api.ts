
import axiosInstance from './axios';
import { PUBLIC_ENDPOINTS } from './endpoints';
import type { Program } from '../types/program.types';

export const getProgramsFn = async (category: 'ENERGY_WORKSHOPS' | 'SPIRITUAL_TRIPS'): Promise<Program[]> => {
    const response = await axiosInstance.get<Program[]>(PUBLIC_ENDPOINTS.PROGRAMS, {
        params: { category }
    });
    return response.data;
};
