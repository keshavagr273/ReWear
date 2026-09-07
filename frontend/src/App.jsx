import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./components/LandingPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import LoadingPage from "./components/LoadingPage.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const isAdminPage = location.pathname === "/admin";
  const showNavbar = !isAuthPage && !isAdminPage;

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* ── PUBLIC ROUTES ─────────────────────────────────────────── */}
        {/* Landing page — anyone can browse the directory */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Auth pages */}
        <Route path="/login"  element={<LoginPage mode="login"  />} />
        <Route path="/signup" element={<LoginPage mode="signup" />} />

        {/* Product detail — public browsing, but swap/redeem requires login (handled inside) */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* ── PROTECTED ROUTES — login required ─────────────────────── */}
        {/* Member wardrobe, profile & listing management */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ── ADMIN-ONLY ROUTES — role=admin required ────────────────── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        {/* Loading / protocol demo — public */}
        <Route path="/loading" element={<LoadingPage />} />

        {/* Default & catch-all */}
        <Route path="/"  element={<Navigate to="/landing" replace />} />
        <Route path="*"  element={<Navigate to="/landing" replace />} />
      </Routes>
    </>
  );
}