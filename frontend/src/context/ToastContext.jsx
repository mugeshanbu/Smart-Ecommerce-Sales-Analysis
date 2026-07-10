import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    toast: addToast,
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="toast-container" style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none"
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item animate-in`}
            style={{
              pointerEvents: "auto",
              minWidth: "280px",
              maxWidth: "400px",
              padding: "14px 20px",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              color: "var(--text-primary)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              fontSize: "13px",
              fontWeight: 500,
              background: t.type === "success" 
                ? "rgba(16, 185, 129, 0.15)" 
                : t.type === "error" 
                ? "rgba(239, 68, 68, 0.15)"
                : t.type === "warning" 
                ? "rgba(245, 158, 11, 0.15)" 
                : "rgba(99, 102, 241, 0.15)",
              borderColor: t.type === "success" 
                ? "rgba(16, 185, 129, 0.3)" 
                : t.type === "error" 
                ? "rgba(239, 68, 68, 0.3)"
                : t.type === "warning" 
                ? "rgba(245, 158, 11, 0.3)" 
                : "rgba(99, 102, 241, 0.3)",
              animation: "fadeInUp 0.3s ease forwards"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>
                {t.type === "success" && "✅"}
                {t.type === "error" && "❌"}
                {t.type === "warning" && "⚠️"}
                {t.type === "info" && "ℹ️"}
              </span>
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "16px",
                padding: "0 4px",
                display: "flex",
                alignItems: "center",
                opacity: 0.7
              }}
              onMouseEnter={(e) => e.target.style.opacity = 1}
              onMouseLeave={(e) => e.target.style.opacity = 0.7}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
