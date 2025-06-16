package com.preffy.videoflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "suggestions")
public class Suggestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Column(name = "section_id", nullable = false)
    private String sectionId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "suggestion_type", nullable = false)
    private SuggestionType suggestionType;
    
    @Column(columnDefinition = "TEXT")
    private String originalText;
    
    @Column(columnDefinition = "TEXT")
    private String suggestedText;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String explanation;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SuggestionStatus status = SuggestionStatus.PENDING;
    
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
    public Suggestion() {}
    
    public Suggestion(Project project, String sectionId, SuggestionType suggestionType, String explanation) {
        this.project = project;
        this.sectionId = sectionId;
        this.suggestionType = suggestionType;
        this.explanation = explanation;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    
    public String getSectionId() { return sectionId; }
    public void setSectionId(String sectionId) { this.sectionId = sectionId; }
    
    public SuggestionType getSuggestionType() { return suggestionType; }
    public void setSuggestionType(SuggestionType suggestionType) { this.suggestionType = suggestionType; }
    
    public String getOriginalText() { return originalText; }
    public void setOriginalText(String originalText) { this.originalText = originalText; }
    
    public String getSuggestedText() { return suggestedText; }
    public void setSuggestedText(String suggestedText) { this.suggestedText = suggestedText; }
    
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    
    public SuggestionStatus getStatus() { return status; }
    public void setStatus(SuggestionStatus status) { this.status = status; }
    
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public enum SuggestionType {
        MODIFY, DELETE, KEEP
    }
    
    public enum SuggestionStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
