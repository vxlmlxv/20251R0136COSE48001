package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Badge score result")
public class BadgeScoreResponse {
    
    @Schema(description = "Badge identifier", example = "eye_contact")
    private String badgeId;
    
    @Schema(description = "Associated project ID", example = "1")
    private String projectId;
    
    @Schema(description = "Star rating (1-5)", example = "4")
    private Integer stars;
    
    @Schema(description = "Total number of related events", example = "12")
    private Integer totalEvents;
    
    // Constructors
    public BadgeScoreResponse() {}
    
    public BadgeScoreResponse(String badgeId, String projectId, Integer stars, Integer totalEvents) {
        this.badgeId = badgeId;
        this.projectId = projectId;
        this.stars = stars;
        this.totalEvents = totalEvents;
    }
    
    // Getters and Setters
    public String getBadgeId() { return badgeId; }
    public void setBadgeId(String badgeId) { this.badgeId = badgeId; }
    
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }
    
    public Integer getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Integer totalEvents) { this.totalEvents = totalEvents; }
}
