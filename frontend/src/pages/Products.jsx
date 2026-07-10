import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdSearch, MdAdd, MdStar } from "react-icons/md";

const API = "http://localhost:8080/api";

const fallbackProducts = [
  { id: "P001", name: "iPhone 15 Pro", category: "Electronics", price: 134900, stock: 48, sold: 284, rating: 4.8, status: "In Stock" },
  { id: "P002", name: "Samsung Galaxy S24", category: "Electronics", price: 79999, sold: 241, stock: 72, rating: 4.6, status: "In Stock" },
  { id: "P003", name: "MacBook Air M2", category: "Electronics", price: 114900, sold: 159, stock: 31, rating: 4.9, status: "In Stock" },
  { id: "P004", name: "Sony WH-1000XM5", category: "Electronics", price: 26990, sold: 387, stock: 95, rating: 4.7, status: "In Stock" },
  { id: "P005", name: "Nike Air Max 2024", category: "Sports", price: 12995, sold: 412, stock: 120, rating: 4.5, status: "In Stock" },
  { id: "P006", name: "Adidas Ultraboost", category: "Sports", price: 15999, sold: 298, stock: 84, rating: 4.6, status: "In Stock" },
  { id: "P007", name: "Levi's 511 Slim Jeans", category: "Clothing", price: 4499, sold: 638, stock: 210, rating: 4.3, status: "In Stock" },
  { id: "P008", name: "Allen Solly Formal Shirt", category: "Clothing", price: 1799, sold: 529, stock: 0, rating: 4.2, status: "Out of Stock" },
  { id: "P009", name: "Instant Pot Duo 7-in-1", category: "Kitchen", price: 8999, sold: 197, stock: 43, rating: 4.7, status: "In Stock" },
  { id: "P010", name: "Philips Air Fryer", category: "Kitchen", price: 12999, sold: 312, stock: 15, rating: 4.5, status: "Low Stock" },
  { id: "P011", name: "Kindle Paperwhite", category: "Books & E-readers", price: 13999, sold: 276, stock: 67, rating: 4.8, status: "In Stock" },
  { id: "P012", name: "Yoga Mat Pro 6mm", category: "Sports", price: 2499, sold: 481, stock: 150, rating: 4.4, status: "In Stock" },
];

const badgeClass = (status) => {
  const m = {
    "In Stock": "badge-in-stock",
    "Low Stock": "badge-low-stock",
    "Out of Stock": "badge-out-of-stock",
  };
  return `badge ${m[status] || ""}`;
};

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/products`)
      .then((r) => { setProducts(r.data.data); setLoading(false); })
      .catch(() => { setProducts(fallbackProducts); setLoading(false); });
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  const totalInStock = products.filter((p) => p.status === "In Stock").length;
  const totalLowStock = products.filter((p) => p.status === "Low Stock").length;
  const totalOutOfStock = products.filter((p) => p.status === "Out of Stock").length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Products</h1>
            <p>Manage your product inventory and catalog</p>
          </div>
          <button className="btn btn-primary" id="add-product-btn">
            <MdAdd size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="metric-mini-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
        <div className="metric-mini-card">
          <div className="metric-mini-value">{products.length}</div>
          <div className="metric-mini-label">Total Products</div>
        </div>
        <div className="metric-mini-card">
          <div className="metric-mini-value" style={{ color: "var(--accent-success)" }}>{totalInStock}</div>
          <div className="metric-mini-label">In Stock</div>
        </div>
        <div className="metric-mini-card">
          <div className="metric-mini-value" style={{ color: "var(--accent-warning)" }}>{totalLowStock}</div>
          <div className="metric-mini-label">Low Stock</div>
        </div>
        <div className="metric-mini-card">
          <div className="metric-mini-value" style={{ color: "var(--accent-danger)" }}>{totalOutOfStock}</div>
          <div className="metric-mini-label">Out of Stock</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="table-card-title">Product Catalog ({filtered.length})</div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="search-bar">
              <MdSearch style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                id="product-search"
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="select-filter"
              id="product-category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sold</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ color: "var(--text-muted)", fontSize: 11 }}>{p.id}</td>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.name}</td>
                <td>
                  <span style={{
                    background: "rgba(99,102,241,0.1)",
                    color: "var(--accent-primary)",
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 500
                  }}>{p.category}</span>
                </td>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  ₹{p.price.toLocaleString()}
                </td>
                <td>
                  <span style={{
                    color: p.stock === 0 ? "var(--accent-danger)"
                      : p.stock <= 20 ? "var(--accent-warning)"
                      : "var(--accent-success)",
                    fontWeight: 600
                  }}>{p.stock}</span>
                </td>
                <td style={{ fontWeight: 500 }}>{p.sold.toLocaleString()}</td>
                <td>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <MdStar style={{ color: "#f59e0b" }} size={14} />
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.rating}</span>
                  </span>
                </td>
                <td>
                  <span className={badgeClass(p.status)}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
