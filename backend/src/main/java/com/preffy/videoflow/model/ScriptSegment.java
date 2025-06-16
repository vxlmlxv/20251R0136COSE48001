package com.preffy.videoflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "script_segments")
public class ScriptSegment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Column(name = "section_name")
    private String sectionName;
    
    @Column(name = "start_time", nullable = false)
    private Double startTime; // in seconds
    
    @Column(name = "end_time", nullable = false)
    private Double endTime; // in seconds
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "speech_act")
    private SpeechAct speechAct;
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public ScriptSegment() {}
    
    public ScriptSegment(Project project, Double startTime, Double endTime, String text) {
        this.project = project;
        this.startTime = startTime;
        this.endTime = endTime;
        this.text = text;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }
    
    public Double getStartTime() { return startTime; }
    public void setStartTime(Double startTime) { this.startTime = startTime; }
    
    public Double getEndTime() { return endTime; }
    public void setEndTime(Double endTime) { this.endTime = endTime; }
    
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    
    public SpeechAct getSpeechAct() { return speechAct; }
    public void setSpeechAct(SpeechAct speechAct) { this.speechAct = speechAct; }
    
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public enum SpeechAct {
        REPRESENTATIVES, DIRECTIVES, COMMISSIVES, EXPRESSIVES, DECLARATIVES
    }
}
