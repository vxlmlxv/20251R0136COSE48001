package com.preffy.videoflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.preffy.videoflow.entity.ScriptAnalysis;
import com.preffy.videoflow.repository.ScriptAnalysisRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ScriptAnalysisService {
    
    private static final Logger logger = LoggerFactory.getLogger(ScriptAnalysisService.class);
    private static final String SCRIPT_FEEDBACK_API_URL = "http://moonsvr.com:8001/api/v1/script/feedback";
    
    @Autowired
    private ScriptAnalysisRepository scriptAnalysisRepository;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * Request script feedback analysis from external API
     */
    public ScriptAnalysis analyzeScript(Long projectId, String audioUrl) {
        try {
            logger.info("Starting script analysis for project: {}", projectId);
            
            // Prepare request payload
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("project_id", projectId);
            requestPayload.put("audio_url", audioUrl);
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Create request entity
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestPayload, headers);
            
            logger.info("Sending script feedback request to: {}", SCRIPT_FEEDBACK_API_URL);
            logger.info("Request payload: {}", requestPayload);
            
            // Make API call
            ResponseEntity<String> response = restTemplate.exchange(
                SCRIPT_FEEDBACK_API_URL,
                HttpMethod.POST,
                requestEntity,
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();
                logger.info("Script feedback API response: {}", responseBody);
                
                // Parse response
                JsonNode responseJson = objectMapper.readTree(responseBody);
                
                // Extract feedback and transcript from response
                String feedback = responseJson.has("feedback") ? responseJson.get("feedback").asText() : responseBody;
                String transcript = responseJson.has("transcript") ? responseJson.get("transcript").asText() : "";
                
                // Save analysis result
                ScriptAnalysis analysis = new ScriptAnalysis(projectId, audioUrl, transcript, feedback);
                ScriptAnalysis savedAnalysis = scriptAnalysisRepository.save(analysis);
                
                logger.info("Script analysis saved with ID: {}", savedAnalysis.getId());
                return savedAnalysis;
                
            } else {
                throw new RuntimeException("Script feedback API returned status: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            logger.error("Error in script analysis for project {}: {}", projectId, e.getMessage(), e);
            
            // Save error analysis
            String errorFeedback = "Script analysis failed: " + e.getMessage();
            ScriptAnalysis errorAnalysis = new ScriptAnalysis(projectId, audioUrl, "", errorFeedback);
            return scriptAnalysisRepository.save(errorAnalysis);
        }
    }
    
    /**
     * Get script analysis by project ID
     */
    public Optional<ScriptAnalysis> getAnalysisByProjectId(Long projectId) {
        return scriptAnalysisRepository.findByProjectId(projectId);
    }
    
    /**
     * Get all script analyses
     */
    public Iterable<ScriptAnalysis> getAllAnalyses() {
        return scriptAnalysisRepository.findAll();
    }
}
