const TOKEN_KEY = 'divine_spark_token';

/**
 * Retrieves the JWT token from local storage.
 */
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Stores the JWT token in local storage.
 * @param token The JWT token to store
 */
export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Removes the JWT token from local storage.
 */
export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * Cleans up legacy tokens to ensure single source of truth.
 */
export const cleanupLegacyTokens = (): void => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('authToken');
    // Ensure we don't have "true" as a token
    const current = localStorage.getItem(TOKEN_KEY);
    if (current === 'true' || current === 'false') {
        localStorage.removeItem(TOKEN_KEY);
    }
};

