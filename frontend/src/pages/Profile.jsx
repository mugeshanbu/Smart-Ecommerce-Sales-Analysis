import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { MdOutlineEmail, MdOutlineCalendarToday, MdOutlineBadge, MdOutlineSettings } from "react-icons/md";

function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="animate-in">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1>My Profile</h1>
          <p>Manage your account settings and personal details</p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        gap: "24px",
        alignItems: "start"
      }}>
        {/* Profile Card Left */}
        <div className="glass-card" style={{
          padding: "32px",
          textAlign: "center",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)"
        }}>
          {/* Avatar */}
          <div style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "var(--gradient-primary)",
            color: "#fff",
            fontSize: "36px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            {user.avatar || user.fullName?.charAt(0) || "A"}
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
            {user.fullName}
          </h3>
          <p style={{ color: "var(--accent-primary)", fontWeight: 600, fontSize: "13px", marginTop: "4px" }}>
            {user.role}
          </p>

          <div style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
              <MdOutlineEmail style={{ color: "var(--text-secondary)", fontSize: "18px" }} />
              <span style={{ color: "var(--text-secondary)", wordBreak: "break-all" }}>{user.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
              <MdOutlineCalendarToday style={{ color: "var(--text-secondary)", fontSize: "18px" }} />
              <span style={{ color: "var(--text-secondary)" }}>Joined {user.joined}</span>
            </div>
          </div>

          <Link to="/settings" style={{ textDecoration: "none" }}>
            <button
              className="btn-primary"
              style={{
                width: "100%",
                marginTop: "28px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "var(--transition)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--bg-card-hover)";
                e.target.style.borderColor = "var(--border-hover)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255,255,255,0.06)";
                e.target.style.borderColor = "var(--border)";
              }}
            >
              <MdOutlineSettings style={{ fontSize: "18px" }} />
              <span>Edit Profile</span>
            </button>
          </Link>
        </div>

        {/* Profile Card Right - Account Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Card 1 */}
          <div className="glass-card" style={{
            padding: "28px 32px",
            borderRadius: "16px",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MdOutlineBadge style={{ color: "var(--accent-primary)", fontSize: "20px" }} />
              <span>Account Information</span>
            </h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px"
            }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Full Name</div>
                <div style={{ fontSize: "14px", color: "var(--text-primary)", marginTop: "4px", fontWeight: 500 }}>{user.fullName}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Username</div>
                <div style={{ fontSize: "14px", color: "var(--text-primary)", marginTop: "4px", fontWeight: 500 }}>{user.username}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Email Address</div>
                <div style={{ fontSize: "14px", color: "var(--text-primary)", marginTop: "4px", fontWeight: 500 }}>{user.email}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Role Type</div>
                <div style={{ fontSize: "14px", color: "var(--accent-success)", marginTop: "4px", fontWeight: 600 }}>{user.role}</div>
              </div>
            </div>
          </div>

          {/* Card 2 - Platform Access & System Context */}
          <div className="glass-card" style={{
            padding: "28px 32px",
            borderRadius: "16px",
            border: "1px solid var(--border)"
          }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Platform Access Privileges</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              As a **{user.role}**, you possess full read, write, update, and deletion permissions across all modules including Sales KPIs, product catalog management, customer listings, report generations, and security audit loggings.
            </p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px"
            }}>
              {["Full Control", "User Management", "API Access", "Report Downloads", "Settings Config", "Write Access"].map((tag) => (
                <span key={tag} style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "var(--accent-primary)",
                  borderRadius: "20px"
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
