package com.preffy.videoflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "behavior_events")
public class BehaviorEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Column(name = "start_time", nullable = false)
    private Double startTime; // in seconds
    
    @Column(name = "end_time", nullable = false)
    private Double endTime; // in seconds
    
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;
    
    @Column(name = "category", nullable = false)
    private String category;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false)
    private Severity severity;
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
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
    public BehaviorEvent() {}
    
    public BehaviorEvent(Project project, Double startTime, Double endTime, EventType eventType, String category, Severity severity) {
        this.project = project;
        this.startTime = startTime;
        this.endTime = endTime;
        this.eventType = eventType;
        this.category = category;
        this.severity = severity;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public Double getStartTime() { return startTime; }
    public void setStartTime(Double startTime) { this.startTime = startTime; }
    
    public Double getEndTime() { return endTime; }
    public void setEndTime(Double endTime) { this.endTime = endTime; }
    
    public EventType getEventType() { return eventType; }
    public void setEventType(EventType eventType) { this.eventType = eventType; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public enum EventType {
        GESTURE, FACIAL, POSTURE
    }
    
    public enum Severity {
        LOW, MEDIUM, HIGH
    }
}
