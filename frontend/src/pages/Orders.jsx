import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSearch, MdDownload } from "react-icons/md";

const API = "http://localhost:8080/api";

const fallbackOrders = [
  { id: "#ORD-8821", customer: "Priya Sharma", product: "iPhone 15 Pro", category: "Electronics", amount: 134900, status: "Delivered", date: "2024-12-10", payment: "UPI", city: "Mumbai" },
  { id: "#ORD-8820", customer: "Rahul Gupta", product: "Nike Air Max 2024", category: "Sports", amount: 12995, status: "Pending", date: "2024-12-10", payment: "Credit Card", city: "Delhi" },
  { id: "#ORD-8819", customer: "Anjali Singh", product: "Kindle Paperwhite", category: "Electronics", amount: 13999, status: "Processing", date: "2024-12-09", payment: "Net Banking", city: "Bangalore" },
  { id: "#ORD-8818", customer: "Karthik Nair", product: "Samsung 4K TV 55\"", category: "Electronics", amount: 67990, status: "Delivered", date: "2024-12-09", payment: "EMI", city: "Chennai" },
  { id: "#ORD-8817", customer: "Meera Iyer", product: "Yoga Mat Pro", category: "Sports", amount: 2499, status: "Cancelled", date: "2024-12-08", payment: "UPI", city: "Hyderabad" },
  { id: "#ORD-8816", customer: "Amit Patel", product: "MacBook Air M2", category: "Electronics", amount: 114900, status: "Delivered", date: "2024-12-08", payment: "Credit Card", city: "Ahmedabad" },
  { id: "#ORD-8815", customer: "Sneha Reddy", product: "Instant Pot Duo", category: "Kitchen", amount: 8999, status: "Shipped", date: "2024-12-07", payment: "Debit Card", city: "Pune" },
  { id: "#ORD-8814", customer: "Vikram Mehta", product: "Allen Solly Shirt", category: "Clothing", amount: 1799, status: "Delivered", date: "2024-12-07", payment: "COD", city: "Kolkata" },
  { id: "#ORD-8813", customer: "Divya Krishnan", product: "Sony WH-1000XM5", category: "Electronics", amount: 26990, status: "Delivered", date: "2024-12-06", payment: "UPI", city: "Jaipur" },
  { id: "#ORD-8812", customer: "Rohan Malhotra", product: "Philips Air Fryer", category: "Kitchen", amount: 12999, status: "Processing", date: "2024-12-05", payment: "Credit Card", city: "Chandigarh" },
  { id: "#ORD-8811", customer: "Priya Sharma", product: "Adidas Ultraboost", category: "Sports", amount: 15999, status: "Delivered", date: "2024-12-05", payment: "UPI", city: "Mumbai" },
  { id: "#ORD-8810", customer: "Karthik Nair", product: "Levi's 511 Jeans", category: "Clothing", amount: 4499, status: "Returned", date: "2024-12-04", payment: "Credit Card", city: "Chennai" },
];

const statusClass = (status) => {
  const m = {
    Delivered: "badge-delivered",
    Pending: "badge-pending",
    Processing: "badge-processing",
    Cancelled: "badge-cancelled",
    Shipped: "badge-shipped",
    Returned: "badge-returned",
  };
  return `badge ${m[status] || ""}`;
};

const statusDot = (status) => {
  const colors = {
    Delivered: "var(--accent-success)",
    Pending: "var(--accent-warning)",
    Processing: "var(--accent-warning)",
    Cancelled: "var(--accent-danger)",
    Shipped: "var(--accent-info)",
    Returned: "var(--accent-danger)",
  };
  return colors[status] || "var(--text-muted)";
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/orders`)
      .then((r) => { setOrders(r.data.data); setLoading(false); })
      .catch(() => { setOrders(fallbackOrders); setLoading(false); });
  }, []);

  const statuses = ["All", "Delivered", "Pending", "Processing", "Shipped", "Cancelled", "Returned"];

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All" || o.status === status;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  const statusCounts = statuses.slice(1).reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const totalRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Orders</h1>
            <p>Track and manage all customer orders</p>
          </div>
          <button className="btn btn-outline" id="export-orders-btn">
            <MdDownload size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {statuses.slice(1).map((s) => (
          <div
            key={s}
            className="metric-mini-card"
            style={{ flex: "1 1 100px", cursor: "pointer" }}
            onClick={() => setStatus(s === status ? "All" : s)}
          >
            <div
              className="metric-mini-value"
              style={{ color: statusDot(s), fontSize: 18 }}
            >
              {statusCounts[s]}
            </div>
            <div className="metric-mini-label">{s}</div>
          </div>
        ))}
        <div className="metric-mini-card" style={{ flex: "1 1 100px" }}>
          <div className="metric-mini-value" style={{ fontSize: 14 }}>
            ₹{(totalRevenue / 100000).toFixed(1)}L
          </div>
          <div className="metric-mini-label">Delivered Revenue</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">All Orders ({filtered.length})</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="search-bar">
              <MdSearch style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                id="orders-search"
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="select-filter"
              id="orders-status-filter"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>City</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>
                  <span style={{ color: "var(--accent-primary)", fontWeight: 700, fontSize: 12 }}>
                    {o.id}
                  </span>
                </td>
                <td style={{ fontWeight: 500, color: "var(--text-primary)" }}>{o.customer}</td>
                <td>{o.product}</td>
                <td>
                  <span style={{
                    background: "rgba(99,102,241,0.08)",
                    color: "var(--accent-primary)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 500
                  }}>{o.category}</span>
                </td>
                <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  ₹{o.amount.toLocaleString()}
                </td>
                <td>
                  <span style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-secondary)"
                  }}>{o.payment}</span>
                </td>
                <td>{o.city}</td>
                <td>
                  <span className={statusClass(o.status)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: statusDot(o.status), flexShrink: 0
                    }} />
                    {o.status}
                  </span>
                </td>
                <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
