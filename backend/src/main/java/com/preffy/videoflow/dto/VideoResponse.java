package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Video file information response")
public class VideoResponse {
    
    @Schema(description = "Video ID", example = "1")
    private String id;
    
    @Schema(description = "Associated project ID", example = "1")
    private String projectId;
    
    @Schema(description = "Video file URL", example = "https://example.com/videos/video1.mp4")
    private String url;
    
    @Schema(description = "Original file name", example = "presentation.mp4")
    private String fileName;
    
    @Schema(description = "File size in bytes", example = "52428800")
    private Long fileSize;
    
    @Schema(description = "Processing status", example = "completed")
    private String status;
    
    @Schema(description = "Video duration in seconds", example = "300")
    private Integer duration;
    
    @Schema(description = "Video resolution")
    private ResolutionResponse resolution;
    
    // Constructors
    public VideoResponse() {}
    
    public VideoResponse(String id, String projectId, String url, String fileName, Long fileSize, String status, Integer duration, ResolutionResponse resolution) {
        this.id = id;
        this.projectId = projectId;
        this.url = url;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.status = status;
        this.duration = duration;
        this.resolution = resolution;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public ResolutionResponse getResolution() { return resolution; }
    public void setResolution(ResolutionResponse resolution) { this.resolution = resolution; }
    
    @Schema(description = "Video resolution dimensions")
    public static class ResolutionResponse {
        @Schema(description = "Video width in pixels", example = "1920")
        private Integer width;
        
        @Schema(description = "Video height in pixels", example = "1080")
        private Integer height;
        
        public ResolutionResponse() {}
        
        public ResolutionResponse(Integer width, Integer height) {
            this.width = width;
            this.height = height;
        }
        
        public Integer getWidth() { return width; }
        public void setWidth(Integer width) { this.width = width; }
        
        public Integer getHeight() { return height; }
        public void setHeight(Integer height) { this.height = height; }
    }
}
