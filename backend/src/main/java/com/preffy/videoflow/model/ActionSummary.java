package com.preffy.videoflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "action_summaries")
public class ActionSummary {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detected_action_id", nullable = false)
    private DetectedAction detectedAction;
    
    @Column(name = "total_duration_seconds", nullable = false)
    private Double totalDurationSeconds;
    
    @Column(name = "occurrence_count", nullable = false)
    private Integer occurrenceCount;
    
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
    public ActionSummary() {}
    
    public ActionSummary(DetectedAction detectedAction, Double totalDurationSeconds, Integer occurrenceCount) {
        this.detectedAction = detectedAction;
        this.totalDurationSeconds = totalDurationSeconds;
        this.occurrenceCount = occurrenceCount;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public DetectedAction getDetectedAction() { return detectedAction; }
    public void setDetectedAction(DetectedAction detectedAction) { this.detectedAction = detectedAction; }
    
    public Double getTotalDurationSeconds() { return totalDurationSeconds; }
    public void setTotalDurationSeconds(Double totalDurationSeconds) { this.totalDurationSeconds = totalDurationSeconds; }
    
    public Integer getOccurrenceCount() { return occurrenceCount; }
    public void setOccurrenceCount(Integer occurrenceCount) { this.occurrenceCount = occurrenceCount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
