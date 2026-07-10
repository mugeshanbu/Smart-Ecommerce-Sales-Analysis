import React, { useState } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { MdDownload, MdFilePresent, MdBarChart, MdPeople, MdInventory2, MdShoppingCart, MdTrendingUp } from "react-icons/md";

const API = "http://localhost:8080/api";

const reportsList = [
  {
    icon: <MdBarChart size={24} color="#6366f1" />,
    iconBg: "rgba(99,102,241,0.12)",
    title: "Monthly Sales Report",
    description: "Complete sales breakdown by product, category, and region",
    period: "December 2024",
    format: "PDF",
    size: "2.4 MB",
    status: "Ready",
    type: "sales",
    apiFormat: "pdf"
  },
  {
    icon: <MdPeople size={24} color="#10b981" />,
    iconBg: "rgba(16,185,129,0.12)",
    title: "Customer Analytics Report",
    description: "Customer acquisition, retention, and lifetime value analysis",
    period: "Q4 2024",
    format: "Excel",
    size: "1.8 MB",
    status: "Ready",
    type: "customer",
    apiFormat: "xlsx"
  },
  {
    icon: <MdInventory2 size={24} color="#f59e0b" />,
    iconBg: "rgba(245,158,11,0.12)",
    title: "Inventory Status Report",
    description: "Stock levels, reorder alerts, and product movement analysis",
    period: "December 2024",
    format: "CSV",
    size: "856 KB",
    status: "Ready",
    type: "product",
    apiFormat: "csv"
  },
  {
    icon: <MdShoppingCart size={24} color="#ec4899" />,
    iconBg: "rgba(236,72,153,0.12)",
    title: "Orders Summary Report",
    description: "All orders with status, payment, and delivery breakdown",
    period: "December 2024",
    format: "PDF",
    size: "3.1 MB",
    status: "Ready",
    type: "sales",
    apiFormat: "pdf"
  },
  {
    icon: <MdTrendingUp size={24} color="#06b6d4" />,
    iconBg: "rgba(6,182,212,0.12)",
    title: "Revenue Trend Report",
    description: "Year-over-year revenue growth with projections",
    period: "FY 2024",
    format: "PDF",
    size: "4.2 MB",
    status: "Ready",
    type: "sales",
    apiFormat: "pdf"
  },
  {
    icon: <MdFilePresent size={24} color="#8b5cf6" />,
    iconBg: "rgba(139,92,246,0.12)",
    title: "Annual Performance Report",
    description: "Complete business performance overview for the fiscal year",
    period: "FY 2024",
    format: "PDF",
    size: "8.7 MB",
    status: "Generating",
    type: "dashboard",
    apiFormat: "pdf"
  },
];

const summaryData = [
  { label: "Total Revenue (FY2024)", value: "₹2.85 Crore", change: "+18.4%", up: true },
  { label: "Total Orders", value: "4,320", change: "+12.1%", up: true },
  { label: "New Customers", value: "1,874", change: "+7.8%", up: true },
  { label: "Return Rate", value: "3.2%", change: "-0.8%", up: false },
  { label: "Avg Order Value", value: "₹6,597", change: "-1.4%", up: false },
  { label: "Top Category", value: "Electronics", change: "38% share", up: true },
];

function Reports() {
  const { success, error } = useToast();
  const [downloading, setDownloading] = useState(null);
  const [showQuickExporter, setShowQuickExporter] = useState(false);

  // Quick Exporter States
  const [expType, setExpType] = useState("sales");
  const [expFormat, setExpFormat] = useState("pdf");
  const [expSaving, setExpSaving] = useState(false);

  const handleDownload = async (i, type, format, title) => {
    setDownloading(i);
    try {
      const response = await axios.get(`${API}/reports/${type}/export`, {
        params: { format },
        responseType: "blob"
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;

      let ext = "pdf";
      if (format === "excel" || format === "xlsx") ext = "xlsx";
      else if (format === "csv") ext = "csv";

      link.setAttribute("download", `${type}_report_${Date.now()}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      success(`"${title}" exported and downloaded successfully!`);
    } catch (err) {
      console.error("Export download error:", err);
      error(`Failed to export "${title}". Make sure backend is running.`);
    } finally {
      setDownloading(null);
    }
  };

  const handleQuickExportSubmit = async (e) => {
    e.preventDefault();
    setExpSaving(true);
    let title = expType.charAt(0).toUpperCase() + expType.slice(1) + " Report";
    try {
      const response = await axios.get(`${API}/reports/${expType}/export`, {
        params: { format: expFormat },
        responseType: "blob"
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      
      let ext = "pdf";
      if (expFormat === "excel" || expFormat === "xlsx") ext = "xlsx";
      else if (expFormat === "csv") ext = "csv";

      link.setAttribute("download", `${expType}_quick_export_${Date.now()}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      success(`Quick ${title} (${expFormat.toUpperCase()}) saved!`);
      setShowQuickExporter(false);
    } catch (err) {
      console.error("Quick export error:", err);
      error("Quick export generation failed.");
    } finally {
      setExpSaving(false);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Reports</h1>
            <p>Download and review business performance reports</p>
          </div>
          <button 
            className="btn btn-primary" 
            id="generate-report-btn"
            onClick={() => setShowQuickExporter(!showQuickExporter)}
          >
            <MdFilePresent size={16} /> 
            {showQuickExporter ? "Hide Generator" : "Generate Custom Report"}
          </button>
        </div>
      </div>

      {/* Custom Quick Exporter Card */}
      {showQuickExporter && (
        <div className="glass-card animate-in" style={{ padding: "24px 32px", borderRadius: "16px", border: "1px solid var(--border)", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "18px" }}>Custom Report Generator</h3>
          <form onSubmit={handleQuickExportSubmit} style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: 1, minWidth: "160px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Report Category</label>
              <select 
                value={expType} 
                onChange={(e) => setExpType(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", marginTop: "6px" }}
              >
                <option value="sales">Sales & Revenue</option>
                <option value="customer">Customer Metrics</option>
                <option value="product">Product Performance</option>
                <option value="dashboard">Analytics Intelligence Summary</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: "140px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Export Format</label>
              <select 
                value={expFormat} 
                onChange={(e) => setExpFormat(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", marginTop: "6px" }}
              >
                <option value="pdf">Adobe PDF (.pdf)</option>
                <option value="xlsx">MS Excel Worksheet (.xlsx)</option>
                <option value="csv">Comma Separated Values (.csv)</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={expSaving}
              className="btn btn-primary"
              style={{ height: "42px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              {expSaving ? (
                <>
                  <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <MdDownload size={16} />
                  <span>Download Report</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Summary Table */}
      <div className="table-card" style={{ marginBottom: 24 }}>
        <div className="table-card-header">
          <div className="table-card-title">FY 2024 Key Metrics Summary</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Change vs Last Year</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{row.label}</td>
                <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>{row.value}</td>
                <td>
                  <span style={{
                    color: row.up ? "var(--accent-success)" : "var(--accent-danger)",
                    fontWeight: 600,
                    fontSize: 13,
                  }}>
                    {row.up ? "▲" : "▼"} {row.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reports List */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Available Reports</div>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{reportsList.length} reports</span>
        </div>
        {reportsList.map((report, i) => (
          <div key={i} className="report-item">
            <div
              className="report-icon"
              style={{ background: report.iconBg }}
            >
              {report.icon}
            </div>
            <div className="report-info">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="report-title">{report.title}</div>
                {report.status === "Generating" ? (
                  <span className="badge badge-pending" style={{ background: "rgba(245,158,11,0.15)", color: "var(--accent-warning)" }}>⏳ Generating</span>
                ) : (
                  <span className="badge badge-delivered" style={{ background: "rgba(16,185,129,0.15)", color: "var(--accent-success)" }}>✓ Ready</span>
                )}
              </div>
              <div className="report-meta">
                {report.description} · {report.period} · {report.format} · {report.size}
              </div>
            </div>
            <button
              className={`btn btn-outline btn-sm`}
              id={`download-report-${i}`}
              disabled={report.status !== "Ready" || downloading === i}
              onClick={() => handleDownload(i, report.type, report.apiFormat, report.title)}
              style={{
                opacity: report.status !== "Ready" ? 0.5 : 1,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {downloading === i ? (
                <>
                  <div className="spinner" style={{ width: "12px", height: "12px", borderWidth: "1.5px" }} />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <MdDownload size={15} />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;
