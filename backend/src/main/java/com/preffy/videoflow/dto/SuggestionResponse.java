package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Improvement suggestion")
public class SuggestionResponse {
    
    @Schema(description = "Suggestion ID", example = "1")
    private String id;
    
    @Schema(description = "Associated project ID", example = "1")
    private String projectId;
    
    @Schema(description = "Related section ID", example = "intro")
    private String sectionId;
    
    @Schema(description = "Suggestion type", example = "modify")
    private String type;
    
    @Schema(description = "Original text", example = "Welcome everyone")
    private String originalText;
    
    @Schema(description = "Suggested replacement text", example = "Consider starting with a more engaging opening")
    private String suggestedText;
    
    @Schema(description = "Explanation for the suggestion", example = "A stronger opening will capture audience attention")
    private String explanation;
    
    // Constructors
    public SuggestionResponse() {}
    
    public SuggestionResponse(String id, String projectId, String sectionId, String type, String originalText, String suggestedText, String explanation) {
        this.id = id;
        this.projectId = projectId;
        this.sectionId = sectionId;
        this.type = type;
        this.originalText = originalText;
        this.suggestedText = suggestedText;
        this.explanation = explanation;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public String getSectionId() { return sectionId; }
    public void setSectionId(String sectionId) { this.sectionId = sectionId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getSuggestedText() { return suggestedText; }
    public void setSuggestedText(String suggestedText) { this.suggestedText = suggestedText; }
    
    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }
    
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
