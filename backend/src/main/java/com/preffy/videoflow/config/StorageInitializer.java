package com.preffy.videoflow.config;

import com.preffy.videoflow.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StorageInitializer implements CommandLineRunner {

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize storage on application startup
        fileStorageService.initializeStorage();
    }
}
