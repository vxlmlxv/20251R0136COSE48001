package com.preffy.videoflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "action_periods")
public class ActionPeriod {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detected_action_id", nullable = false)
    private DetectedAction detectedAction;
    
    @Column(name = "start_frame", nullable = false)
    private Integer startFrame;
    
    @Column(name = "end_frame", nullable = false)
    private Integer endFrame;
    
    @Column(name = "duration_seconds", nullable = false)
    private Double durationSeconds;
    
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
    public ActionPeriod() {}
    
    public ActionPeriod(DetectedAction detectedAction, Integer startFrame, Integer endFrame, Double durationSeconds) {
        this.detectedAction = detectedAction;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.durationSeconds = durationSeconds;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public DetectedAction getDetectedAction() { return detectedAction; }
    public void setDetectedAction(DetectedAction detectedAction) { this.detectedAction = detectedAction; }
    
    public Integer getStartFrame() { return startFrame; }
    public void setStartFrame(Integer startFrame) { this.startFrame = startFrame; }
    
    public Integer getEndFrame() { return endFrame; }
    public void setEndFrame(Integer endFrame) { this.endFrame = endFrame; }
    
    public Double getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Double durationSeconds) { this.durationSeconds = durationSeconds; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
