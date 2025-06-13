package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Project creation/update request")
public class ProjectRequest {
    
    @Schema(description = "Project title", example = "My Presentation Project", required = true)
    @NotBlank(message = "Title is required")
    private String title;
    
    @Schema(description = "Project description", example = "A project for improving my presentation skills")
    private String description;
    
    @Schema(description = "Target audience", example = "BUSINESS", allowableValues = {"GENERAL", "BUSINESS", "ACADEMIC", "TECHNICAL"})
    private String audience;
    
    @Schema(description = "Formality level", example = "FORMAL", allowableValues = {"CASUAL", "NEUTRAL", "FORMAL"})
    private String formality;
    
    @Schema(description = "Subject domain", example = "business")
    private String domain;
    
    // Constructors
    public ProjectRequest() {}
    
    public ProjectRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }
    
    public String getFormality() { return formality; }
    public void setFormality(String formality) { this.formality = formality; }
    
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
}
