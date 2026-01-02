let token: string | null = null;

/**
 * Retrieves the JWT token from memory.
 */
export const getToken = (): string | null => {
    return token;
};

/**
 * Stores the JWT token in memory.
 * @param newToken The JWT token to store
 */
export const setToken = (newToken: string): void => {
    token = newToken;
};

/**
 * Removes the JWT token from memory.
 */
export const removeToken = (): void => {
    token = null;
};

