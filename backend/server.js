const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");
const { exportReport } = require("./controllers/reports");


const JWT_SECRET = "super_secret_key_12345";

// Mock User database
let dbUser = {
  username: "admin",
  password: "admin123",
  email: "admin@smartshop.com",
  role: "Super Administrator",
  fullName: "Admin User",
  avatar: "A",
  joined: "2024-01-15",
  notifications: {
    emailAlerts: true,
    orderUpdates: true,
    weeklyDigest: false,
    securityAlerts: true
  },
  theme: "dark"
};


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const { dashboardStats, products, customers, orders, analytics } = require("./data/mockData");


// ─── Routes ───────────────────────────────────────────────────────────────────

// ─── Auth Routes ───
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  if (username === dbUser.username && password === dbUser.password) {
    const token = jwt.sign(
      { username: dbUser.username, email: dbUser.email, role: dbUser.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        fullName: dbUser.fullName,
        avatar: dbUser.avatar,
        joined: dbUser.joined,
        notifications: dbUser.notifications,
        theme: dbUser.theme
      }
    });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials. Use admin / admin123." });
  }
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: {
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.role,
      fullName: dbUser.fullName,
      avatar: dbUser.avatar,
      joined: dbUser.joined,
      notifications: dbUser.notifications,
      theme: dbUser.theme
    }
  });
});

app.put("/api/auth/profile", authMiddleware, (req, res) => {
  const { username, email, fullName, notifications, theme } = req.body;

  if (username) dbUser.username = username;
  if (email) dbUser.email = email;
  if (fullName) dbUser.fullName = fullName;
  if (notifications) dbUser.notifications = { ...dbUser.notifications, ...notifications };
  if (theme) dbUser.theme = theme;

  res.json({
    success: true,
    message: "Profile updated successfully",
    user: {
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.role,
      fullName: dbUser.fullName,
      avatar: dbUser.fullName.substring(0, 1).toUpperCase() || "A",
      joined: dbUser.joined,
      notifications: dbUser.notifications,
      theme: dbUser.theme
    }
  });
});

app.put("/api/auth/password", authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Current and new passwords are required." });
  }

  if (currentPassword !== dbUser.password) {
    return res.status(400).json({ success: false, message: "Incorrect current password." });
  }

  dbUser.password = newPassword;
  res.json({ success: true, message: "Password updated successfully." });
});

app.get("/api/reports/:type/export", authMiddleware, exportReport);

app.get("/api/dashboard", (req, res) => {
  res.json({ success: true, data: dashboardStats });
});

app.get("/api/products", (req, res) => {
  res.json({ success: true, data: products });
});

app.get("/api/customers", (req, res) => {
  res.json({ success: true, data: customers });
});

app.get("/api/orders", (req, res) => {
  res.json({ success: true, data: orders });
});

app.get("/api/analytics", (req, res) => {
  res.json({ success: true, data: analytics });
});

app.get("/", (req, res) => {
  res.json({ message: "Smart E-Commerce API is running 🚀", version: "1.0.0" });
});

app.listen(PORT, () => {
  console.log(`✅ Smart E-Commerce API running at http://localhost:${PORT}`);
});
