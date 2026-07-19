package com.smartshop.bi.service;

import com.smartshop.bi.model.AnalyticsReport;
import com.smartshop.bi.repository.AnalyticsReportRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AnalyticsReportService {

    private final AnalyticsReportRepository reportRepository;
    private static final Map<String, AnalyticsReport> inMemoryDb = new ConcurrentHashMap<>();

    public AnalyticsReportService(AnalyticsReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public Optional<AnalyticsReport> findByUserIdAndIsDefault(String userId, boolean isDefault) {
        if (UserService.isInMemory()) {
            return inMemoryDb.values().stream()
                    .filter(r -> userId.equals(r.getUserId()) && r.isDefault() == isDefault)
                    .findFirst();
        }
        try {
            return reportRepository.findByUserIdAndIsDefault(userId, isDefault);
        } catch (Exception ex) {
            return inMemoryDb.values().stream()
                    .filter(r -> userId.equals(r.getUserId()) && r.isDefault() == isDefault)
                    .findFirst();
        }
    }

    public AnalyticsReport save(AnalyticsReport report) {
        if (report.getId() == null) {
            report.setId(UUID.randomUUID().toString());
        }
        inMemoryDb.put(report.getId(), report);

        if (!UserService.isInMemory()) {
            try {
                return reportRepository.save(report);
            } catch (Exception ex) {
                System.err.println("Database write error on analytics report: " + ex.getMessage());
            }
        }
        return report;
    }
}
