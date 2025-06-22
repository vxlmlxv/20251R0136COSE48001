package com.preffy.videoflow.controller;

import com.preffy.videoflow.entity.BodyLanguageAnalysis;
import com.preffy.videoflow.service.BodyLanguageAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalysisController {
    
    private static final Logger logger = LoggerFactory.getLogger(AnalysisController.class);
    
    @Autowired
    private BodyLanguageAnalysisService bodyLanguageAnalysisService;
    
    /**
     * Get body language analysis results for a project from database
     */
    @GetMapping("/body-language/{projectId}")
    public ResponseEntity<?> getBodyLanguageAnalysis(@PathVariable String projectId) {
        try {
            logger.info("Fetching body language analysis results for project: {}", projectId);
            
            Optional<BodyLanguageAnalysis> analysisOpt = bodyLanguageAnalysisService.getAnalysisResults(projectId);
            
            if (analysisOpt.isPresent()) {
                BodyLanguageAnalysis analysis = analysisOpt.get();
                
                if ("completed".equals(analysis.getStatus())) {
                    // Return the stored analysis results
                    return ResponseEntity.ok(analysis.getAnalysisResults());
                } else {
                    // Analysis failed or is in error state
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("status", "error");
                    errorResponse.put("message", "Analysis failed or is not complete");
                    errorResponse.put("analysisStatus", analysis.getStatus());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
                }
            } else {
                // No analysis found for this project
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "No analysis found for this project");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
        } catch (Exception e) {
            logger.error("Failed to fetch body language analysis for project {}: {}", projectId, e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to fetch analysis results: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Manually trigger body language analysis for a project
     */
    @PostMapping("/body-language/trigger")
    public ResponseEntity<?> triggerBodyLanguageAnalysis(
            @RequestParam("projectId") String projectId,
            @RequestParam("videoUrl") String videoUrl) {
        try {
            logger.info("Manually triggering body language analysis for project: {}", projectId);
            
            bodyLanguageAnalysisService.triggerAnalysis(projectId, videoUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Analysis triggered successfully");
            response.put("projectId", projectId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Failed to trigger body language analysis for project {}: {}", projectId, e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Failed to trigger analysis: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Check if body language analysis service is available
     */
    @GetMapping("/body-language/health")
    public ResponseEntity<?> checkServiceHealth() {
        boolean isAvailable = bodyLanguageAnalysisService.isServiceAvailable();
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", isAvailable ? "available" : "unavailable");
        response.put("service", "body-language-analysis");
        
        return ResponseEntity.ok(response);
    }
}
