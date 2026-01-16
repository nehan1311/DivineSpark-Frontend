import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Native formatter for IST
const getISTFormatter = (options: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        ...options
    });
};

// Helper to ensure date string is treated as UTC if no offset functionality is present
const normalizeDateString = (dateString: string): string => {
    if (!dateString) return dateString;
    // If no Z and no +, assume UTC and append Z to ensure correct time conversion
    // This handles cases where backend sends raw UTC string without offset
    if (!dateString.includes('Z') && !dateString.includes('+')) {
        return dateString + 'Z';
    }
    return dateString;
};

export const formatDate = (dateString: string): string => {
    // dd MMM yyyy, hh:mm a
    const date = new Date(normalizeDateString(dateString));
    return getISTFormatter({
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const formatTime = (dateString: string): string => {
    // hh:mm a
    const date = new Date(normalizeDateString(dateString));
    return getISTFormatter({
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const formatFullDateTime = (dateString: string): string => {
    // Same as formatDate for now, or customize
    return formatDate(dateString);
};

// For <input type="datetime-local" />
export const formatForInput = (dateString: string): string => {
    return dayjs(dateString).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm');
};

// Parse from <input type="datetime-local" /> to ISO string with offset
export const parseFromInput = (inputString: string): string => {
    return dayjs.tz(inputString, 'Asia/Kolkata').format();
};

export const getNowInIST = (): any => {
    return dayjs().tz('Asia/Kolkata');
};

export const formatCurrency = (amount?: number, currency: string = 'INR'): string => {
    if (amount === undefined) return 'FREE';
    if (amount === 0) return 'FREE';

    // Fallback to INR if currency is explicitly null/undefined in call but not handled by default param
    const safeCurrency = currency || 'INR';

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: safeCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};
