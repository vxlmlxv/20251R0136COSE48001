package com.preffy.videoflow.controller;

import com.preffy.videoflow.dto.*;
import com.preffy.videoflow.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Feedback & Analysis", description = "Endpoints for retrieving video analysis results and feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @GetMapping("/{projectId}/script-segments")
    @Operation(
        summary = "Get Script Segments",
        description = "Retrieve analyzed speech segments with timing and content for a project",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved script segments",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ScriptSegmentResponse.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "Project not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<ScriptSegmentResponse>> getScriptSegments(
        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId
    ) {
        List<ScriptSegmentResponse> segments = feedbackService.getScriptSegments(projectId);
        return ResponseEntity.ok(segments);
    }
    
    @GetMapping("/{projectId}/posture-events")
    @Operation(
        summary = "Get Posture Events",
        description = "Retrieve detected posture analysis results with timing and categorization",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved posture events",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PostureEventResponse.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "Project not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<PostureEventResponse>> getPostureEvents(
        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId
    ) {
        List<PostureEventResponse> events = feedbackService.getPostureEvents(projectId);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{projectId}/suggestions")
    @Operation(
        summary = "Get Improvement Suggestions",
        description = "Retrieve AI-generated improvement suggestions for script and delivery",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved suggestions",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = SuggestionResponse.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "Project not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<SuggestionResponse>> getSuggestions(
        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId
    ) {
        List<SuggestionResponse> suggestions = feedbackService.getSuggestions(projectId);
        return ResponseEntity.ok(suggestions);
    }
    
    @PostMapping("/{projectId}/suggestions/{suggestionId}/{action}")
    @Operation(
        summary = "Process Suggestion",
        description = "Accept or reject an improvement suggestion",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully processed suggestion"),
        @ApiResponse(responseCode = "404", description = "Project or suggestion not found"),
        @ApiResponse(responseCode = "400", description = "Invalid action"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Void> processSuggestion(
        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
        @Parameter(description = "Suggestion ID", required = true) @PathVariable Long suggestionId,
        @Parameter(description = "Action to take (accept or reject)", required = true) @PathVariable String action
    ) {
        if (!"accept".equals(action) && !"reject".equals(action)) {
            return ResponseEntity.badRequest().build();
        }
        
        feedbackService.processSuggestion(projectId, suggestionId, action);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{projectId}/video")
    @Operation(
        summary = "Upload Video",
        description = "Upload video file for a project",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully uploaded video",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = VideoResponse.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "Project not found"),
        @ApiResponse(responseCode = "400", description = "Invalid video data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<VideoResponse> uploadVideo(
        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
        @Valid @RequestBody VideoUploadRequest uploadRequest
    ) {
        VideoResponse response = feedbackService.uploadVideo(projectId, uploadRequest);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{projectId}/analysis")
    @Operation(
        summary = "Get Complete Analysis Results",
        description = "Retrieve comprehensive analysis data for a project",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved analysis results"
        ),
        @ApiResponse(responseCode = "404", description = "Project not found"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Object> getAnalysisResults(
        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId
    ) {
        // This would return aggregated analysis data
        // For now, return a simple success response
        return ResponseEntity.ok().body("{\"status\": \"analysis_complete\", \"message\": \"Analysis data available via individual endpoints\"}");
    }
    
    @GetMapping("/{projectId}/status")
    @Operation(
        summary = "Get Project Status",
        description = "Check the current processing status of a project",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    public ResponseEntity<Object> getProjectStatus(
        @Parameter(description = "Project ID", required = true) @PathVariable Long projectId
    ) {
        // This would typically be handled by the ProjectService
        // For now, return a simple status response
        return ResponseEntity.ok().body("{\"status\": \"completed\", \"progress\": 100}");
    }
}
