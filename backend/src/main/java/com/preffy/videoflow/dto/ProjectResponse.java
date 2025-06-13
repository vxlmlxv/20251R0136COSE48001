package com.preffy.videoflow.dto;

import com.preffy.videoflow.model.Project;

import java.time.LocalDateTime;

public class ProjectResponse {
    
    private String id;
    private String userId;
    private String title;
    private String description;
    private String status;
    private String audience;
    private String formality;
    private String domain;
    private LocalDateTime createdAt;
    
    // Constructors
    public ProjectResponse() {}
    
    public ProjectResponse(Project project) {
        this.id = project.getId().toString();
        this.userId = project.getUser().getId().toString();
        this.title = project.getTitle();
        this.description = project.getDescription();
        this.status = project.getStatus().name().toLowerCase();
        this.audience = project.getAudience() != null ? project.getAudience().name().toLowerCase() : null;
        this.formality = project.getFormality() != null ? project.getFormality().name().toLowerCase() : null;
        this.domain = project.getDomain();
        this.createdAt = project.getCreatedAt();
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getAudience() { return audience; }
    public void setAudience(String audience) { this.audience = audience; }
    
    public String getFormality() { return formality; }
    public void setFormality(String formality) { this.formality = formality; }
    
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
