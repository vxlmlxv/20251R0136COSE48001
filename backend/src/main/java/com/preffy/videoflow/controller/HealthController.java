package com.preffy.videoflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Health Check", description = "Application health monitoring endpoints")
public class HealthController {
    
    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);
    
    @GetMapping("/health")
    @Operation(
        summary = "Health Check",
        description = "Check the health status of the Preffy Video Flow API service."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Service is healthy and running",
            content = @Content(
                mediaType = "application/json",
                examples = @ExampleObject(
                    name = "Health Status",
                    value = """
                    {
                        "status": "UP",
                        "service": "Preffy Video Flow API",
                        "timestamp": "2025-06-13T15:30:00.000000",
                        "version": "1.0.0"
                    }
                    """
                )
            )
        )
    })
    public ResponseEntity<Map<String, Object>> health() {
        logger.debug("Health check endpoint accessed");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Preffy Video Flow API");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        response.put("memory", getMemoryInfo());
        
        logger.info("Health check completed successfully");
        return ResponseEntity.ok(response);
    }
    
    private Map<String, Object> getMemoryInfo() {
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> memory = new HashMap<>();
        memory.put("maxMemoryMB", runtime.maxMemory() / 1024 / 1024);
        memory.put("totalMemoryMB", runtime.totalMemory() / 1024 / 1024);
        memory.put("freeMemoryMB", runtime.freeMemory() / 1024 / 1024);
        memory.put("usedMemoryMB", (runtime.totalMemory() - runtime.freeMemory()) / 1024 / 1024);
        return memory;
    }
}
