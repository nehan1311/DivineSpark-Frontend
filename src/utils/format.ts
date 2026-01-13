export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
