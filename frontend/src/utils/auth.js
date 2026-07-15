// frontend/src/utils/auth.js
// Central helpers for reading/writing auth data in localStorage.

const TOKEN_KEY = 'authToken';
const ROLE_KEY = 'authRole';
const USER_KEY = 'authUser';

/**
 * Save authentication data after a successful login.
 * @param {string} token - JWT token
 * @param {string} role  - 'freelancer' | 'client' | 'admin'
 * @param {object} user  - Plain user object (no password)
 */
export const saveAuth = (token, role, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/** Return the stored JWT string, or null. */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/** Return the stored role string, or null. */
export const getRole = () => localStorage.getItem(ROLE_KEY);

/** Return the parsed user object, or null. */
export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Return true if a token exists in localStorage. */
export const isAuthenticated = () => !!localStorage.getItem(TOKEN_KEY);

/** Remove all auth data (call on logout). */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
  // Clear legacy keys used by old code
  localStorage.removeItem('adminToken');
  localStorage.removeItem('client');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
