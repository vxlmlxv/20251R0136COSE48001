package com.preffy.videoflow.dto;

import com.preffy.videoflow.model.Video;
import java.time.LocalDateTime;

public class VideoDto {
    private Long id;
    private String projectId;
    private String filename;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private String storageUrl;
    private Integer duration;
    private Integer width;
    private Integer height;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public VideoDto() {}

    public VideoDto(Video video) {
        this.id = video.getId();
        this.projectId = video.getProjectId();
        this.filename = video.getFilename();
        this.originalFilename = video.getOriginalFilename();
        this.contentType = video.getContentType();
        this.fileSize = video.getFileSize();
        this.storageUrl = video.getStorageUrl();
        this.duration = video.getDuration();
        this.width = video.getWidth();
        this.height = video.getHeight();
        this.createdAt = video.getCreatedAt();
        this.updatedAt = video.getUpdatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getStorageUrl() {
        return storageUrl;
    }

    public void setStorageUrl(String storageUrl) {
        this.storageUrl = storageUrl;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
