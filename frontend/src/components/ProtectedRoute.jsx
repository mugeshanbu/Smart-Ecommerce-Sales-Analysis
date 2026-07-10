import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children, publicOnly = false }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container" style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "radial-gradient(circle at top right, #1e1b4b 0%, #0f0f17 100%)",
        color: "#fff"
      }}>
        <div className="spinner"></div>
        <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 14 }}>
          Verifying secure session...
        </p>
      </div>
    );
  }

  if (publicOnly && isAuthenticated) {
    // If user is logged in and tries to access login page, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  if (!publicOnly && !isAuthenticated) {
    // If user is not logged in and tries to access private routes, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}
