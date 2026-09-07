import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiUrl } from "../api/config.js";

/**
 * AdminRoute — wraps admin-only routes.
 * Checks both: (1) user is logged in, (2) user has role = "admin".
 * Non-admins get redirected to /dashboard with an error message.
 */
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("checking"); // "checking" | "admin" | "user" | "unauth"

  useEffect(() => {
    if (!token) {
      setStatus("unauth");
      return;
    }
    fetch(apiUrl("/api/user/me"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data) {
          setStatus("unauth");
        } else if (data.role === "admin") {
          setStatus("admin");
        } else {
          setStatus("user");
        }
      })
      .catch(() => setStatus("unauth"));
  }, [token]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-surface-container-high flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin block"></span>
          <p className="font-body-sm text-on-surface-variant text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (status === "unauth") {
    return <Navigate to="/login" replace />;
  }

  if (status === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
