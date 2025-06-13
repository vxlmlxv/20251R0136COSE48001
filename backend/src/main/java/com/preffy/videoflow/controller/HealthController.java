package com.preffy.videoflow.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Preffy Video Flow API");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }
}
