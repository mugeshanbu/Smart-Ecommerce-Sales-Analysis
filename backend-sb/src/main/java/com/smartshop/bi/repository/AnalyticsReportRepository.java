package com.smartshop.bi.repository;

import com.smartshop.bi.model.AnalyticsReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AnalyticsReportRepository extends MongoRepository<AnalyticsReport, String> {
    Optional<AnalyticsReport> findByDatasetId(String datasetId);
    Optional<AnalyticsReport> findByUserIdAndIsDefault(String userId, boolean isDefault);
}
