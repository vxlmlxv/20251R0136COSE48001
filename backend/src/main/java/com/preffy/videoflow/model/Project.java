package com.preffy.videoflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String title;
    
    @Column(length = 65535)
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.CREATED;
    
    @Enumerated(EnumType.STRING)
    private AudienceType audience;
    
    @Enumerated(EnumType.STRING)
    private FormalityLevel formality;
    
    private String domain;
    
    @Column(name = "video_path")
    private String videoPath;
    
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
    public Project() {}
    
    public Project(String title, String description, User user) {
        this.title = title;
        this.description = description;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    
    public AudienceType getAudience() { return audience; }
    public void setAudience(AudienceType audience) { this.audience = audience; }
    
    public FormalityLevel getFormality() { return formality; }
    public void setFormality(FormalityLevel formality) { this.formality = formality; }
    
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    
    public String getVideoPath() { return videoPath; }
    public void setVideoPath(String videoPath) { this.videoPath = videoPath; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public enum ProjectStatus {
        CREATED, UPLOADING, PROCESSING, ANALYZED, COMPLETED
    }
    
    public enum AudienceType {
        GENERAL, TECHNICAL, BUSINESS, ACADEMIC
    }
    
    public enum FormalityLevel {
        CASUAL, NEUTRAL, FORMAL
    }
}
