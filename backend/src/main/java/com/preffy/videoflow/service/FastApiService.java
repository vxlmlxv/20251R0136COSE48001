package com.preffy.videoflow.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Service
public class FastApiService {

    private static final Logger logger = LoggerFactory.getLogger(FastApiService.class);
    
    @Value("${app.fastapi.url:http://localhost:8000}")
    private String fastApiUrl;
    
    private final RestTemplate restTemplate;
    
    public FastApiService() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Start video analysis in FastAPI
     * @param videoUrl Public URL to the video file
     * @param projectId Project identifier
     * @return Analysis request response
     */
    public Map<String, Object> startVideoAnalysis(String videoUrl, String projectId) {
        try {
            String url = fastApiUrl + "/analyze";
            
            Map<String, String> request = new HashMap<>();
            request.put("video_url", videoUrl);
            request.put("project_id", projectId);
            request.put("analysis_type", "full");
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("Started analysis for project {} with video {}", projectId, videoUrl);
                return response.getBody();
            } else {
                logger.error("Failed to start analysis: {}", response.getStatusCode());
                return createErrorResponse("Failed to start analysis");
            }
            
        } catch (Exception e) {
            logger.error("Error starting video analysis: {}", e.getMessage(), e);
            return createErrorResponse("Error communicating with AI service: " + e.getMessage());
        }
    }
    
    /**
     * Get analysis status from FastAPI
     * @param projectId Project identifier
     * @return Analysis status
     */
    public Map<String, Object> getAnalysisStatus(String projectId) {
        try {
            String url = fastApiUrl + "/analysis/" + projectId + "/status";
            
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                return createErrorResponse("Failed to get analysis status");
            }
            
        } catch (Exception e) {
            logger.error("Error getting analysis status: {}", e.getMessage(), e);
            return createErrorResponse("Error getting analysis status: " + e.getMessage());
        }
    }
    
    /**
     * Get script segments from FastAPI
     * @param projectId Project identifier
     * @return Script segments list
     */
    public Object getScriptSegments(String projectId) {
        try {
            String url = fastApiUrl + "/analysis/" + projectId + "/script-segments";
            
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                return createErrorResponse("Failed to get script segments");
            }
            
        } catch (Exception e) {
            logger.error("Error getting script segments: {}", e.getMessage(), e);
            return createErrorResponse("Error getting script segments: " + e.getMessage());
        }
    }
    
    /**
     * Get posture events from FastAPI
     * @param projectId Project identifier
     * @return Posture events list
     */
    public Object getPostureEvents(String projectId) {
        try {
            String url = fastApiUrl + "/analysis/" + projectId + "/posture-events";
            
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                return createErrorResponse("Failed to get posture events");
            }
            
        } catch (Exception e) {
            logger.error("Error getting posture events: {}", e.getMessage(), e);
            return createErrorResponse("Error getting posture events: " + e.getMessage());
        }
    }
    
    /**
     * Get improvement suggestions from FastAPI
     * @param projectId Project identifier
     * @return Suggestions list
     */
    public Object getSuggestions(String projectId) {
        try {
            String url = fastApiUrl + "/analysis/" + projectId + "/suggestions";
            
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                return createErrorResponse("Failed to get suggestions");
            }
            
        } catch (Exception e) {
            logger.error("Error getting suggestions: {}", e.getMessage(), e);
            return createErrorResponse("Error getting suggestions: " + e.getMessage());
        }
    }
    
    /**
     * Check if FastAPI service is healthy
     * @return Health status
     */
    public boolean isHealthy() {
        try {
            String url = fastApiUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            logger.warn("FastAPI service health check failed: {}", e.getMessage());
            return false;
        }
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", true);
        error.put("message", message);
        return error;
    }
}
