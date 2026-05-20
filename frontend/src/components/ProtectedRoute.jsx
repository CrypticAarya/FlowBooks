import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Reusable Protected Route Component
 * 
 * This component acts as a "guard" for internal routes. It checks
 * if a valid JWT token exists in localStorage. If it does, it renders
 * the requested child component. If it does not, it instantly intercepts
 * the request and redirects the user back to the login page.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('flowbooks_token');

  // If there's no token, redirect to the login page immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, allow them to view the protected component
  return children;
}
