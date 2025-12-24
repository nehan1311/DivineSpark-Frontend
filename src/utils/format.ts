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

export const formatCurrency = (amount?: number, currency: string = 'USD'): string => {
    if (amount === undefined) return 'FREE';
    if (amount === 0) return 'FREE';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
