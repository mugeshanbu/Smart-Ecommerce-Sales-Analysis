import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(circle at top right, #1e1b4b 0%, #0f0f17 100%)",
      color: "#fff",
      padding: "20px"
    }}>
      <div className="glass-card" style={{
        padding: "48px 40px",
        borderRadius: "20px",
        textAlign: "center",
        maxWidth: "480px",
        width: "100%",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)"
      }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px", color: "var(--text-primary)" }}>404</h1>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-secondary)", marginTop: "8px" }}>Page Not Found</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "12px", lineHeight: "1.5" }}>
          The link you followed might be broken, or the page may have been removed. Let's get you back.
        </p>
        
        <Link to="/" style={{ textDecoration: "none" }}>
          <button
            style={{
              background: "var(--gradient-primary)",
              border: "none",
              borderRadius: "8px",
              height: "42px",
              padding: "0 24px",
              color: "#fff",
              fontWeight: 600,
              fontSize: "14px",
              marginTop: "28px",
              cursor: "pointer",
              transition: "var(--transition)",
              boxShadow: "var(--shadow-glow)"
            }}
            onMouseEnter={(e) => e.target.style.filter = "brightness(1.1)"}
            onMouseLeave={(e) => e.target.style.filter = "none"}
          >
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
