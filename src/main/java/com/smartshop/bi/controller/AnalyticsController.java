package com.smartshop.bi.controller;

import com.smartshop.bi.model.AnalyticsReport;
import com.smartshop.bi.model.User;
import com.smartshop.bi.service.AnalyticsReportService;
import com.smartshop.bi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class AnalyticsController {

    private final AnalyticsReportService reportService;
    private final UserService userService;

    public AnalyticsController(AnalyticsReportService reportService, UserService userService) {
        this.reportService = reportService;
        this.userService = userService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Unauthorized"));
        }
        User user = userOpt.get();

        // Find active/default dataset analytics
        Optional<AnalyticsReport> activeReport = reportService.findByUserIdAndIsDefault(user.getId(), true);
        if (activeReport.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activeReport.get());
            return ResponseEntity.ok(response);
        }

        // Compile and save default mock analytics if none exists yet
        AnalyticsReport defaultReport = buildDefaultReport(user.getId());
        reportService.save(defaultReport);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", defaultReport);
        return ResponseEntity.ok(response);
    }

    private AnalyticsReport buildDefaultReport(String userId) {
        AnalyticsReport report = new AnalyticsReport();
        report.setUserId(userId);
        report.setDatasetId("default_mock_id");
        report.setDefault(true);
        report.setTotalRevenue(2850000);
        report.setTotalOrders(4320);
        report.setTotalCustomers(1874);
        report.setTotalProducts(528);
        report.setAvgOrderValue(6597);
        report.setSalesGrowth(18.4);
        report.setConversionRate(3.8);
        report.setBounceRate(41.2);
        report.setAvgSessionTime("4m 32s");

        // 1. Sales Trend
        List<AnalyticsReport.SalesTrendItem> salesTrend = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        double[] sales = {180000, 210000, 195000, 260000, 310000, 280000, 340000, 390000, 370000, 420000, 480000, 415000};
        int[] orders = {320, 380, 350, 460, 540, 490, 610, 680, 650, 740, 820, 730};
        for (int i = 0; i < months.length; i++) {
            AnalyticsReport.SalesTrendItem item = new AnalyticsReport.SalesTrendItem();
            item.setMonth(months[i]);
            item.setSales(sales[i]);
            item.setOrders(orders[i]);
            salesTrend.add(item);
        }
        report.setSalesTrend(salesTrend);

        // 2. Category Breakdown
        List<AnalyticsReport.CategoryBreakdownItem> categoryBreakdown = new ArrayList<>();
        String[] cats = {"Electronics", "Clothing", "Home & Kitchen", "Books", "Sports"};
        double[] vals = {38, 24, 17, 11, 10};
        String[] colors = {"#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"};
        for (int i = 0; i < cats.length; i++) {
            AnalyticsReport.CategoryBreakdownItem item = new AnalyticsReport.CategoryBreakdownItem();
            item.setCategory(cats[i]);
            item.setValue(vals[i]);
            item.setColor(colors[i]);
            categoryBreakdown.add(item);
        }
        report.setCategoryBreakdown(categoryBreakdown);

        // 3. Top Products
        List<AnalyticsReport.TopProductItem> topProducts = new ArrayList<>();
        String[] pNames = {"iPhone 15 Pro", "Samsung Galaxy S24", "Nike Air Max 2024", "Levi's Slim Fit Jeans", "Instant Pot Duo"};
        String[] pCats = {"Electronics", "Electronics", "Sports", "Clothing", "Kitchen"};
        int[] pSold = {284, 241, 412, 638, 197};
        double[] pRev = {3831160, 1927359, 5353940, 2869100, 1773000};
        for (int i = 0; i < pNames.length; i++) {
            AnalyticsReport.TopProductItem item = new AnalyticsReport.TopProductItem();
            item.setName(pNames[i]);
            item.setCategory(pCats[i]);
            item.setSold(pSold[i]);
            item.setRevenue(pRev[i]);
            item.setTrend(i == 3 ? "down" : "up");
            topProducts.add(item);
        }
        report.setTopProducts(topProducts);

        // 4. Top Cities
        List<AnalyticsReport.TopCityItem> topCities = new ArrayList<>();
        String[] cities = {"Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"};
        int[] cOrders = {812, 684, 591, 472, 389, 312};
        double[] cRevs = {7820000, 6240000, 5480000, 4120000, 3280000, 2640000};
        for (int i = 0; i < cities.length; i++) {
            AnalyticsReport.TopCityItem item = new AnalyticsReport.TopCityItem();
            item.setCity(cities[i]);
            item.setOrders(cOrders[i]);
            item.setRevenue(cRevs[i]);
            topCities.add(item);
        }
        report.setTopCities(topCities);

        // 5. Payment Methods
        List<AnalyticsReport.PaymentMethodItem> paymentMethods = new ArrayList<>();
        String[] methods = {"UPI", "Credit Card", "Debit Card", "COD", "Net Banking"};
        double[] mPcts = {42, 28, 14, 10, 6};
        for (int i = 0; i < methods.length; i++) {
            AnalyticsReport.PaymentMethodItem item = new AnalyticsReport.PaymentMethodItem();
            item.setMethod(methods[i]);
            item.setPercentage(mPcts[i]);
            paymentMethods.add(item);
        }
        report.setPaymentMethods(paymentMethods);

        // 6. Weekly Revenue
        List<AnalyticsReport.WeeklyRevenueItem> weeklyRevenue = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        double[] dRevs = {48000, 62000, 55000, 71000, 89000, 95000, 78000};
        int[] dViss = {1240, 1580, 1420, 1810, 2240, 2580, 2010};
        for (int i = 0; i < days.length; i++) {
            AnalyticsReport.WeeklyRevenueItem item = new AnalyticsReport.WeeklyRevenueItem();
            item.setDay(days[i]);
            item.setRevenue(dRevs[i]);
            item.setVisitors(dViss[i]);
            weeklyRevenue.add(item);
        }
        report.setWeeklyRevenue(weeklyRevenue);

        // 7. Monthly Growth
        List<AnalyticsReport.MonthlyGrowthItem> monthlyGrowth = new ArrayList<>();
        String[] gMonths = {"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        double[] gRates = {12.4, 18.7, 15.2, 22.1, 28.9, 18.4};
        for (int i = 0; i < gMonths.length; i++) {
            AnalyticsReport.MonthlyGrowthItem item = new AnalyticsReport.MonthlyGrowthItem();
            item.setMonth(gMonths[i]);
            item.setGrowth(gRates[i]);
            monthlyGrowth.add(item);
        }
        report.setMonthlyGrowth(monthlyGrowth);

        return report;
    }
}
