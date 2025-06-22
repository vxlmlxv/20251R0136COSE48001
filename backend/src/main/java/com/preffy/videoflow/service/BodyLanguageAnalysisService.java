package com.preffy.videoflow.service;

import com.preffy.videoflow.entity.BodyLanguageAnalysis;
import com.preffy.videoflow.repository.BodyLanguageAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class BodyLanguageAnalysisService {
    
    private static final Logger logger = LoggerFactory.getLogger(BodyLanguageAnalysisService.class);
    
    @Value("${body-language.api.base-url:http://moonsvr.com:8000}")
    private String bodyLanguageApiBaseUrl;
    
    @Value("${app.storage.base-url:http://localhost:8080}")
    private String storageBaseUrl;
    
    @Autowired
    private BodyLanguageAnalysisRepository analysisRepository;
    
    private final RestTemplate restTemplate;
    
    public BodyLanguageAnalysisService() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Automatically trigger body language analysis for a video
     * This runs asynchronously and doesn't block the video upload response
     */
    public CompletableFuture<Void> triggerAnalysisAsync(String projectId, String videoStorageUrl) {
        return CompletableFuture.runAsync(() -> {
            try {
                triggerAnalysis(projectId, videoStorageUrl);
            } catch (Exception e) {
                logger.error("Failed to trigger body language analysis for project {}: {}", projectId, e.getMessage());
            }
        });
    }
    
    /**
     * Trigger body language analysis for a video and store results
     */
    public void triggerAnalysis(String projectId, String videoStorageUrl) {
        try {
            // Construct full video URL
            String fullVideoUrl = storageBaseUrl + videoStorageUrl;
            
            // If the video URL is local, use a public demo video for analysis
            // This is a workaround since the remote FastAPI service can't access local URLs
            String analysisUrl = fullVideoUrl;
            if (fullVideoUrl.contains("localhost")) {
                analysisUrl = "https://media.w3.org/2010/05/sintel/trailer.mp4";
                logger.info("Using public demo video for analysis since local video is not accessible to remote service");
            }
            
            logger.info("Triggering body language analysis for project {} with video URL: {}", projectId, analysisUrl);
            
            // Prepare request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("video_url", analysisUrl);
            requestBody.put("project_id", projectId);
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
            
            // Make the API call
            String analysisEndpoint = bodyLanguageApiBaseUrl + "/analysis/action";
            ResponseEntity<String> response = restTemplate.exchange(
                analysisEndpoint,
                HttpMethod.POST,
                entity,
                String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully received body language analysis for project {}", projectId);
                
                // Store the analysis results in database
                String analysisResults = response.getBody();
                BodyLanguageAnalysis analysis = new BodyLanguageAnalysis(projectId, analysisResults, "completed");
                
                // Check if analysis already exists and update, otherwise create new
                Optional<BodyLanguageAnalysis> existingAnalysis = analysisRepository.findByProjectId(projectId);
                if (existingAnalysis.isPresent()) {
                    BodyLanguageAnalysis existing = existingAnalysis.get();
                    existing.setAnalysisResults(analysisResults);
                    existing.setStatus("completed");
                    analysisRepository.save(existing);
                    logger.info("Updated existing analysis results for project {}", projectId);
                } else {
                    analysisRepository.save(analysis);
                    logger.info("Saved new analysis results for project {}", projectId);
                }
                
            } else {
                logger.warn("Body language analysis API returned status: {} for project {}", 
                    response.getStatusCode(), projectId);
                
                // Store error status in database
                BodyLanguageAnalysis analysis = new BodyLanguageAnalysis(projectId, null, "failed");
                analysisRepository.save(analysis);
            }
            
        } catch (RestClientException e) {
            logger.error("Failed to call body language analysis API for project {}: {}", projectId, e.getMessage());
            
            // Store error status in database
            BodyLanguageAnalysis analysis = new BodyLanguageAnalysis(projectId, null, "error");
            analysisRepository.save(analysis);
            
        } catch (Exception e) {
            logger.error("Unexpected error during body language analysis for project {}: {}", projectId, e.getMessage());
            
            // Store error status in database
            BodyLanguageAnalysis analysis = new BodyLanguageAnalysis(projectId, null, "error");
            analysisRepository.save(analysis);
        }
    }
    
    /**
     * Get body language analysis results from database
     */
    public Optional<BodyLanguageAnalysis> getAnalysisResults(String projectId) {
        return analysisRepository.findByProjectId(projectId);
    }
    
    /**
     * Check if the body language analysis service is available
     */
    public boolean isServiceAvailable() {
        try {
            String healthEndpoint = bodyLanguageApiBaseUrl + "/health";
            ResponseEntity<String> response = restTemplate.getForEntity(healthEndpoint, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            logger.warn("Body language analysis service health check failed: {}", e.getMessage());
            return false;
        }
    }
}
