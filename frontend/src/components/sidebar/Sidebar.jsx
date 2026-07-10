import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  MdDashboard, MdInventory2, MdPeople, MdShoppingCart,
  MdBarChart, MdDescription, MdSettings,
  MdLogout, MdCloudUpload
} from "react-icons/md";

const navItems = [
  {
    section: "Main",
    links: [
      { to: "/", label: "Dashboard", icon: <MdDashboard />, badge: null },
      { to: "/orders", label: "Orders", icon: <MdShoppingCart />, badge: "4" },
      { to: "/products", label: "Products", icon: <MdInventory2 />, badge: null },
      { to: "/customers", label: "Customers", icon: <MdPeople />, badge: null },
      { to: "/import-dataset", label: "Import Dataset", icon: <MdCloudUpload />, badge: null },
    ],
  },
  {
    section: "Insights",
    links: [
      { to: "/analytics", label: "Analytics", icon: <MdBarChart />, badge: null },
      { to: "/reports", label: "Reports", icon: <MdDescription />, badge: null },
    ],
  },
];

function Sidebar() {
  const { logout } = useAuth();
  const { info } = useToast();

  const handleLogout = () => {
    logout();
    info("You have logged out successfully.");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🛒</div>
        <div>
          <div className="sidebar-logo-text">SmartShop</div>
          <div className="sidebar-logo-sub">Sales Analytics</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            {group.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                style={{ textDecoration: "none" }}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span style={{ flex: 1 }}>{link.label}</span>
                {link.badge && (
                  <span className="sidebar-link-badge">{link.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          style={{ marginBottom: "4px", textDecoration: "none" }}
        >
          <span className="sidebar-link-icon"><MdSettings /></span>
          <span>Settings</span>
        </NavLink>
        <div
          onClick={handleLogout}
          className="sidebar-link"
          style={{ color: "var(--accent-danger)", cursor: "pointer" }}
          id="sidebar-logout-btn"
        >
          <span className="sidebar-link-icon"><MdLogout /></span>
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;