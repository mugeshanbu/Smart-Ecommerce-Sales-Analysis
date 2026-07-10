import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { MdOutlineLock, MdOutlinePerson, MdVisibility, MdVisibilityOff } from "react-icons/md";

function Login() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    const result = await login(username, password);
    setSubmitting(false);

    if (result.success) {
      success("Logged in successfully. Welcome back!");
    } else {
      error(result.message);
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

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "36px",
            marginBottom: "8px",
            display: "inline-block"
          }}>
            🛒
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Sign in to access your sales intelligence dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Username Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
              Username or Email
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0 14px",
              height: "44px",
              transition: "var(--transition)"
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-primary)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <MdOutlinePerson style={{ color: "var(--text-secondary)", fontSize: "20px", marginRight: "10px" }} />
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  width: "100%",
                  fontSize: "14px"
                }}
                id="login-username"
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
                Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: "11px", color: "var(--accent-primary)", textDecoration: "none", fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "0 14px",
              height: "44px",
              transition: "var(--transition)"
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-primary)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <MdOutlineLock style={{ color: "var(--text-secondary)", fontSize: "20px", marginRight: "10px" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  width: "100%",
                  fontSize: "14px"
                }}
                id="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0
                }}
              >
                {showPassword ? <MdVisibilityOff style={{ fontSize: "20px" }} /> : <MdVisibility style={{ fontSize: "20px" }} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
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
              marginTop: "10px",
              transition: "var(--transition)",
              boxShadow: "var(--shadow-glow)"
            }}
            onMouseEnter={(e) => e.target.style.filter = "brightness(1.1)"}
            onMouseLeave={(e) => e.target.style.filter = "none"}
            id="login-submit-btn"
          >
            {submitting ? (
              <>
                <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Create Account Link */}
        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--text-secondary)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>Sign Up</Link>
        </div>

        {/* Demo Account Tip Info */}
        <div style={{
          marginTop: "24px",
          background: "rgba(99, 102, 241, 0.08)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          borderRadius: "10px",
          padding: "12px 16px",
          fontSize: "12px",
          color: "var(--text-secondary)"
        }}>
          <span style={{ fontWeight: 700, color: "var(--accent-primary)" }}>💡 Demo Credentials:</span>
          <div style={{ marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
            <span>Username: <strong style={{ color: "var(--text-primary)" }}>admin@smartshop.com</strong></span>
            <span>Password: <strong style={{ color: "var(--text-primary)" }}>admin123</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
