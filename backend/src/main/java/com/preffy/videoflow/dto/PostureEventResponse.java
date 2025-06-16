package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Posture analysis result")
public class PostureEventResponse {
    
    @Schema(description = "Associated project ID", example = "1")
    private String projectId;
    
    @Schema(description = "Total number of detected bad postures", example = "15")
    private Integer totalBadPostures;
    
    @Schema(description = "Total duration of bad posture events in seconds", example = "45.6")
    private Double totalDurationSeconds;
    
    @Schema(description = "List of detected actions")
    private List<DetectedActionResponse> detectedActions;
    
    // Constructors
    public PostureEventResponse() {}
    
    public PostureEventResponse(String projectId, Integer totalBadPostures, Double totalDurationSeconds, List<DetectedActionResponse> detectedActions) {
        this.projectId = projectId;
        this.totalBadPostures = totalBadPostures;
        this.totalDurationSeconds = totalDurationSeconds;
        this.detectedActions = detectedActions;
    }
    
    // Getters and Setters
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public Integer getTotalBadPostures() { return totalBadPostures; }
    public void setTotalBadPostures(Integer totalBadPostures) { this.totalBadPostures = totalBadPostures; }
    
    public Double getTotalDurationSeconds() { return totalDurationSeconds; }
    public void setTotalDurationSeconds(Double totalDurationSeconds) { this.totalDurationSeconds = totalDurationSeconds; }
    
    public List<DetectedActionResponse> getDetectedActions() { return detectedActions; }
    public void setDetectedActions(List<DetectedActionResponse> detectedActions) { this.detectedActions = detectedActions; }
    
    @Schema(description = "Detected action information")
    public static class DetectedActionResponse {
        @Schema(description = "Action name", example = "slouching")
        private String actionName;
        
        @Schema(description = "List of time periods when action occurred")
        private List<ActionPeriodResponse> periods;
        
        @Schema(description = "Summary statistics for this action")
        private ActionSummaryResponse summary;
        
        public DetectedActionResponse() {}
        
        public DetectedActionResponse(String actionName, List<ActionPeriodResponse> periods, ActionSummaryResponse summary) {
            this.actionName = actionName;
            this.periods = periods;
            this.summary = summary;
        }
        
        public String getActionName() { return actionName; }
        public void setActionName(String actionName) { this.actionName = actionName; }
        
        public List<ActionPeriodResponse> getPeriods() { return periods; }
        public void setPeriods(List<ActionPeriodResponse> periods) { this.periods = periods; }
        
        public ActionSummaryResponse getSummary() { return summary; }
        public void setSummary(ActionSummaryResponse summary) { this.summary = summary; }
    }
    
    @Schema(description = "Action period information")
    public static class ActionPeriodResponse {
        @Schema(description = "Start frame number", example = "150")
        private Integer startFrame;
        
        @Schema(description = "End frame number", example = "300")
        private Integer endFrame;
        
        @Schema(description = "Duration in seconds", example = "5.0")
        private Double durationSeconds;
        
        public ActionPeriodResponse() {}
        
        public ActionPeriodResponse(Integer startFrame, Integer endFrame, Double durationSeconds) {
            this.startFrame = startFrame;
            this.endFrame = endFrame;
            this.durationSeconds = durationSeconds;
        }
        
        public Integer getStartFrame() { return startFrame; }
        public void setStartFrame(Integer startFrame) { this.startFrame = startFrame; }
        
        public Integer getEndFrame() { return endFrame; }
        public void setEndFrame(Integer endFrame) { this.endFrame = endFrame; }
        
        public Double getDurationSeconds() { return durationSeconds; }
        public void setDurationSeconds(Double durationSeconds) { this.durationSeconds = durationSeconds; }
    }
    
    @Schema(description = "Action summary statistics")
    public static class ActionSummaryResponse {
        @Schema(description = "Total duration of all occurrences in seconds", example = "25.5")
        private Double totalDurationSeconds;
        
        @Schema(description = "Number of times this action occurred", example = "5")
        private Integer occurrenceCount;
        
        public ActionSummaryResponse() {}
        
        public ActionSummaryResponse(Double totalDurationSeconds, Integer occurrenceCount) {
            this.totalDurationSeconds = totalDurationSeconds;
            this.occurrenceCount = occurrenceCount;
        }
        
        public Double getTotalDurationSeconds() { return totalDurationSeconds; }
        public void setTotalDurationSeconds(Double totalDurationSeconds) { this.totalDurationSeconds = totalDurationSeconds; }
        
        public Integer getOccurrenceCount() { return occurrenceCount; }
        public void setOccurrenceCount(Integer occurrenceCount) { this.occurrenceCount = occurrenceCount; }
    }
}
