import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { useToast } from "../context/ToastContext";
import { MdDownload } from "react-icons/md";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
);

const API = "http://localhost:8080/api";

const fallbackAnalytics = {
  weeklyRevenue: [
    { day: "Mon", revenue: 48000, visitors: 1240 },
    { day: "Tue", revenue: 62000, visitors: 1580 },
    { day: "Wed", revenue: 55000, visitors: 1420 },
    { day: "Thu", revenue: 71000, visitors: 1810 },
    { day: "Fri", revenue: 89000, visitors: 2240 },
    { day: "Sat", revenue: 95000, visitors: 2580 },
    { day: "Sun", revenue: 78000, visitors: 2010 },
  ],
  conversionRate: 3.8,
  avgSessionTime: "4m 32s",
  bounceRate: 41.2,
  topCities: [
    { city: "Mumbai", orders: 812, revenue: 7820000 },
    { city: "Delhi", orders: 684, revenue: 6240000 },
    { city: "Bangalore", orders: 591, revenue: 5480000 },
    { city: "Chennai", orders: 472, revenue: 4120000 },
    { city: "Hyderabad", orders: 389, revenue: 3280000 },
    { city: "Pune", orders: 312, revenue: 2640000 },
  ],
  monthlyGrowth: [
    { month: "Jul", growth: 12.4 },
    { month: "Aug", growth: 18.7 },
    { month: "Sep", growth: 15.2 },
    { month: "Oct", growth: 22.1 },
    { month: "Nov", growth: 28.9 },
    { month: "Dec", growth: 18.4 },
  ],
  paymentMethods: [
    { method: "UPI", percentage: 42 },
    { method: "Credit Card", percentage: 28 },
    { method: "Debit Card", percentage: 14 },
    { method: "COD", percentage: 10 },
    { method: "Net Banking", percentage: 6 },
  ],
};

const chartOptions = (yCallback) => ({
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(17, 17, 24, 0.95)",
      titleColor: "#f1f5f9",
      bodyColor: "#94a3b8",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      padding: 12,
      ...(yCallback ? { callbacks: { label: yCallback } } : {}),
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#475569", font: { size: 11 } },
    },
    y: {
      grid: { color: "rgba(255,255,255,0.04)", drawBorder: false },
      ticks: { color: "#475569", font: { size: 11 }, ...(yCallback ? { callback: (v) => yCallback({ parsed: { y: v } }).replace(" ", "") } : {}) },
    },
  },
});

function Analytics() {
  const { success, error } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Export panel states
  const [expType, setExpType] = useState("sales");
  const [expFormat, setExpFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState("30days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    axios.get(`${API}/analytics`)
      .then((r) => { setData(r.data.data); setLoading(false); })
      .catch(() => { setData(fallbackAnalytics); setLoading(false); });
  }, []);

  const handleExportSubmit = async (e) => {
    e.preventDefault();
    setExporting(true);

    const title = expType.charAt(0).toUpperCase() + expType.slice(1) + " Report";
    try {
      const response = await axios.get(`${API}/reports/${expType}/export`, {
        params: {
          format: expFormat,
          dateRange,
          startDate,
          endDate
        },
        responseType: "blob"
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;

      let ext = "pdf";
      if (expFormat === "excel" || expFormat === "xlsx") ext = "xlsx";
      else if (expFormat === "csv") ext = "csv";

      link.setAttribute("download", `${expType}_report_${Date.now()}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      success(`Successfully exported ${title} in ${expFormat.toUpperCase()} format!`);
    } catch (err) {
      console.error("Export failure:", err);
      error(`Failed to export ${title}. Please check server connection.`);
    } finally {
      setExporting(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.topCities.map((c) => c.revenue));

  const weeklyData = {
    labels: data.weeklyRevenue.map((d) => d.day),
    datasets: [
      {
        label: "Revenue",
        data: data.weeklyRevenue.map((d) => d.revenue),
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const g = canvas.createLinearGradient(0, 0, 0, 260);
          g.addColorStop(0, "rgba(99,102,241,0.8)");
          g.addColorStop(1, "rgba(99,102,241,0.2)");
          return g;
        },
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const growthData = {
    labels: data.monthlyGrowth.map((d) => d.month),
    datasets: [
      {
        label: "Growth %",
        data: data.monthlyGrowth.map((d) => d.growth),
        borderColor: "#10b981",
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const g = canvas.createLinearGradient(0, 0, 0, 220);
          g.addColorStop(0, "rgba(16,185,129,0.3)");
          g.addColorStop(1, "rgba(16,185,129,0)");
          return g;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const paymentColors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Deep insights into your store performance and trends</p>
        </div>
      </div>

      {/* Export Report Card */}
      <div className="glass-card animate-in" style={{ padding: "24px 32px", borderRadius: "16px", border: "1px solid var(--border)", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "18px", color: "var(--text-primary)" }}>Export Business Intelligence Reports</h3>
        <form onSubmit={handleExportSubmit} style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          
          {/* Report Type */}
          <div style={{ flex: 1, minWidth: "160px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Report Type</label>
            <select 
              value={expType} 
              onChange={(e) => setExpType(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", marginTop: "6px" }}
              id="analytics-export-type"
            >
              <option value="sales">Sales Analysis Report</option>
              <option value="customer">Customer Spends & Loyalty Report</option>
              <option value="product">Product Performance & Catalog</option>
              <option value="dashboard">Full Business Dashboard Summary</option>
            </select>
          </div>

          {/* Date Range Selection */}
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", marginTop: "6px" }}
              id="analytics-export-range"
            >
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="ytd">Year to Date</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Custom Date Picker Inputs */}
          {dateRange === "custom" && (
            <>
              <div style={{ minWidth: "130px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", marginTop: "6px" }}
                  id="analytics-export-start"
                />
              </div>
              <div style={{ minWidth: "130px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>End Date</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", marginTop: "6px" }}
                  id="analytics-export-end"
                />
              </div>
            </>
          )}

          {/* Export Format */}
          <div style={{ flex: 1, minWidth: "120px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Format</label>
            <select 
              value={expFormat} 
              onChange={(e) => setExpFormat(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", marginTop: "6px" }}
              id="analytics-export-format"
            >
              <option value="pdf">Adobe PDF (.pdf)</option>
              <option value="excel">MS Excel Worksheet (.xlsx)</option>
              <option value="csv">Raw Comma Separated (.csv)</option>
            </select>
          </div>

          {/* Submit Action */}
          <button 
            type="submit" 
            disabled={exporting}
            className="btn btn-primary"
            style={{ height: "42px", display: "flex", alignItems: "center", gap: "8px" }}
            id="analytics-export-submit"
          >
            {exporting ? (
              <>
                <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <MdDownload size={16} />
                <span>Export Report</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Key Metrics */}
      <div className="metric-mini-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
        <div className="metric-mini-card animate-in">
          <div className="metric-mini-value" style={{ color: "var(--accent-primary)" }}>
            {data.conversionRate}%
          </div>
          <div className="metric-mini-label">Conversion Rate</div>
        </div>
        <div className="metric-mini-card animate-in">
          <div className="metric-mini-value" style={{ color: "var(--accent-success)" }}>
            {data.avgSessionTime}
          </div>
          <div className="metric-mini-label">Avg Session Time</div>
        </div>
        <div className="metric-mini-card animate-in">
          <div className="metric-mini-value" style={{ color: "var(--accent-warning)" }}>
            {data.bounceRate}%
          </div>
          <div className="metric-mini-label">Bounce Rate</div>
        </div>
        <div className="metric-mini-card animate-in">
          <div className="metric-mini-value">
            ₹{(data.topCities.reduce((s, c) => s + c.revenue, 0) / 1000000).toFixed(1)}M
          </div>
          <div className="metric-mini-label">Total City Revenue</div>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-grid" style={{ marginBottom: 24 }}>
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Weekly Revenue</div>
              <div className="chart-card-subtitle">Day-by-day performance</div>
            </div>
          </div>
          <Bar
            data={weeklyData}
            options={{
              ...chartOptions((ctx) => ` ₹${(ctx.parsed.y / 1000).toFixed(0)}K`),
              maintainAspectRatio: true,
            }}
          />
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Revenue Growth Trend</div>
              <div className="chart-card-subtitle">Month-over-month growth %</div>
            </div>
          </div>
          <Line
            data={growthData}
            options={{
              ...chartOptions((ctx) => ` ${ctx.parsed.y}%`),
              maintainAspectRatio: true,
            }}
          />
        </div>
      </div>

      {/* Bottom: Cities + Payment Methods */}
      <div className="analytics-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Top Cities by Revenue</div>
          </div>
          {data.topCities.map((c) => (
            <div key={c.city} className="city-bar-item animate-in">
              <div className="city-bar-header">
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.city}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                  ₹{(c.revenue / 100000).toFixed(1)}L · {c.orders} orders
                </span>
              </div>
              <div className="city-bar-track">
                <div
                  className="city-bar-fill"
                  style={{ width: `${(c.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">Payment Methods</div>
            <div className="chart-card-subtitle">Customer preference breakdown</div>
          </div>
          {data.paymentMethods.map((p, i) => (
            <div key={p.method} style={{ marginBottom: 16 }} className="animate-in">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: paymentColors[i], flexShrink: 0
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                    {p.method}
                  </span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                  {p.percentage}%
                </span>
              </div>
              <div style={{
                height: 8, background: "var(--bg-card)",
                borderRadius: 4, overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${p.percentage}%`,
                  background: paymentColors[i],
                  borderRadius: 4,
                  transition: "width 0.8s ease"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
