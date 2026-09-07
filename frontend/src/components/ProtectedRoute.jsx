import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * If no token in localStorage, redirects to /login and saves
 * the attempted path so we can redirect back after login.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Save where user was trying to go, so after login we send them back
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
