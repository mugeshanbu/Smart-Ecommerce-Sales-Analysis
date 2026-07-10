import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, LineChart, Line
} from "recharts";
import {
  MdAttachMoney, MdShoppingCart, MdPeople, MdInventory2,
  MdTrendingUp, MdReceipt, MdAssessment
} from "react-icons/md";

const API = "http://localhost:8080/api";

const defaultAnalytics = {
  totalRevenue: 2850000,
  totalOrders: 4320,
  totalCustomers: 1874,
  totalProducts: 528,
  avgOrderValue: 6597,
  salesGrowth: 18.4,
  conversionRate: 3.8,
  bounceRate: 41.2,
  avgSessionTime: "4m 32s",
  salesTrend: [
    { month: "Jan", sales: 180000, orders: 320 },
    { month: "Feb", sales: 210000, orders: 380 },
    { month: "Mar", sales: 195000, orders: 350 },
    { month: "Apr", sales: 260000, orders: 460 },
    { month: "May", sales: 310000, orders: 540 },
    { month: "Jun", sales: 280000, orders: 490 },
    { month: "Jul", sales: 340000, orders: 610 },
    { month: "Aug", sales: 390000, orders: 680 },
    { month: "Sep", sales: 370000, orders: 650 },
    { month: "Oct", sales: 420000, orders: 740 },
    { month: "Nov", sales: 480000, orders: 820 },
    { month: "Dec", sales: 415000, orders: 730 },
  ],
  categoryBreakdown: [
    { category: "Electronics", value: 38, color: "#6366f1" },
    { category: "Clothing", value: 24, color: "#8b5cf6" },
    { category: "Home & Kitchen", value: 17, color: "#ec4899" },
    { category: "Books", value: 11, color: "#f59e0b" },
    { category: "Sports", value: 10, color: "#10b981" },
  ],
  topProducts: [
    { name: "iPhone 15 Pro", category: "Electronics", sold: 284, revenue: 3831160, trend: "up" },
    { name: "Samsung Galaxy S24", category: "Electronics", sold: 241, revenue: 1927359, trend: "up" },
    { name: "Nike Air Max 2024", category: "Sports", sold: 412, revenue: 5353940, trend: "up" },
    { name: "Levi's Slim Fit Jeans", category: "Clothing", sold: 638, revenue: 2869100, trend: "down" },
    { name: "Instant Pot Duo", category: "Kitchen", sold: 197, revenue: 1773000, trend: "up" },
  ],
  topCities: [
    { city: "Mumbai", orders: 812, revenue: 7820000 },
    { city: "Delhi", orders: 684, revenue: 6240000 },
    { city: "Bangalore", orders: 591, revenue: 5480000 },
    { city: "Chennai", orders: 472, revenue: 4120000 },
    { city: "Hyderabad", orders: 389, revenue: 3280000 },
    { city: "Pune", orders: 312, revenue: 2640000 },
  ],
  weeklyRevenue: [
    { day: "Mon", revenue: 48000, visitors: 1240 },
    { day: "Tue", revenue: 62000, visitors: 1580 },
    { day: "Wed", revenue: 55000, visitors: 1420 },
    { day: "Thu", revenue: 71000, visitors: 1810 },
    { day: "Fri", revenue: 89000, visitors: 2240 },
    { day: "Sat", revenue: 95000, visitors: 2580 },
    { day: "Sun", revenue: 78000, visitors: 2010 },
  ],
  paymentMethods: [
    { method: "UPI", percentage: 42 },
    { method: "Credit Card", percentage: 28 },
    { method: "Debit Card", percentage: 14 },
    { method: "COD", percentage: 10 },
    { method: "Net Banking", percentage: 6 },
  ]
};

// Animated Number Counter Hook
function AnimatedCounter({ value, duration = 1.2, isCurrency = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }
    
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.max(Math.floor(totalMiliseconds / end), 25);
    
    let timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  const formatCurrency = (val) =>
    val >= 100000
      ? `₹${(val / 100000).toFixed(2)}L`
      : `₹${(val / 1000).toFixed(1)}K`;

  return isCurrency ? <span>{formatCurrency(count)}</span> : <span>{count.toLocaleString()}</span>;
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/dashboard/analytics`)
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        // Safe fallback
        setData(defaultAnalytics);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="loading-container" style={{ height: "70vh" }}>
        <div className="spinner"></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading Enterprise BI Dashboard...</p>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Total Revenue",
      value: data.totalRevenue,
      isCurrency: true,
      icon: <MdAttachMoney size={22} color="#fff" />,
      trend: "up",
      trendValue: `+${data.salesGrowth}%`,
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      isCurrency: false,
      icon: <MdShoppingCart size={22} color="#fff" />,
      trend: "up",
      trendValue: "+12.1%",
      gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    },
    {
      title: "Customers Count",
      value: data.totalCustomers,
      isCurrency: false,
      icon: <MdPeople size={22} color="#fff" />,
      trend: "up",
      trendValue: "+7.8%",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
    },
    {
      title: "Catalog Size",
      value: data.totalProducts,
      isCurrency: false,
      icon: <MdInventory2 size={22} color="#fff" />,
      trend: "up",
      trendValue: "+4.2%",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      title: "Avg Order Value",
      value: Math.round(data.avgOrderValue),
      isCurrency: true,
      icon: <MdReceipt size={22} color="#fff" />,
      trend: "down",
      trendValue: "-1.4%",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    },
    {
      title: "Sales Growth",
      value: data.salesGrowth,
      isPercent: true,
      icon: <MdTrendingUp size={22} color="#fff" />,
      trend: "up",
      trendValue: "+3.2%",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Interactive sales intelligence and business insights platform</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/reports" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary" id="dashboard-export-btn" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MdAssessment size={18} />
                <span>Export Hub</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: "24px" }}>
        {kpiCards.map((card, i) => (
          <motion.div
            key={i}
            className="glass-card"
            whileHover={{ scale: 1.02, translateY: -4 }}
            style={{
              padding: "20px 24px",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              cursor: "pointer"
            }}
          >
            {/* Top Indicator Gradient Bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: card.gradient }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{card.title}</span>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)", marginTop: "6px" }}>
                  {card.isPercent ? (
                    <span>{card.value} %</span>
                  ) : (
                    <AnimatedCounter value={card.value} isCurrency={card.isCurrency} />
                  )}
                </div>
              </div>
              <div style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: card.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
              }}>
                {card.icon}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", fontSize: "11px" }}>
              <span style={{
                color: card.trend === "up" ? "var(--accent-success)" : "var(--accent-danger)",
                fontWeight: 700
              }}>
                {card.trend === "up" ? "▲" : "▼"} {card.trendValue}
              </span>
              <span style={{ color: "var(--text-muted)" }}>since last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid Rows for Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        
        {/* Sales Trend Line Chart */}
        <div className="glass-card" style={{ padding: "24px 28px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--text-secondary)" }}>Sales Trend Timeline</h3>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,17,24,0.9)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="sales" name="Sales (₹)" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth Area Chart */}
        <div className="glass-card" style={{ padding: "24px 28px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--text-secondary)" }}>Revenue Accumulation Area</h3>
          <div style={{ height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesTrend}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,17,24,0.9)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="sales" name="Revenue (₹)" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        
        {/* Category Analysis Doughnut */}
        <div className="glass-card" style={{ padding: "24px", borderRadius: "16px", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "var(--text-secondary)" }}>Category Distribution</h3>
          <div style={{ height: "220px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {data.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#6366f1"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px", fontSize: "10px", marginTop: "10px" }}>
            {data.categoryBreakdown.map((entry, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ color: "var(--text-primary)" }}>{entry.category} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Performance Bar Chart */}
        <div className="glass-card" style={{ padding: "24px", borderRadius: "16px", border: "1px solid var(--border)", gridColumn: "span 2" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--text-secondary)" }}>Product Revenues Leaderboard</h3>
          <div style={{ height: "240px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(17,17,24,0.9)", border: "1px solid var(--border)", borderRadius: "8px" }} />
                <Bar dataKey="revenue" name="Revenue (₹)" fill="#ec4899" radius={[6, 6, 0, 0]}>
                  {data.topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#6366f1" : "#ec4899"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Customer Spend Analysis */}
      <div className="glass-card" style={{ padding: "24px 28px", borderRadius: "16px", border: "1px solid var(--border)" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--text-secondary)" }}>Regional Cities Performance Share</h3>
        <div style={{ height: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topCities} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
              <YAxis dataKey="city" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(17,17,24,0.9)", border: "1px solid var(--border)", borderRadius: "8px" }} />
              <Bar dataKey="revenue" name="Total Revenue (₹)" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;