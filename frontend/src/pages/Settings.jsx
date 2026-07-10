import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  MdOutlinePerson, MdOutlineNotifications,
  MdOutlineSecurity, MdOutlinePalette, MdCheck
} from "react-icons/md";

function Settings() {
  const { user, updateProfile, updatePassword } = useAuth();
  const { success, error } = useToast();

  // Profile Form States
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState({
    emailAlerts: user?.notifications?.emailAlerts ?? true,
    orderUpdates: user?.notifications?.orderUpdates ?? true,
    weeklyDigest: user?.notifications?.weeklyDigest ?? false,
    securityAlerts: user?.notifications?.securityAlerts ?? true,
  });
  const [notifSaving, setNotifSaving] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(user?.theme || "dark");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !email.trim()) {
      error("All profile fields are required.");
      return;
    }

    setProfileSaving(true);
    const result = await updateProfile({ fullName, username, email });
    setProfileSaving(false);

    if (result.success) {
      success("Profile details updated successfully!");
    } else {
      error(result.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      error("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      error("New password must be at least 6 characters long.");
      return;
    }

    setPasswordSaving(true);
    const result = await updatePassword(currentPassword, newPassword);
    setPasswordSaving(false);

    if (result.success) {
      success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      error(result.message);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    setNotifSaving(true);
    const result = await updateProfile({ notifications });
    setNotifSaving(false);

    if (result.success) {
      success("Notification preferences updated!");
    } else {
      error(result.message);
    }
  };

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    const result = await updateProfile({ theme: newTheme });

    if (result.success) {
      success(`Theme preference updated to ${newTheme}!`);
    } else {
      error(result.message);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    outline: "none",
    fontSize: "14px",
    transition: "var(--transition)",
    marginTop: "6px"
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)"
  };

  const saveBtnStyle = (saving) => ({
    background: "var(--gradient-primary)",
    border: "none",
    borderRadius: "8px",
    height: "38px",
    color: "#fff",
    fontWeight: 600,
    fontSize: "13px",
    padding: "0 16px",
    cursor: saving ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "var(--transition)",
    marginTop: "20px"
  });

  return (
    <div className="animate-in">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1>Settings</h1>
          <p>Personalize your workspace and manage safety settings</p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px"
      }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ padding: "28px 32px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <MdOutlinePerson style={{ color: "var(--accent-primary)", fontSize: "20px" }} />
            <span>Profile Settings</span>
          </h3>

          <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
                placeholder="Enter full name"
                id="settings-fullname"
              />
            </div>
            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                placeholder="Enter username"
                id="settings-username"
              />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="Enter email address"
                id="settings-email"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={profileSaving}
                style={saveBtnStyle(profileSaving)}
                id="settings-save-profile"
              >
                {profileSaving ? "Saving..." : "Save Details"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="glass-card" style={{ padding: "28px 32px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <MdOutlineSecurity style={{ color: "var(--accent-danger)", fontSize: "20px" }} />
            <span>Security & Password</span>
          </h3>

          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                id="settings-cur-password"
              />
            </div>
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                id="settings-new-password"
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                id="settings-confirm-password"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={passwordSaving}
                style={{ ...saveBtnStyle(passwordSaving), background: "var(--gradient-danger)" }}
                id="settings-save-password"
              >
                {passwordSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Notifications Preference Card */}
        <div className="glass-card" style={{ padding: "28px 32px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <MdOutlineNotifications style={{ color: "var(--accent-warning)", fontSize: "20px" }} />
            <span>Notifications</span>
          </h3>

          <form onSubmit={handleNotificationsSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { key: "emailAlerts", title: "Email Alerts", desc: "Receive automated order and system notifications" },
              { key: "orderUpdates", title: "Order Placement Updates", desc: "Get real-time alerts when checkouts complete" },
              { key: "weeklyDigest", title: "Weekly Performance Digest", desc: "Subscribe to summary reports every Monday" },
              { key: "securityAlerts", title: "Security Notifications", desc: "Get warned on brute-force blockings and key resets" }
            ].map((item) => (
              <div key={item.key} style={{ display: "flex", alignItems: "start", gap: "12px", cursor: "pointer" }}
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
              >
                <div style={{
                  width: "18px",
                  height: "18px",
                  border: "2px solid var(--border)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: notifications[item.key] ? "var(--accent-primary)" : "transparent",
                  borderColor: notifications[item.key] ? "var(--accent-primary)" : "var(--border)",
                  marginTop: "3px",
                  flexShrink: 0
                }}>
                  {notifications[item.key] && <MdCheck style={{ color: "#fff", fontSize: "14px" }} />}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{item.desc}</div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={notifSaving}
                style={{ ...saveBtnStyle(notifSaving), background: "var(--gradient-warning)" }}
                id="settings-save-notifications"
              >
                {notifSaving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>

        {/* Theme Settings Card */}
        <div className="glass-card" style={{ padding: "28px 32px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <MdOutlinePalette style={{ color: "var(--accent-info)", fontSize: "20px" }} />
            <span>Theme Selection</span>
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Dark Theme Select */}
            <div
              onClick={() => handleThemeChange("dark")}
              style={{
                border: `2px solid ${theme === "dark" ? "var(--accent-info)" : "var(--border)"}`,
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                textAlign: "center",
                background: "rgba(0,0,0,0.3)",
                transition: "var(--transition)"
              }}
              onMouseEnter={(e) => { if (theme !== "dark") e.currentTarget.style.borderColor = "var(--border-hover)"; }}
              onMouseLeave={(e) => { if (theme !== "dark") e.currentTarget.style.borderColor = "var(--border)"; }}
              id="theme-select-dark"
            >
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌑</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Dark Theme</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Deep glassmorphism style</div>
            </div>

            {/* Light Theme Select */}
            <div
              onClick={() => handleThemeChange("light")}
              style={{
                border: `2px solid ${theme === "light" ? "var(--accent-info)" : "var(--border)"}`,
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                textAlign: "center",
                background: "rgba(255,255,255,0.7)",
                transition: "var(--transition)"
              }}
              onMouseEnter={(e) => { if (theme !== "light") e.currentTarget.style.borderColor = "var(--border-hover)"; }}
              onMouseLeave={(e) => { if (theme !== "light") e.currentTarget.style.borderColor = "var(--border)"; }}
              id="theme-select-light"
            >
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>☀️</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Light Theme</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Clean glassmorphic style</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
