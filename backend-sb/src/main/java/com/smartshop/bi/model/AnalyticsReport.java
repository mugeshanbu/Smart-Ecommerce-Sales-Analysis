package com.smartshop.bi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "analytics_reports")
public class AnalyticsReport {
    @Id
    private String id;
    private String datasetId;
    private String userId;
    private boolean isDefault = false;

    // KPI values
    private double totalRevenue;
    private int totalOrders;
    private int totalCustomers;
    private int totalProducts;
    private double avgOrderValue;
    private double salesGrowth = 18.4;
    private double conversionRate = 3.8;
    private double bounceRate = 41.2;
    private String avgSessionTime = "4m 32s";

    // Chart Lists
    private List<SalesTrendItem> salesTrend;
    private List<CategoryBreakdownItem> categoryBreakdown;
    private List<TopProductItem> topProducts;
    private List<TopCityItem> topCities;
    private List<PaymentMethodItem> paymentMethods;
    private List<WeeklyRevenueItem> weeklyRevenue;
    private List<MonthlyGrowthItem> monthlyGrowth;

    public static class SalesTrendItem {
        private String month;
        private double sales;
        private int orders;

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public double getSales() { return sales; }
        public void setSales(double sales) { this.sales = sales; }
        public int getOrders() { return orders; }
        public void setOrders(int orders) { this.orders = orders; }
    }

    public static class CategoryBreakdownItem {
        private String category;
        private double value;
        private String color;

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public double getValue() { return value; }
        public void setValue(double value) { this.value = value; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public static class TopProductItem {
        private String name;
        private String category;
        private int sold;
        private double revenue;
        private String trend = "up";

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public int getSold() { return sold; }
        public void setSold(int sold) { this.sold = sold; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
        public String getTrend() { return trend; }
        public void setTrend(String trend) { this.trend = trend; }
    }

    public static class TopCityItem {
        private String city;
        private int orders;
        private double revenue;

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public int getOrders() { return orders; }
        public void setOrders(int orders) { this.orders = orders; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
    }

    public static class PaymentMethodItem {
        private String method;
        private double percentage;

        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    public static class WeeklyRevenueItem {
        private String day;
        private double revenue;
        private int visitors;

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public double getRevenue() { return revenue; }
        public void setRevenue(double revenue) { this.revenue = revenue; }
        public int getVisitors() { return visitors; }
        public void setVisitors(int visitors) { this.visitors = visitors; }
    }

    public static class MonthlyGrowthItem {
        private String month;
        private double growth;

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public double getGrowth() { return growth; }
        public void setGrowth(double growth) { this.growth = growth; }
    }

    // Getters and Setters for top class
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDatasetId() { return datasetId; }
    public void setDatasetId(String datasetId) { this.datasetId = datasetId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean isDefault) { this.isDefault = isDefault; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public int getTotalOrders() { return totalOrders; }
    public void setTotalOrders(int totalOrders) { this.totalOrders = totalOrders; }

    public int getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(int totalCustomers) { this.totalCustomers = totalCustomers; }

    public int getTotalProducts() { return totalProducts; }
    public void setTotalProducts(int totalProducts) { this.totalProducts = totalProducts; }

    public double getAvgOrderValue() { return avgOrderValue; }
    public void setAvgOrderValue(double avgOrderValue) { this.avgOrderValue = avgOrderValue; }

    public double getSalesGrowth() { return salesGrowth; }
    public void setSalesGrowth(double salesGrowth) { this.salesGrowth = salesGrowth; }

    public double getConversionRate() { return conversionRate; }
    public void setConversionRate(double conversionRate) { this.conversionRate = conversionRate; }

    public double getBounceRate() { return bounceRate; }
    public void setBounceRate(double bounceRate) { this.bounceRate = bounceRate; }

    public String getAvgSessionTime() { return avgSessionTime; }
    public void setAvgSessionTime(String avgSessionTime) { this.avgSessionTime = avgSessionTime; }

    public List<SalesTrendItem> getSalesTrend() { return salesTrend; }
    public void setSalesTrend(List<SalesTrendItem> salesTrend) { this.salesTrend = salesTrend; }

    public List<CategoryBreakdownItem> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryBreakdownItem> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<TopProductItem> getTopProducts() { return topProducts; }
    public void setTopProducts(List<TopProductItem> topProducts) { this.topProducts = topProducts; }

    public List<TopCityItem> getTopCities() { return topCities; }
    public void setTopCities(List<TopCityItem> topCities) { this.topCities = topCities; }

    public List<PaymentMethodItem> getPaymentMethods() { return paymentMethods; }
    public void setPaymentMethods(List<PaymentMethodItem> paymentMethods) { this.paymentMethods = paymentMethods; }

    public List<WeeklyRevenueItem> getWeeklyRevenue() { return weeklyRevenue; }
    public void setWeeklyRevenue(List<WeeklyRevenueItem> weeklyRevenue) { this.weeklyRevenue = weeklyRevenue; }

    public List<MonthlyGrowthItem> getMonthlyGrowth() { return monthlyGrowth; }
    public void setMonthlyGrowth(List<MonthlyGrowthItem> monthlyGrowth) { this.monthlyGrowth = monthlyGrowth; }
}
