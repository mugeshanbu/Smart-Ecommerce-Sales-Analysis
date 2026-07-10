import React from "react";
import {
  MdTrendingUp, MdTrendingDown
} from "react-icons/md";

function DashboardCard({ title, value, icon, trend, trendValue, gradient }) {
  const isUp = trend === "up";

  return (
    <div
      className="kpi-card animate-in"
      style={{ "--card-gradient": gradient }}
    >
      <div className="kpi-card-header">
        <span className="kpi-card-label">{title}</span>
        <div className="kpi-card-icon" style={{ background: gradient }}>
          {icon}
        </div>
      </div>
      <div className="kpi-card-value">{value}</div>
      {trendValue && (
        <div className={`kpi-card-trend ${isUp ? "trend-up" : "trend-down"}`}>
          {isUp ? <MdTrendingUp size={16} /> : <MdTrendingDown size={16} />}
          <span>{trendValue}</span>
          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}

export default DashboardCard;