package com.smartshop.bi.service;

import com.smartshop.bi.model.Dataset;
import com.smartshop.bi.repository.DatasetRepository;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class DatasetService {

    private final DatasetRepository datasetRepository;
    private static final Map<String, Dataset> inMemoryDb = new ConcurrentHashMap<>();

    public DatasetService(DatasetRepository datasetRepository) {
        this.datasetRepository = datasetRepository;
    }

    public List<Dataset> findByUserId(String userId) {
        if (UserService.isInMemory()) {
            return inMemoryDb.values().stream()
                    .filter(d -> userId.equals(d.getUserId()))
                    .collect(Collectors.toList());
        }
        try {
            return datasetRepository.findByUserId(userId);
        } catch (Exception ex) {
            return inMemoryDb.values().stream()
                    .filter(d -> userId.equals(d.getUserId()))
                    .collect(Collectors.toList());
        }
    }

    public Dataset save(Dataset dataset) {
        if (dataset.getId() == null) {
            dataset.setId(UUID.randomUUID().toString());
        }
        inMemoryDb.put(dataset.getId(), dataset);

        if (!UserService.isInMemory()) {
            try {
                return datasetRepository.save(dataset);
            } catch (Exception ex) {
                System.err.println("Database write error on dataset metadata: " + ex.getMessage());
            }
        }
        return dataset;
    }
}
