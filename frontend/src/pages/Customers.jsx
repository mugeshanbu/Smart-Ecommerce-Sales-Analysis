import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSearch, MdPersonAdd } from "react-icons/md";

const API = "http://localhost:8080/api";

const fallbackCustomers = [
  { id: "C001", name: "Priya Sharma", email: "priya.sharma@gmail.com", city: "Mumbai", orders: 12, totalSpend: 248500, tier: "Platinum", joined: "2022-03-15", lastOrder: "2024-12-10" },
  { id: "C002", name: "Rahul Gupta", email: "rahul.gupta@yahoo.com", city: "Delhi", orders: 8, totalSpend: 92000, tier: "Gold", joined: "2022-07-22", lastOrder: "2024-12-10" },
  { id: "C003", name: "Anjali Singh", email: "anjali.singh@gmail.com", city: "Bangalore", orders: 5, totalSpend: 45800, tier: "Silver", joined: "2023-01-10", lastOrder: "2024-12-09" },
  { id: "C004", name: "Karthik Nair", email: "karthik.nair@hotmail.com", city: "Chennai", orders: 19, totalSpend: 387600, tier: "Platinum", joined: "2021-11-05", lastOrder: "2024-12-09" },
  { id: "C005", name: "Meera Iyer", email: "meera.iyer@gmail.com", city: "Hyderabad", orders: 3, totalSpend: 18200, tier: "Bronze", joined: "2023-09-18", lastOrder: "2024-12-08" },
  { id: "C006", name: "Amit Patel", email: "amit.patel@outlook.com", city: "Ahmedabad", orders: 14, totalSpend: 312900, tier: "Platinum", joined: "2022-01-30", lastOrder: "2024-12-08" },
  { id: "C007", name: "Sneha Reddy", email: "sneha.reddy@gmail.com", city: "Pune", orders: 7, totalSpend: 78400, tier: "Gold", joined: "2022-11-12", lastOrder: "2024-12-07" },
  { id: "C008", name: "Vikram Mehta", email: "vikram.mehta@gmail.com", city: "Kolkata", orders: 2, totalSpend: 9800, tier: "Bronze", joined: "2024-06-05", lastOrder: "2024-12-06" },
  { id: "C009", name: "Divya Krishnan", email: "divya.k@gmail.com", city: "Jaipur", orders: 9, totalSpend: 134700, tier: "Gold", joined: "2022-04-20", lastOrder: "2024-12-05" },
  { id: "C010", name: "Rohan Malhotra", email: "rohan.m@yahoo.com", city: "Chandigarh", orders: 6, totalSpend: 56200, tier: "Silver", joined: "2023-02-14", lastOrder: "2024-12-04" },
];

const tierBadge = (tier) => {
  const m = {
    Platinum: "badge-platinum",
    Gold: "badge-gold",
    Silver: "badge-silver",
    Bronze: "badge-bronze",
  };
  return `badge ${m[tier] || ""}`;
};

const avatarColors = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#10b981,#059669)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#06b6d4,#0891b2)",
];

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/customers`)
      .then((r) => { setCustomers(r.data.data); setLoading(false); })
      .catch(() => { setCustomers(fallbackCustomers); setLoading(false); });
  }, []);

  const tiers = ["All", "Platinum", "Gold", "Silver", "Bronze"];

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchTier = tier === "All" || c.tier === tier;
    return matchSearch && matchTier;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  const platinumCount = customers.filter((c) => c.tier === "Platinum").length;
  const totalSpend = customers.reduce((s, c) => s + c.totalSpend, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Customers</h1>
            <p>View and manage your customer base</p>
          </div>
          <button className="btn btn-primary" id="add-customer-btn">
            <MdPersonAdd size={18} /> Add Customer
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="metric-mini-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
        <div className="metric-mini-card">
          <div className="metric-mini-value">{customers.length}</div>
          <div className="metric-mini-label">Total Customers</div>
        </div>
        <div className="metric-mini-card">
          <div className="metric-mini-value" style={{ color: "var(--accent-secondary)" }}>{platinumCount}</div>
          <div className="metric-mini-label">Platinum Members</div>
        </div>
        <div className="metric-mini-card">
          <div className="metric-mini-value">
            ₹{(totalSpend / 100000).toFixed(1)}L
          </div>
          <div className="metric-mini-label">Total Revenue</div>
        </div>
        <div className="metric-mini-card">
          <div className="metric-mini-value">
            ₹{Math.round(totalSpend / customers.length).toLocaleString()}
          </div>
          <div className="metric-mini-label">Avg Lifetime Value</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Customer List ({filtered.length})</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="search-bar">
              <MdSearch style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                id="customer-search"
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="select-filter"
              id="customer-tier-filter"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            >
              {tiers.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>City</th>
              <th>Orders</th>
              <th>Total Spend</th>
              <th>Tier</th>
              <th>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: avatarColors[i % avatarColors.length],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0
                    }}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.id}</div>
                    </div>
                  </div>
                </td>
                <td>{c.email}</td>
                <td>{c.city}</td>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.orders}</td>
                <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  ₹{c.totalSpend.toLocaleString()}
                </td>
                <td>
                  <span className={tierBadge(c.tier)}>
                    {c.tier === "Platinum" ? "💎" : c.tier === "Gold" ? "🥇" : c.tier === "Silver" ? "🥈" : "🥉"} {c.tier}
                  </span>
                </td>
                <td>{c.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
