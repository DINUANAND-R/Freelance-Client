// frontend/src/Components/PrivateRoute.jsx
// Guards routes that require authentication.
// Redirects unauthenticated users to the correct login page based on role.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/auth';

const loginRoutes = {
  freelancer: '/freelancer/login',
  client: '/client/login',
  admin: '/admin/login',
};

/**
 * @param {string} role - Required role: 'freelancer' | 'client' | 'admin'
 * @param {ReactNode} children
 */
export default function PrivateRoute({ role, children }) {
  if (!isAuthenticated()) {
    const to = (role && loginRoutes[role]) || '/';
    return <Navigate to={to} replace />;
  }

  // If a specific role is required, enforce it
  if (role && getRole() !== role) {
    const to = loginRoutes[role] || '/';
    return <Navigate to={to} replace />;
  }

  return children;
}
