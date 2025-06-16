package com.preffy.videoflow.controller;

import com.preffy.videoflow.dto.VideoResponse;
import com.preffy.videoflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Videos", description = "Video upload and management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class VideoController {

    @PostMapping("/{id}/video")
    @Operation(
        summary = "Upload Video",
        description = "Upload a video file for a project. This will trigger the AI analysis process."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully uploaded video",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = VideoResponse.class),
                examples = @ExampleObject(
                    name = "Video Upload Response",
                    value = """
                    {
                        "id": "1",
                        "projectId": "1",
                        "fileName": "presentation.mp4",
                        "fileSize": 52428800,
                        "duration": 180,
                        "status": "processing"
                    }
                    """
                )
            )
        ),
        @ApiResponse(responseCode = "400", description = "Invalid file or request"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<VideoResponse> uploadVideo(
        @Parameter(description = "Project ID", example = "1") @PathVariable Long id,
        @Parameter(description = "Video file to upload") @RequestParam("file") MultipartFile file,
        @Parameter(hidden = true) Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // For now, return a mock response since we don't have actual video processing
        VideoResponse response = new VideoResponse();
        response.setId("1");
        response.setProjectId(id.toString());
        response.setFileName(file.getOriginalFilename());
        response.setFileSize(file.getSize());
        response.setDuration(180); // Mock duration
        response.setStatus("processing");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/video")
    @Operation(
        summary = "Get Video",
        description = "Get video information for a project."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved video",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = VideoResponse.class)
            )
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Video not found")
    })
    public ResponseEntity<VideoResponse> getVideo(
        @Parameter(description = "Project ID", example = "1") @PathVariable Long id,
        @Parameter(hidden = true) Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // Mock response for now
        VideoResponse response = new VideoResponse();
        response.setId("1");
        response.setProjectId(id.toString());
        response.setFileName("presentation.mp4");
        response.setFileSize(52428800L);
        response.setDuration(180);
        response.setStatus("completed");
        response.setUrl("https://example.com/videos/presentation.mp4");
        
        return ResponseEntity.ok(response);
    }
}
