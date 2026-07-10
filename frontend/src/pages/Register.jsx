import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import axios from "axios";
import { MdOutlineLock, MdOutlinePerson, MdOutlineEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { parseApiError } from "../utils/errorHelper";

const API = "http://localhost:8080/api";

function Register() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      error("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(`${API}/auth/register`, { name, email, password });
      success(response.data.message || "Registration successful!");
      navigate("/login");
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
        maxWidth: "440px",
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
          <div style={{ fontSize: "36px", marginBottom: "8px", display: "inline-block" }}>🛒</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Create Account</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Join SmartShop BI and analyze your store datasets
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Name Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Full Name</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0 14px",
              height: "42px"
            }}>
              <MdOutlinePerson style={{ color: "var(--text-secondary)", fontSize: "18px", marginRight: "10px" }} />
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", width: "100%", fontSize: "14px" }}
              />
            </div>
          </div>

          {/* Email Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Email Address</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0 14px",
              height: "42px"
            }}>
              <MdOutlineEmail style={{ color: "var(--text-secondary)", fontSize: "18px", marginRight: "10px" }} />
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", width: "100%", fontSize: "14px" }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Password</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0 14px",
              height: "42px"
            }}>
              <MdOutlineLock style={{ color: "var(--text-secondary)", fontSize: "18px", marginRight: "10px" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", width: "100%", fontSize: "14px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
              >
                {showPassword ? <MdVisibilityOff style={{ fontSize: "18px" }} /> : <MdVisibility style={{ fontSize: "18px" }} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Confirm Password</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0 14px",
              height: "42px"
            }}>
              <MdOutlineLock style={{ color: "var(--text-secondary)", fontSize: "18px", marginRight: "10px" }} />
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", width: "100%", fontSize: "14px" }}
              />
            </div>
          </div>

          {/* Submit Button */}
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
              marginTop: "8px",
              transition: "var(--transition)",
              boxShadow: "var(--shadow-glow)"
            }}
          >
            {submitting ? (
              <>
                <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                <span>Registering...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
