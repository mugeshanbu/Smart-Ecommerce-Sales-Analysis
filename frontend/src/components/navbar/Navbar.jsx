import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdSearch, MdNotifications, MdRefresh } from "react-icons/md";

function Navbar() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <header className="navbar">
      {/* Search */}
      <div className="navbar-search">
        <MdSearch style={{ color: "var(--text-muted)", fontSize: 18, flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search orders, products, customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="navbar-search-input"
        />
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {/* Date/Time */}
        <div style={{ textAlign: "right", marginRight: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
            {formatTime(time)}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
            {formatDate(time)}
          </div>
        </div>

        {/* Notifications */}
        <button
          className="navbar-icon-btn"
          id="navbar-notifications-btn"
          title="Notifications"
        >
          <MdNotifications />
          <span className="navbar-badge">3</span>
        </button>

        {/* Refresh */}
        <button
          className="navbar-icon-btn"
          id="navbar-refresh-btn"
          title="Refresh Data"
          onClick={() => window.location.reload()}
        >
          <MdRefresh />
        </button>

        {/* User Profile Link */}
        {user && (
          <Link to="/profile" style={{ textDecoration: "none" }} id="navbar-user-link">
            <div className="navbar-user" id="navbar-user" style={{ cursor: "pointer" }}>
              <div>
                <div className="navbar-user-name">{user.fullName}</div>
                <div className="navbar-user-role">{user.role}</div>
              </div>
              <div className="navbar-avatar">
                {user.avatar || user.fullName?.charAt(0) || "A"}
              </div>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;