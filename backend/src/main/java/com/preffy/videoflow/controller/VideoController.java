package com.preffy.videoflow.controller;

import com.preffy.videoflow.dto.VideoDto;
import com.preffy.videoflow.model.Video;
import com.preffy.videoflow.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VideoController {

    @Autowired
    private VideoService videoService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(
            @RequestParam("projectId") Long projectId,
            @RequestParam("file") MultipartFile file) {
        
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }

            // Check if it's a video file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("video/")) {
                return ResponseEntity.badRequest().body("Please upload a valid video file");
            }

            Video video = videoService.uploadVideo(String.valueOf(projectId), file);
            VideoDto videoDto = new VideoDto(video);

            return ResponseEntity.ok(videoDto);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<VideoDto>> getVideosByProject(@PathVariable Long projectId) {
        List<Video> videos = videoService.getVideosByProjectId(String.valueOf(projectId));
        List<VideoDto> videoDtos = videos.stream()
                .map(VideoDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(videoDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoDto> getVideo(@PathVariable Long id) {
        Optional<Video> video = videoService.getVideoById(id);
        if (video.isPresent()) {
            return ResponseEntity.ok(new VideoDto(video.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stream/{filename}")
    public ResponseEntity<Resource> streamVideo(@PathVariable String filename) {
        try {
            Optional<Video> videoOpt = videoService.getVideoByFilename(filename);
            if (!videoOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Video video = videoOpt.get();
            
            // Get file from storage service
            String fullUrl = "http://localhost:8080" + video.getStorageUrl();
            
            // For local storage, we need to construct the file path
            String localPath = System.getProperty("user.home") + "/preffy-uploads/videos/" + filename;
            Path videoPath = Paths.get(localPath);
            
            if (!Files.exists(videoPath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(videoPath);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(video.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + video.getOriginalFilename() + "\"")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        try {
            videoService.deleteVideo(id);
            return ResponseEntity.ok().body("Video deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete video: " + e.getMessage());
        }
    }
}
