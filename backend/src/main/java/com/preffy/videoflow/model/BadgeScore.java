package com.preffy.videoflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "badge_scores")
public class BadgeScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Column(name = "badge_id", nullable = false)
    private String badgeId;
    
    @Column(name = "badge_name", nullable = false)
    private String badgeName;
    
    @Column(name = "stars", nullable = false)
    private Integer stars; // 1-5 star rating
    
    @Column(name = "total_events")
    private Integer totalEvents;
    
    @Column(name = "score_percentage")
    private Double scorePercentage;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
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
    public BadgeScore() {}
    
    public BadgeScore(Project project, String badgeId, String badgeName, Integer stars, Integer totalEvents) {
        this.project = project;
        this.badgeId = badgeId;
        this.badgeName = badgeName;
        this.stars = stars;
        this.totalEvents = totalEvents;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public String getBadgeId() { return badgeId; }
    public void setBadgeId(String badgeId) { this.badgeId = badgeId; }
    
    public String getBadgeName() { return badgeName; }
    public void setBadgeName(String badgeName) { this.badgeName = badgeName; }
    
    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }
    
    public Integer getTotalEvents() { return totalEvents; }
    public void setTotalEvents(Integer totalEvents) { this.totalEvents = totalEvents; }
    
    public Double getScorePercentage() { return scorePercentage; }
    public void setScorePercentage(Double scorePercentage) { this.scorePercentage = scorePercentage; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
