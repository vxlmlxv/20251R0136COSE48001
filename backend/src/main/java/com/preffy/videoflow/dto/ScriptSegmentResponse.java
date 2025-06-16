package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Script segment analysis result")
public class ScriptSegmentResponse {
    
    @Schema(description = "Segment ID", example = "1")
    private String id;
    
    @Schema(description = "Associated project ID", example = "1")
    private String projectId;
    
    @Schema(description = "Section name", example = "Introduction")
    private String sectionName;
    
    @Schema(description = "Start time in seconds", example = "10.5")
    private Double start;
    
    @Schema(description = "End time in seconds", example = "15.2")
    private Double end;
    
    @Schema(description = "Transcribed text", example = "Welcome to today's presentation")
    private String text;
    
    @Schema(description = "Speech act type", example = "statement")
    private String speechAct;
    
    // Constructors
    public ScriptSegmentResponse() {}
    
    public ScriptSegmentResponse(String id, String projectId, String sectionName, Double start, Double end, String text, String speechAct) {
        this.id = id;
        this.projectId = projectId;
        this.sectionName = sectionName;
        this.start = start;
        this.end = end;
        this.text = text;
        this.speechAct = speechAct;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    
    public Double getStart() { return start; }
    public void setStart(Double start) { this.start = start; }
    
    public Double getEnd() { return end; }
    public void setEnd(Double end) { this.end = end; }
    
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    
    public String getSpeechAct() { return speechAct; }
    public void setSpeechAct(String speechAct) { this.speechAct = speechAct; }
}
