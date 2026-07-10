const PDFDocument = require("pdfkit");
const XLSX = require("xlsx");
const { dashboardStats, products, customers, orders, analytics } = require("../data/mockData");

// Helper: Format Currency in INR
const formatINR = (val) => {
  return "Rs. " + Number(val).toLocaleString("en-IN");
};

// Helper: Build CSV string from JSON array
const buildCSV = (headers, rows, fields) => {
  const csvRows = [];
  csvRows.push(headers.join(","));
  for (const row of rows) {
    const values = fields.map(field => {
      const val = row[field] !== undefined ? row[field] : "";
      const escaped = ("" + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  return csvRows.join("\n");
};

// ─── Export Service ──────────────────────────────────────────────────────────
const exportReport = (req, res) => {
  const { type } = req.params; // sales, customer, product, dashboard
  const format = (req.query.format || "pdf").toLowerCase(); // pdf, excel, csv

  let filename = `${type}_report_${Date.now()}`;
  let reportTitle = "";
  if (type === "sales") reportTitle = "Sales Analysis Report";
  else if (type === "customer") reportTitle = "Customer Loyalty & Spend Report";
  else if (type === "product") reportTitle = "Product Inventory & Performance Report";
  else reportTitle = "Analytics Dashboard Intelligence Report";

  // 1. CSV FORMAT EXPORT
  if (format === "csv") {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);

    let csvData = "";
    if (type === "sales") {
      csvData = buildCSV(
        ["Order ID", "Customer", "Product", "Amount", "Status", "Date", "Payment Method", "City"],
        orders,
        ["id", "customer", "product", "amount", "status", "date", "payment", "city"]
      );
    } else if (type === "customer") {
      csvData = buildCSV(
        ["Customer ID", "Name", "Email", "City", "Orders Count", "Total Spend (Rs.)", "Loyalty Tier", "Joined Date", "Last Order"],
        customers,
        ["id", "name", "email", "city", "orders", "totalSpend", "tier", "joined", "lastOrder"]
      );
    } else if (type === "product") {
      csvData = buildCSV(
        ["Product ID", "Name", "Category", "Price (Rs.)", "Stock", "Sold", "Rating", "Status"],
        products,
        ["id", "name", "category", "price", "stock", "sold", "rating", "status"]
      );
    } else {
      // dashboard/analytics
      csvData = buildCSV(
        ["Day", "Revenue (Rs.)", "Visitors"],
        analytics.weeklyRevenue,
        ["day", "revenue", "visitors"]
      );
    }
    return res.send(csvData);
  }

  // 2. EXCEL (XLSX) FORMAT EXPORT
  if (format === "excel" || format === "xlsx") {
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);

    const wb = XLSX.utils.book_new();

    if (type === "sales") {
      // Sheet 1: Recent Orders
      const wsOrders = XLSX.utils.json_to_sheet(orders);
      XLSX.utils.book_append_sheet(wb, wsOrders, "Orders Data");

      // Sheet 2: Monthly Trends
      const wsTrends = XLSX.utils.json_to_sheet(dashboardStats.salesTrend);
      XLSX.utils.book_append_sheet(wb, wsTrends, "Sales Monthly Trends");
    } else if (type === "customer") {
      const wsCustomers = XLSX.utils.json_to_sheet(customers);
      XLSX.utils.book_append_sheet(wb, wsCustomers, "Customers Database");
    } else if (type === "product") {
      const wsCatalog = XLSX.utils.json_to_sheet(products);
      XLSX.utils.book_append_sheet(wb, wsCatalog, "Products Catalog");

      const wsTop = XLSX.utils.json_to_sheet(dashboardStats.topProducts);
      XLSX.utils.book_append_sheet(wb, wsTop, "Top Performing Products");
    } else {
      // dashboard/analytics
      const wsWeekly = XLSX.utils.json_to_sheet(analytics.weeklyRevenue);
      XLSX.utils.book_append_sheet(wb, wsWeekly, "Weekly Performance");

      const wsCities = XLSX.utils.json_to_sheet(analytics.topCities);
      XLSX.utils.book_append_sheet(wb, wsCities, "City Revenue Share");

      const wsPayments = XLSX.utils.json_to_sheet(analytics.paymentMethods);
      XLSX.utils.book_append_sheet(wb, wsPayments, "Payment Methods Preference");
    }

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return res.send(buffer);
  }

  // 3. PDF FORMAT EXPORT (DEFAULT)
  if (format === "pdf") {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    // Header Title
    doc.fillColor("#1e1b4b").rect(0, 0, 612, 100).fill();
    doc.fillColor("#ffffff").fontSize(20).font("Helvetica-Bold").text("SMARTSHOP BI PLATFORM", 40, 28);
    doc.fontSize(12).font("Helvetica").text(reportTitle, 40, 56);
    doc.fontSize(10).fillColor("#a5b4fc").text(`Report Compiled: ${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString("en-IN")}`, 40, 74);

    let y = 130;

    if (type === "sales") {
      // Summary KPIs Box
      doc.fillColor("#f8fafc").rect(40, y, 532, 70).fill().strokeColor("#e2e8f0").stroke();
      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("TOTAL SALES REVENUE", 60, y + 15);
      doc.fontSize(16).fillColor("#4f46e5").text(formatINR(dashboardStats.totalSales), 60, y + 30);

      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("TOTAL COMPLETED ORDERS", 240, y + 15);
      doc.fontSize(16).fillColor("#059669").text(String(dashboardStats.totalOrders), 240, y + 30);

      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("AVERAGE ORDER VALUE", 410, y + 15);
      doc.fontSize(16).fillColor("#d97706").text(formatINR(dashboardStats.avgOrderValue), 410, y + 30);

      y += 100;

      // Table 1: Recent Orders
      doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("Recent Completed Orders Details", 40, y);
      y += 18;

      // Header row
      doc.fillColor("#f1f5f9").rect(40, y, 532, 20).fill();
      doc.fillColor("#334155").fontSize(9).font("Helvetica-Bold");
      doc.text("Order ID", 45, y + 6);
      doc.text("Customer Name", 110, y + 6);
      doc.text("Product", 210, y + 6);
      doc.text("Date", 340, y + 6);
      doc.text("Status", 420, y + 6);
      doc.text("Amount (Rs.)", 500, y + 6, { width: 68, align: "right" });
      y += 20;

      doc.font("Helvetica").fillColor("#475569");
      orders.forEach((ord) => {
        doc.text(ord.id, 45, y + 5);
        doc.text(ord.customer, 110, y + 5);
        doc.text(ord.product, 210, y + 5, { width: 120, height: 12, ellipsis: true });
        doc.text(ord.date, 340, y + 5);
        doc.text(ord.status, 420, y + 5);
        doc.text(formatINR(ord.amount).replace("Rs. ", ""), 500, y + 5, { width: 68, align: "right" });
        y += 16;
      });

      y += 24;

      // Check height for trends
      if (y > 550) { doc.addPage(); y = 40; }

      doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("Monthly Sales Performance Trends", 40, y);
      y += 18;

      doc.fillColor("#f1f5f9").rect(40, y, 532, 20).fill();
      doc.fillColor("#334155").fontSize(9).font("Helvetica-Bold");
      doc.text("Month", 60, y + 6);
      doc.text("Orders Volume", 240, y + 6);
      doc.text("Gross Revenue (Rs.)", 420, y + 6, { width: 130, align: "right" });
      y += 20;

      doc.font("Helvetica").fillColor("#475569");
      dashboardStats.salesTrend.forEach((trend) => {
        doc.text(trend.month, 60, y + 5);
        doc.text(String(trend.orders), 240, y + 5);
        doc.text(formatINR(trend.sales).replace("Rs. ", ""), 420, y + 5, { width: 130, align: "right" });
        y += 15;
      });

    } else if (type === "customer") {
      // Summary KPIs Box
      doc.fillColor("#f8fafc").rect(40, y, 532, 50).fill().strokeColor("#e2e8f0").stroke();
      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("TOTAL REGISTERED CUSTOMERS", 60, y + 18);
      doc.fontSize(16).fillColor("#4f46e5").text(String(dashboardStats.totalCustomers), 60, y + 30);
      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("ACTIVE RETENTION RATE", 350, y + 18);
      doc.fontSize(16).fillColor("#10b981").text("96.8 %", 350, y + 30);

      y += 75;

      doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("Customer Demographics & Total Spend Analysis", 40, y);
      y += 18;

      doc.fillColor("#f1f5f9").rect(40, y, 532, 20).fill();
      doc.fillColor("#334155").fontSize(9).font("Helvetica-Bold");
      doc.text("ID", 45, y + 6);
      doc.text("Customer", 90, y + 6);
      doc.text("Email Address", 180, y + 6);
      doc.text("Loyalty Tier", 340, y + 6);
      doc.text("Orders", 430, y + 6);
      doc.text("Total Spend (Rs.)", 490, y + 6, { width: 78, align: "right" });
      y += 20;

      doc.font("Helvetica").fillColor("#475569");
      customers.forEach((cust) => {
        doc.text(cust.id, 45, y + 5);
        doc.text(cust.name, 90, y + 5);
        doc.text(cust.email, 180, y + 5, { width: 150, height: 12, ellipsis: true });
        doc.text(cust.tier, 340, y + 5);
        doc.text(String(cust.orders), 430, y + 5);
        doc.text(formatINR(cust.totalSpend).replace("Rs. ", ""), 490, y + 5, { width: 78, align: "right" });
        y += 16;
      });

    } else if (type === "product") {
      // Summary KPIs Box
      doc.fillColor("#f8fafc").rect(40, y, 532, 50).fill().strokeColor("#e2e8f0").stroke();
      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("CATALOG ACTIVE PRODUCTS", 60, y + 18);
      doc.fontSize(16).fillColor("#4f46e5").text(String(dashboardStats.totalProducts), 60, y + 30);
      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("TOP CATEGORY SHARE", 350, y + 18);
      doc.fontSize(16).fillColor("#8b5cf6").text("Electronics (38%)", 350, y + 30);

      y += 75;

      doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("Top Product Revenues", 40, y);
      y += 18;

      doc.fillColor("#f1f5f9").rect(40, y, 532, 20).fill();
      doc.fillColor("#334155").fontSize(9).font("Helvetica-Bold");
      doc.text("Product Name", 50, y + 6);
      doc.text("Category", 230, y + 6);
      doc.text("Units Sold", 370, y + 6);
      doc.text("Revenue Share (Rs.)", 460, y + 6, { width: 108, align: "right" });
      y += 20;

      doc.font("Helvetica").fillColor("#475569");
      dashboardStats.topProducts.forEach((p) => {
        doc.text(p.name, 50, y + 5);
        doc.text(p.category, 230, y + 5);
        doc.text(String(p.sold), 370, y + 5);
        doc.text(formatINR(p.revenue).replace("Rs. ", ""), 460, y + 5, { width: 108, align: "right" });
        y += 16;
      });

      y += 24;
      if (y > 500) { doc.addPage(); y = 40; }

      doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("Current Inventory Details", 40, y);
      y += 18;

      doc.fillColor("#f1f5f9").rect(40, y, 532, 20).fill();
      doc.fillColor("#334155").fontSize(9).font("Helvetica-Bold");
      doc.text("ID", 45, y + 6);
      doc.text("Name", 90, y + 6);
      doc.text("Category", 220, y + 6);
      doc.text("Price (Rs.)", 340, y + 6);
      doc.text("Stock Level", 420, y + 6);
      doc.text("Status", 500, y + 6);
      y += 20;

      doc.font("Helvetica").fillColor("#475569");
      products.slice(0, 10).forEach((p) => {
        doc.text(p.id, 45, y + 5);
        doc.text(p.name, 90, y + 5, { width: 120, height: 12, ellipsis: true });
        doc.text(p.category, 220, y + 5, { width: 110, height: 12, ellipsis: true });
        doc.text(formatINR(p.price).replace("Rs. ", ""), 340, y + 5);
        doc.text(String(p.stock), 420, y + 5);
        doc.text(p.status, 500, y + 5);
        y += 16;
      });

    } else {
      // dashboard/analytics
      // Summary KPIs Box
      doc.fillColor("#f8fafc").rect(40, y, 532, 70).fill().strokeColor("#e2e8f0").stroke();
      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("CONVERSION RATE", 60, y + 15);
      doc.fontSize(16).fillColor("#4f46e5").text(`${analytics.conversionRate} %`, 60, y + 30);

      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("AVG SESSION DURATION", 240, y + 15);
      doc.fontSize(16).fillColor("#059669").text(analytics.avgSessionTime, 240, y + 30);

      doc.fillColor("#1e293b").fontSize(10).font("Helvetica-Bold").text("BOUNCE RATE", 410, y + 15);
      doc.fontSize(16).fillColor("#ef4444").text(`${analytics.bounceRate} %`, 410, y + 30);

      y += 100;

      doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("City Wise Revenue Breakdown", 40, y);
      y += 18;

      doc.fillColor("#f1f5f9").rect(40, y, 532, 20).fill();
      doc.fillColor("#334155").fontSize(9).font("Helvetica-Bold");
      doc.text("City Name", 60, y + 6);
      doc.text("Orders Volume", 240, y + 6);
      doc.text("Total Contribution (Rs.)", 420, y + 6, { width: 130, align: "right" });
      y += 20;

      doc.font("Helvetica").fillColor("#475569");
      analytics.topCities.forEach((city) => {
        doc.text(city.city, 60, y + 5);
        doc.text(String(city.orders), 240, y + 5);
        doc.text(formatINR(city.revenue).replace("Rs. ", ""), 420, y + 5, { width: 130, align: "right" });
        y += 15;
      });

      y += 24;

      doc.fillColor("#1e293b").fontSize(12).font("Helvetica-Bold").text("Payment Method Popularity", 40, y);
      y += 18;

      doc.fillColor("#f1f5f9").rect(40, y, 532, 20).fill();
      doc.fillColor("#334155").fontSize(9).font("Helvetica-Bold");
      doc.text("Payment Method", 60, y + 6);
      doc.text("Share Percentage", 420, y + 6, { width: 130, align: "right" });
      y += 20;

      doc.font("Helvetica").fillColor("#475569");
      analytics.paymentMethods.forEach((method) => {
        doc.text(method.method, 60, y + 5);
        doc.text(`${method.percentage} %`, 420, y + 5, { width: 130, align: "right" });
        y += 15;
      });
    }

    // Footnotes footer
    doc.fillColor("#94a3b8").fontSize(8).text("© 2026 SmartShop E-Commerce BI Services. Confidential Report.", 40, 740, { align: "center" });

    doc.end();
  }
};

module.exports = { exportReport };
