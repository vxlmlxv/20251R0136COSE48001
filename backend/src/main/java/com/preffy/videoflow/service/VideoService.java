package com.preffy.videoflow.service;

import com.preffy.videoflow.model.Video;
import com.preffy.videoflow.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    private static final Logger logger = LoggerFactory.getLogger(VideoService.class);

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private BodyLanguageAnalysisService bodyLanguageAnalysisService;

    public Video uploadVideo(String projectId, MultipartFile file) throws IOException {
        // Upload file to storage service
        String publicUrl = fileStorageService.uploadFile(file, "videos");

        // Extract filename from storage URL for database storage
        String filename = extractFilenameFromUrl(publicUrl);

        // Get file metadata
        String originalFilename = file.getOriginalFilename();
        String contentType = file.getContentType();
        long fileSize = file.getSize();

        // TODO: Extract video metadata (duration, width, height) using FFmpeg or similar
        // For now, using placeholder values
        int duration = 596; // seconds
        int width = 1280;
        int height = 720;

        // Create video entity
        Video video = new Video();
        video.setProjectId(projectId);
        video.setFilename(filename);
        video.setOriginalFilename(originalFilename);
        video.setContentType(contentType);
        video.setFileSize(fileSize);
        video.setStorageUrl(publicUrl.replace("http://localhost:8080", "")); // Store relative URL
        video.setDuration(duration);
        video.setWidth(width);
        video.setHeight(height);

        Video savedVideo = videoRepository.save(video);

        // Automatically trigger body language analysis
        try {
            logger.info("Triggering automatic body language analysis for project {} after video upload", projectId);
            bodyLanguageAnalysisService.triggerAnalysisAsync(projectId, savedVideo.getStorageUrl());
        } catch (Exception e) {
            logger.warn("Failed to trigger body language analysis for project {}: {}", projectId, e.getMessage());
            // Don't fail the upload if analysis trigger fails
        }

        return savedVideo;
    }

    public List<Video> getVideosByProjectId(String projectId) {
        return videoRepository.findByProjectId(projectId);
    }

    public Optional<Video> getVideoById(Long id) {
        return videoRepository.findById(id);
    }

    public Optional<Video> getVideoByFilename(String filename) {
        return videoRepository.findAll().stream()
                .filter(video -> video.getFilename().equals(filename))
                .findFirst();
    }

    public void deleteVideo(Long id) throws IOException {
        Optional<Video> videoOpt = videoRepository.findById(id);
        if (videoOpt.isPresent()) {
            Video video = videoOpt.get();
            
            // Delete file from storage
            String fullUrl = "http://localhost:8080" + video.getStorageUrl();
            fileStorageService.deleteFile(fullUrl);
            
            // Delete from database
            videoRepository.delete(video);
        }
    }

    public boolean videoExists(Long id) {
        return videoRepository.existsById(id);
    }

    /**
     * Extract filename from storage URL
     */
    private String extractFilenameFromUrl(String url) {
        if (url.contains("/stream/")) {
            return url.substring(url.lastIndexOf("/stream/") + 8);
        }
        return url.substring(url.lastIndexOf("/") + 1);
    }
}
