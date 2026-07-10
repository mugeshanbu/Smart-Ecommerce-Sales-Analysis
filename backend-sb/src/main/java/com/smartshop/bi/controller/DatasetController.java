package com.smartshop.bi.controller;

import com.smartshop.bi.model.AnalyticsReport;
import com.smartshop.bi.model.Dataset;
import com.smartshop.bi.model.User;
import com.smartshop.bi.service.AnalyticsReportService;
import com.smartshop.bi.service.DatasetService;
import com.smartshop.bi.service.UserService;
import com.smartshop.bi.service.AnalyticsEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/dataset")
public class DatasetController {

    private final DatasetService datasetService;
    private final AnalyticsReportService reportService;
    private final UserService userService;
    private final AnalyticsEngine analyticsEngine;

    public DatasetController(DatasetService datasetService, AnalyticsReportService reportService,
                             UserService userService, AnalyticsEngine analyticsEngine) {
        this.datasetService = datasetService;
        this.reportService = reportService;
        this.userService = userService;
        this.analyticsEngine = analyticsEngine;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDataset(@RequestParam("file") MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Unauthorized"));
        }
        User user = userOpt.get();

        String filename = file.getOriginalFilename();
        if (filename == null || filename.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Invalid file name."));
        }

        String extension = "";
        int i = filename.lastIndexOf('.');
        if (i > 0) {
            extension = filename.substring(i+1);
        }

        if (!Arrays.asList("csv", "xlsx", "xls", "json").contains(extension.toLowerCase())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Invalid file format. Upload CSV, Excel, or JSON only."));
        }

        try {
            // Save Dataset Metadata record
            Dataset dataset = new Dataset();
            dataset.setFilename(filename);
            dataset.setFileType(extension);
            dataset.setUserId(user.getId());
            
            // Temporary ID to link
            String tempId = UUID.randomUUID().toString();
            dataset.setId(tempId);

            // Clean, map, and analyze using AnalyticsEngine
            AnalyticsReport report = analyticsEngine.analyzeDataset(file.getInputStream(), extension, user.getId(), tempId);
            dataset.setRowCount(report.getTotalOrders());
            
            // Save both metadata and compilation report
            datasetService.save(dataset);

            // Clear previous default reports of this user to make this the active default
            Optional<AnalyticsReport> prevDefault = reportService.findByUserIdAndIsDefault(user.getId(), true);
            if (prevDefault.isPresent()) {
                AnalyticsReport oldRep = prevDefault.get();
                oldRep.setDefault(false);
                reportService.save(oldRep);
            }

            report.setDefault(true);
            reportService.save(report);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Dataset uploaded and analyzed successfully!");
            response.put("dataset", dataset);
            response.put("report", report);

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Dataset compilation failed: " + ex.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Unauthorized"));
        }

        List<Dataset> datasets = datasetService.findByUserId(userOpt.get().getId());
        return ResponseEntity.ok(datasets);
    }
}
