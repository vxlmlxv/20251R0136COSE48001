package com.preffy.videoflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posture_events")
public class PostureEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Column(name = "total_bad_postures")
    private Integer totalBadPostures;
    
    @Column(name = "total_duration_seconds")
    private Double totalDurationSeconds;
    
    @OneToMany(mappedBy = "postureEvent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetectedAction> detectedActions;
    
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
    public PostureEvent() {}
    
    public PostureEvent(Project project, Integer totalBadPostures, Double totalDurationSeconds) {
        this.project = project;
        this.totalBadPostures = totalBadPostures;
        this.totalDurationSeconds = totalDurationSeconds;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public Integer getTotalBadPostures() { return totalBadPostures; }
    public void setTotalBadPostures(Integer totalBadPostures) { this.totalBadPostures = totalBadPostures; }
    
    public Double getTotalDurationSeconds() { return totalDurationSeconds; }
    public void setTotalDurationSeconds(Double totalDurationSeconds) { this.totalDurationSeconds = totalDurationSeconds; }
    
    public List<DetectedAction> getDetectedActions() { return detectedActions; }
    public void setDetectedActions(List<DetectedAction> detectedActions) { this.detectedActions = detectedActions; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
