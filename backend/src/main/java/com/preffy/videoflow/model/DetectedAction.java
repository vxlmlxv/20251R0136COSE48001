package com.preffy.videoflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "detected_actions")
public class DetectedAction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posture_event_id", nullable = false)
    private PostureEvent postureEvent;
    
    @Column(name = "action_name", nullable = false)
    private String actionName;
    
    @OneToMany(mappedBy = "detectedAction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ActionPeriod> periods;
    
    @OneToOne(mappedBy = "detectedAction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ActionSummary summary;
    
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
    public DetectedAction() {}
    
    public DetectedAction(PostureEvent postureEvent, String actionName) {
        this.postureEvent = postureEvent;
        this.actionName = actionName;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public PostureEvent getPostureEvent() { return postureEvent; }
    public void setPostureEvent(PostureEvent postureEvent) { this.postureEvent = postureEvent; }
    
    public String getActionName() { return actionName; }
    public void setActionName(String actionName) { this.actionName = actionName; }
    
    public List<ActionPeriod> getPeriods() { return periods; }
    public void setPeriods(List<ActionPeriod> periods) { this.periods = periods; }
    
    public ActionSummary getSummary() { return summary; }
    public void setSummary(ActionSummary summary) { this.summary = summary; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
