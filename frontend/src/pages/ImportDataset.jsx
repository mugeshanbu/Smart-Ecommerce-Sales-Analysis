import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { MdCloudUpload, MdCheckCircle, MdHistory, MdListAlt } from "react-icons/md";
import { parseApiError } from "../utils/errorHelper";

const API = "http://localhost:8080/api";

function ImportDataset() {
  const { success, error } = useToast();
  const fileInputRef = useRef(null);

  // States
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch Dataset History
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API}/dataset/history`);
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls", "json"].includes(ext)) {
      error("Unsupported format. Upload CSV, Excel, or JSON only.");
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      error("Please select or drop a file first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API}/dataset/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        success("Dataset compiled successfully! Dashboard updated.");
        setPreview(response.data);
        setFile(null);
        fetchHistory(); // Refresh history
      } else {
        error(response.data.message || "Failed to compile dataset.");
      }
    } catch (err) {
      error(parseApiError(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-in">
      <div className="page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1>Import Dataset</h1>
          <p>Ingest raw CSV, Excel, or JSON e-commerce lists to generate automated business intelligence metrics</p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: "24px",
        alignItems: "start"
      }}>
        {/* Left Side: Upload zone and previews */}
        <div>
          {/* Upload card */}
          <div className="glass-card" style={{ padding: "32px", borderRadius: "16px", border: "1px solid var(--border)", marginBottom: "24px" }}>
            <form onSubmit={handleUploadSubmit}>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{
                  height: "220px",
                  border: `2px dashed ${dragActive ? "var(--accent-primary)" : "var(--border)"}`,
                  background: dragActive ? "rgba(99, 102, 241, 0.05)" : "rgba(255, 255, 255, 0.01)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  padding: "20px",
                  boxShadow: dragActive ? "var(--shadow-glow)" : "none"
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls,.json"
                  style={{ display: "none" }}
                />

                <MdCloudUpload style={{
                  fontSize: "52px",
                  color: dragActive ? "var(--accent-primary)" : "var(--text-secondary)",
                  marginBottom: "16px",
                  transition: "var(--transition)"
                }} />

                <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {file ? file.name : "Drag & drop dataset file here"}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports CSV, Excel (.xlsx/.xls), and JSON"}
                </span>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: "16px", pointerEvents: "none" }}
                >
                  Browse File
                </button>
              </div>

              {file && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="btn btn-primary"
                    style={{ height: "40px", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    {uploading ? (
                      <>
                        <div className="spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }} />
                        <span>Compiling Analysis...</span>
                      </>
                    ) : (
                      <>
                        <MdCloudUpload size={18} />
                        <span>Process Dataset</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Dataset Preview Card */}
          {preview && (
            <div className="glass-card animate-in" style={{ padding: "28px 32px", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-success)" }}>
                <MdCheckCircle size={22} />
                <span>Dataset Compilation Summary</span>
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>FILENAME</div>
                  <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, marginTop: "4px" }}>{preview.dataset.filename}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>ROW COUNT</div>
                  <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, marginTop: "4px" }}>{preview.dataset.rowCount} rows detected</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>TOTAL REVENUE</div>
                  <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, marginTop: "4px" }}>
                    ₹{Number(preview.report.totalRevenue).toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>AVG ORDER VALUE</div>
                  <div style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, marginTop: "4px" }}>
                    ₹{Number(preview.report.avgOrderValue).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Data Preview Table */}
              <div style={{
                background: "rgba(0,0,0,0.2)",
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid var(--border)"
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "10px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MdListAlt />
                  <span>Detected Column Header Mappings:</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  • Mapped product/items headers successfully. <br />
                  • Mapped sales/amount values successfully. <br />
                  • Standardized e-commerce dates to monthly trends. <br />
                  • Categorized listings and deleted duplicate rows.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Upload History list */}
        <div className="glass-card" style={{ padding: "24px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <MdHistory size={20} color="var(--accent-primary)" />
            <span>Upload History</span>
          </h3>

          {loadingHistory ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div className="spinner" style={{ width: "24px", height: "24px", margin: "0 auto 12px" }} />
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--text-muted)", fontSize: "13px" }}>
              No custom datasets uploaded yet. Upload a file to see history.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {history.map((h) => (
                <div key={h.id} style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.01)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px" }}>📂</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {h.filename}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
                    <span>{h.rowCount} rows</span>
                    <span>{h.uploadedAt.substring(0, 10)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImportDataset;
