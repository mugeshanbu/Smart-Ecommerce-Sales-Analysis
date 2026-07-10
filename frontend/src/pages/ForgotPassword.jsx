import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import { MdOutlineEmail } from "react-icons/md";
import { parseApiError } from "../utils/errorHelper";

const API = "http://localhost:8080/api";

function ForgotPassword() {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      error("Email address is required.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API}/auth/forgot-password`, { email });
      success(response.data.message || "Reset link compiled and sent!");
      setSent(true);
    } catch (err) {
      error(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(circle at top right, #1e1b4b 0%, #0f0f17 100%)",
      padding: "20px"
    }}>
      <div className="glass-card animate-in" style={{
        width: "100%",
        maxWidth: "420px",
        padding: "40px 32px",
        borderRadius: "20px",
        boxShadow: "var(--shadow-lg)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Top Gradient Bar */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "var(--gradient-primary)"
        }} />

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px", display: "inline-block" }}>🔑</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Reset Password</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Enter your registered email to receive password reset link
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Email Address</label>
              <div style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "0 14px",
                height: "44px"
              }}>
                <MdOutlineEmail style={{ color: "var(--text-secondary)", fontSize: "20px", marginRight: "10px" }} />
                <input
                  type="email"
                  placeholder="Enter registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", width: "100%", fontSize: "14px" }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: "var(--gradient-primary)",
                border: "none",
                borderRadius: "10px",
                height: "44px",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                transition: "var(--transition)",
                boxShadow: "var(--shadow-glow)"
              }}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                  <span>Checking Email...</span>
                </>
              ) : (
                <span>Request Reset Link</span>
              )}
            </button>
          </form>
        ) : (
          <div style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "13px",
            color: "var(--text-secondary)",
            textAlign: "center",
            lineHeight: 1.6
          }}>
            <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>📩</span>
            Password reset link logged to **server console** (or sent via SMTP)! Follow the link in the terminal to set a new password.
          </div>
        )}

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--text-secondary)" }}>
          Back to <Link to="/login" style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
