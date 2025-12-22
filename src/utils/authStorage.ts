const TOKEN_KEY = 'jwt_token';

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
