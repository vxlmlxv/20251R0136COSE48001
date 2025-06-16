package com.preffy.videoflow.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Video upload request")
public class VideoUploadRequest {
    
    @Schema(description = "Original file name", example = "presentation.mp4", required = true)
    @NotBlank(message = "File name is required")
    private String fileName;
    
    @Schema(description = "File size in bytes", example = "50000000")
    private Long fileSize;
    
    @Schema(description = "File MIME type", example = "video/mp4")
    private String fileType;
    
    // Constructors
    public VideoUploadRequest() {}
    
    public VideoUploadRequest(String fileName, Long fileSize, String fileType) {
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
    }
    
    // Getters and Setters
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
}
