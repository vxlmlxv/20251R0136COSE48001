package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Behavior event analysis result")
public class BehaviorEventResponse {
    
    @Schema(description = "Event ID", example = "1")
    private String id;
    
    @Schema(description = "Associated project ID", example = "1")
    private String projectId;
    
    @Schema(description = "Start time in seconds", example = "25.3")  
    private Double start;
    
    @Schema(description = "End time in seconds", example = "27.8")
    private Double end;
    
    @Schema(description = "Event type", example = "gesture")
    private String type;
    
    @Schema(description = "Event category", example = "hand_gesture")
    private String category;
    
    @Schema(description = "Severity level", example = "medium")
    private String severity;
    
    // Constructors
    public BehaviorEventResponse() {}
    
    public BehaviorEventResponse(String id, String projectId, Double start, Double end, String type, String category, String severity) {
        this.id = id;
        this.projectId = projectId;
        this.start = start;
        this.end = end;
        this.type = type;
        this.category = category;
        this.severity = severity;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public Double getStart() { return start; }
    public void setStart(Double start) { this.start = start; }
    
    public Double getEnd() { return end; }
    public void setEnd(Double end) { this.end = end; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
