// frontend/src/utils/axiosInstance.js
// Pre-configured axios instance that automatically attaches the JWT to every request.

import axios from 'axios';
import { getToken, clearAuth } from './auth';

const API_BASE_URL = 'http://localhost:9000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor ────────────────────────────────────────────────────────
// Attach the stored JWT token as an Authorization header before every request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────────
// If the server returns 401, clear auth and redirect to the home/login page.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
