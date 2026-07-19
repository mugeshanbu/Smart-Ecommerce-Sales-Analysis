package com.smartshop.bi.controller;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.smartshop.bi.model.AnalyticsReport;
import com.smartshop.bi.model.User;
import com.smartshop.bi.service.AnalyticsReportService;
import com.smartshop.bi.service.UserService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
public class ReportExportController {

    private final AnalyticsReportService reportService;
    private final UserService userService;

    public ReportExportController(AnalyticsReportService reportService, UserService userService) {
        this.reportService = reportService;
        this.userService = userService;
    }

    @GetMapping("/{type}/export")
    public void exportReport(@PathVariable("type") String type, @RequestParam(value = "format", defaultValue = "pdf") String format,
                             HttpServletResponse response) throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent()) {
            response.sendError(401, "Unauthorized");
            return;
        }
        User user = userOpt.get();

        // Fetch active report
        Optional<AnalyticsReport> reportOpt = reportService.findByUserIdAndIsDefault(user.getId(), true);
        AnalyticsReport report = reportOpt.isPresent() ? reportOpt.get() : buildDefaultReport(user.getId());

        String filename = type + "_report_" + System.currentTimeMillis();

        if ("csv".equalsIgnoreCase(format)) {
            response.setContentType("text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=" + filename + ".csv");
            String csvData = buildCSV(type, report);
            response.getWriter().write(csvData);
            response.getWriter().flush();
            return;
        }

        if ("excel".equalsIgnoreCase(format) || "xlsx".equalsIgnoreCase(format)) {
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename=" + filename + ".xlsx");
            Workbook wb = buildExcel(type, report);
            wb.write(response.getOutputStream());
            wb.close();
            response.getOutputStream().flush();
            return;
        }

        // PDF Output (Default)
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=" + filename + ".pdf");
        buildPDF(type, report, response.getOutputStream());
    }

    private String buildCSV(String type, AnalyticsReport report) {
        StringBuilder sb = new StringBuilder();
        if ("sales".equalsIgnoreCase(type)) {
            sb.append("Month,Sales Revenue (Rs.),Orders Count\n");
            for (AnalyticsReport.SalesTrendItem item : report.getSalesTrend()) {
                sb.append(item.getMonth()).append(",")
                  .append(item.getSales()).append(",")
                  .append(item.getOrders()).append("\n");
            }
        } else if ("customer".equalsIgnoreCase(type)) {
            sb.append("City Name,Orders Count,Revenue Share (Rs.)\n");
            for (AnalyticsReport.TopCityItem item : report.getTopCities()) {
                sb.append(item.getCity()).append(",")
                  .append(item.getOrders()).append(",")
                  .append(item.getRevenue()).append("\n");
            }
        } else if ("product".equalsIgnoreCase(type)) {
            sb.append("Product Name,Category,Units Sold,Revenue (Rs.)\n");
            for (AnalyticsReport.TopProductItem item : report.getTopProducts()) {
                sb.append(item.getName().replace(",", " ")).append(",")
                  .append(item.getCategory()).append(",")
                  .append(item.getSold()).append(",")
                  .append(item.getRevenue()).append("\n");
            }
        } else {
            // Dashboard / general
            sb.append("KPI Name,Value\n");
            sb.append("Total Revenue,").append(report.getTotalRevenue()).append("\n");
            sb.append("Total Orders,").append(report.getTotalOrders()).append("\n");
            sb.append("Unique Customers,").append(report.getTotalCustomers()).append("\n");
            sb.append("Products Catalog Size,").append(report.getTotalProducts()).append("\n");
            sb.append("Average Order Value,").append(report.getAvgOrderValue()).append("\n");
        }
        return sb.toString();
    }

    private Workbook buildExcel(String type, AnalyticsReport report) {
        Workbook wb = new XSSFWorkbook();
        if ("sales".equalsIgnoreCase(type)) {
            Sheet sheet = wb.createSheet("Sales Trends");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Month");
            header.createCell(1).setCellValue("Sales Revenue (Rs.)");
            header.createCell(2).setCellValue("Orders Count");

            int idx = 1;
            for (AnalyticsReport.SalesTrendItem item : report.getSalesTrend()) {
                Row row = sheet.createRow(idx++);
                row.createCell(0).setCellValue(item.getMonth());
                row.createCell(1).setCellValue(item.getSales());
                row.createCell(2).setCellValue(item.getOrders());
            }
        } else if ("customer".equalsIgnoreCase(type)) {
            Sheet sheet = wb.createSheet("Customer Regional Contribution");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("City");
            header.createCell(1).setCellValue("Orders Count");
            header.createCell(2).setCellValue("Gross Contribution (Rs.)");

            int idx = 1;
            for (AnalyticsReport.TopCityItem item : report.getTopCities()) {
                Row row = sheet.createRow(idx++);
                row.createCell(0).setCellValue(item.getCity());
                row.createCell(1).setCellValue(item.getOrders());
                row.createCell(2).setCellValue(item.getRevenue());
            }
        } else if ("product".equalsIgnoreCase(type)) {
            Sheet sheet = wb.createSheet("Products Performance");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Product Name");
            header.createCell(1).setCellValue("Category");
            header.createCell(2).setCellValue("Units Sold");
            header.createCell(3).setCellValue("Gross Income (Rs.)");

            int idx = 1;
            for (AnalyticsReport.TopProductItem item : report.getTopProducts()) {
                Row row = sheet.createRow(idx++);
                row.createCell(0).setCellValue(item.getName());
                row.createCell(1).setCellValue(item.getCategory());
                row.createCell(2).setCellValue(item.getSold());
                row.createCell(3).setCellValue(item.getRevenue());
            }
        } else {
            Sheet sheet = wb.createSheet("Business Intelligence Summary");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Metric Label");
            header.createCell(1).setCellValue("Metric Value");

            String[][] kpis = {
                {"Total Revenue", "Rs. " + report.getTotalRevenue()},
                {"Total Orders Count", String.valueOf(report.getTotalOrders())},
                {"Registered Customers Count", String.valueOf(report.getTotalCustomers())},
                {"Unique Catalog Products Count", String.valueOf(report.getTotalProducts())},
                {"Average Checkout Order Value", "Rs. " + report.getAvgOrderValue()},
                {"Growth Index Rate", report.getSalesGrowth() + " %"}
            };

            int idx = 1;
            for (String[] kpi : kpis) {
                Row row = sheet.createRow(idx++);
                row.createCell(0).setCellValue(kpi[0]);
                row.createCell(1).setCellValue(kpi[1]);
            }
        }
        return wb;
    }

    private void buildPDF(String type, AnalyticsReport report, OutputStream outStream) throws Exception {
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        PdfWriter.getInstance(document, outStream);
        document.open();

        // Title Header Block
        PdfPTable headerTable = new PdfPTable(1);
        headerTable.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell(new Phrase("SMARTSHOP BUSINESS INTELLIGENCE PLATFORM", 
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.WHITE)));
        cell.setBackgroundColor(new Color(30, 27, 75)); // Navy #1e1b4b
        cell.setPadding(20);
        cell.setBorder(0);
        headerTable.addCell(cell);
        document.add(headerTable);

        document.add(new Paragraph("\n"));

        // Report Type Metadata
        String subtitle = type.toUpperCase() + " ANALYSIS REPORT";
        document.add(new Paragraph(subtitle, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(99, 102, 241))));
        document.add(new Paragraph("Generated Date: " + LocalDate.now().toString(), FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY)));
        document.add(new Paragraph("\n"));

        // KPI Summary Box
        PdfPTable kpiTable = new PdfPTable(3);
        kpiTable.setWidthPercentage(100);
        kpiTable.addCell(createKpiCell("TOTAL GROSS REVENUE", "Rs. " + Math.round(report.getTotalRevenue())));
        kpiTable.addCell(createKpiCell("TOTAL ORDERS VOLUME", String.valueOf(report.getTotalOrders())));
        kpiTable.addCell(createKpiCell("AVERAGE ORDER VALUE", "Rs. " + Math.round(report.getAvgOrderValue())));
        document.add(kpiTable);

        document.add(new Paragraph("\n"));

        // Tables Details
        if ("sales".equalsIgnoreCase(type)) {
            document.add(new Paragraph("Monthly Sales Trends Summary", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY)));
            document.add(new Paragraph("\n"));

            PdfPTable trendTable = new PdfPTable(3);
            trendTable.setWidthPercentage(100);
            trendTable.addCell(createHeaderCell("Month"));
            trendTable.addCell(createHeaderCell("Orders Volume"));
            trendTable.addCell(createHeaderCell("Gross Revenue (Rs.)"));

            for (AnalyticsReport.SalesTrendItem item : report.getSalesTrend()) {
                trendTable.addCell(new PdfPCell(new Phrase(item.getMonth())));
                trendTable.addCell(new PdfPCell(new Phrase(String.valueOf(item.getOrders()))));
                trendTable.addCell(new PdfPCell(new Phrase(String.valueOf(Math.round(item.getSales())))));
            }
            document.add(trendTable);
        } else if ("customer".equalsIgnoreCase(type)) {
            document.add(new Paragraph("Regional Customer Revenue Breakdown", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY)));
            document.add(new Paragraph("\n"));

            PdfPTable cityTable = new PdfPTable(3);
            cityTable.setWidthPercentage(100);
            cityTable.addCell(createHeaderCell("City Name"));
            cityTable.addCell(createHeaderCell("Orders Volume"));
            cityTable.addCell(createHeaderCell("Revenue Share (Rs.)"));

            for (AnalyticsReport.TopCityItem item : report.getTopCities()) {
                cityTable.addCell(new PdfPCell(new Phrase(item.getCity())));
                cityTable.addCell(new PdfPCell(new Phrase(String.valueOf(item.getOrders()))));
                cityTable.addCell(new PdfPCell(new Phrase(String.valueOf(Math.round(item.getRevenue())))));
            }
            document.add(cityTable);
        } else if ("product".equalsIgnoreCase(type)) {
            document.add(new Paragraph("Top Product Sales Contribution", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY)));
            document.add(new Paragraph("\n"));

            PdfPTable prodTable = new PdfPTable(4);
            prodTable.setWidthPercentage(100);
            prodTable.addCell(createHeaderCell("Product"));
            prodTable.addCell(createHeaderCell("Category"));
            prodTable.addCell(createHeaderCell("Units Sold"));
            prodTable.addCell(createHeaderCell("Revenue (Rs.)"));

            for (AnalyticsReport.TopProductItem item : report.getTopProducts()) {
                prodTable.addCell(new PdfPCell(new Phrase(item.getName())));
                prodTable.addCell(new PdfPCell(new Phrase(item.getCategory())));
                prodTable.addCell(new PdfPCell(new Phrase(String.valueOf(item.getSold()))));
                prodTable.addCell(new PdfPCell(new Phrase(String.valueOf(Math.round(item.getRevenue())))));
            }
            document.add(prodTable);
        } else {
            // General Dashboard Summary
            document.add(new Paragraph("Product Category Contributions", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY)));
            document.add(new Paragraph("\n"));

            PdfPTable catTable = new PdfPTable(2);
            catTable.setWidthPercentage(100);
            catTable.addCell(createHeaderCell("Product Category"));
            catTable.addCell(createHeaderCell("Percentage Share (%)"));

            for (AnalyticsReport.CategoryBreakdownItem item : report.getCategoryBreakdown()) {
                catTable.addCell(new PdfPCell(new Phrase(item.getCategory())));
                catTable.addCell(new PdfPCell(new Phrase(item.getValue() + " %")));
            }
            document.add(catTable);
        }

        document.add(new Paragraph("\n\n"));
        Paragraph footer = new Paragraph("© 2026 SmartShop E-Commerce BI Platform. All Rights Reserved. Confidential.", 
                FontFactory.getFont(FontFactory.HELVETICA, 8, Color.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
    }

    private PdfPCell createKpiCell(String title, String val) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(248, 250, 252));
        cell.setPadding(12);
        cell.setBorderColor(new Color(226, 232, 240));

        Paragraph titleP = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.GRAY));
        Paragraph valP = new Paragraph(val, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(79, 70, 229)));

        cell.addElement(titleP);
        cell.addElement(valP);
        return cell;
    }

    private PdfPCell createHeaderCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.DARK_GRAY)));
        cell.setBackgroundColor(new Color(241, 245, 249));
        cell.setPadding(6);
        return cell;
    }

    private AnalyticsReport buildDefaultReport(String userId) {
        AnalyticsReport report = new AnalyticsReport();
        report.setUserId(userId);
        report.setTotalRevenue(2850000);
        report.setTotalOrders(4320);
        report.setTotalCustomers(1874);
        report.setTotalProducts(528);
        report.setAvgOrderValue(6597);
        report.setSalesTrend(new ArrayList<>());
        report.setCategoryBreakdown(new ArrayList<>());
        report.setTopProducts(new ArrayList<>());
        report.setTopCities(new ArrayList<>());
        return report;
    }
}
