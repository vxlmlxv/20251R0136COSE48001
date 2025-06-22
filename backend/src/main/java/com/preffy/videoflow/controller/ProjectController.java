package com.preffy.videoflow.controller;

import com.preffy.videoflow.dto.ProjectRequest;
import com.preffy.videoflow.dto.ProjectResponse;
import com.preffy.videoflow.model.Project;
import com.preffy.videoflow.security.UserPrincipal;
import com.preffy.videoflow.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Projects", description = "Video project management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class ProjectController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);
    
    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    @Operation(
        summary = "Get All Projects",
        description = "Retrieve all video projects for the authenticated user, ordered by creation date (newest first)."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved projects",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = ProjectResponse.class)),
                examples = @ExampleObject(
                    name = "Projects List",
                    value = """
                    [
                        {
                            "id": "1",
                            "userId": "1",
                            "title": "Test Project",
                            "description": "This is a test project",
                            "status": "created",
                            "audience": "general",
                            "formality": "neutral",
                            "domain": "test",
                            "createdAt": "2025-06-13T15:30:00.025056"
                        }
                    ]
                    """
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
        @Parameter(hidden = true) Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Project> projects = projectService.getProjectsByUserId(userPrincipal.getId());
        
        List<ProjectResponse> response = projects.stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Get Project by ID",
        description = "Retrieve a specific video project by its ID. User can only access their own projects."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved project",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProjectResponse.class),
                examples = @ExampleObject(
                    name = "Project Details",
                    value = """
                    {
                        "id": "1",
                        "userId": "1",
                        "title": "Test Project",
                        "description": "This is a test project",
                        "status": "created",
                        "audience": "general",
                        "formality": "neutral",
                        "domain": "test",
                        "createdAt": "2025-06-13T15:30:00.025056"
                    }
                    """
                )
            )
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Project not found or access denied")
    })
    public ResponseEntity<ProjectResponse> getProject(
        @Parameter(description = "Project ID", example = "1") @PathVariable Long id,
        @Parameter(hidden = true) Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Project project = projectService.getProjectById(id, userPrincipal.getId());
        
        return ResponseEntity.ok(new ProjectResponse(project));
    }
    
    @PostMapping
    @Operation(
        summary = "Create New Project",
        description = "Create a new video project with the specified details.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Project creation details",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProjectRequest.class),
                examples = @ExampleObject(
                    name = "Create Project",
                    summary = "Sample project creation request",
                    value = """
                    {
                        "title": "My New Presentation",
                        "description": "A project for improving my presentation skills",
                        "domain": "business",
                        "audience": "BUSINESS",
                        "formality": "FORMAL"
                    }
                    """
                )
            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully created project",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProjectResponse.class),
                examples = @ExampleObject(
                    name = "Created Project",
                    value = """
                    {
                        "id": "2",
                        "userId": "1",
                        "title": "My New Presentation",
                        "description": "A project for improving my presentation skills",
                        "status": "created",
                        "audience": "business",
                        "formality": "formal",
                        "domain": "business",
                        "createdAt": "2025-06-13T16:00:00.000000"
                    }
                    """
                )
            )
        ),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    public ResponseEntity<ProjectResponse> createProject(
        @Valid @RequestBody ProjectRequest projectRequest,
        @Parameter(hidden = true) Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Project project = projectService.createProject(projectRequest, userPrincipal.getId());
        
        return ResponseEntity.ok(new ProjectResponse(project));
    }
    
    @PutMapping("/{id}")
    @Operation(
        summary = "Update Project",
        description = "Update an existing video project. User can only update their own projects.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Updated project details",
            required = true,
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProjectRequest.class),
                examples = @ExampleObject(
                    name = "Update Project",
                    summary = "Sample project update request",
                    value = """
                    {
                        "title": "Updated Presentation Title",
                        "description": "Updated description with more details",
                        "domain": "education",
                        "audience": "ACADEMIC",
                        "formality": "NEUTRAL"
                    }
                    """
                )
            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully updated project",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProjectResponse.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Invalid request data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Project not found or access denied")
    })
    public ResponseEntity<ProjectResponse> updateProject(
        @Parameter(description = "Project ID", example = "1") @PathVariable Long id,
        @Valid @RequestBody ProjectRequest projectRequest,
        @Parameter(hidden = true) Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Project project = projectService.updateProject(id, projectRequest, userPrincipal.getId());
        
        return ResponseEntity.ok(new ProjectResponse(project));
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Delete Project",
        description = "Delete a video project. User can only delete their own projects. This action is irreversible."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully deleted project"
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Project not found or access denied")
    })
    public ResponseEntity<?> deleteProject(
        @Parameter(description = "Project ID", example = "1") @PathVariable Long id,
        @Parameter(hidden = true) Authentication authentication
    ) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        projectService.deleteProject(id, userPrincipal.getId());
        
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/with-video")
    @Operation(
        summary = "Create Project with Video Upload",
        description = "Create a new video project and upload video file. Automatically triggers body language and script analysis."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully created project and uploaded video. Analysis started in background.",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProjectResponse.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Invalid request data or video file"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    public ResponseEntity<ProjectResponse> createProjectWithVideo(
        @RequestParam("title") String title,
        @RequestParam("description") String description,
        @RequestParam(value = "domain", required = false) String domain,
        @RequestParam(value = "audience", required = false) String audience,
        @RequestParam(value = "formality", required = false) String formality,
        @RequestParam("video") MultipartFile videoFile,
        @Parameter(hidden = true) Authentication authentication
    ) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            // Validate video file
            if (videoFile.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            // Create project request
            ProjectRequest projectRequest = new ProjectRequest();
            projectRequest.setTitle(title);
            projectRequest.setDescription(description);
            projectRequest.setDomain(domain);
            projectRequest.setAudience(audience);
            projectRequest.setFormality(formality);
            
            // Create project with video upload (async analysis)
            Project project = projectService.createProjectWithVideo(projectRequest, videoFile, userPrincipal.getId()).get();
            
            return ResponseEntity.ok(new ProjectResponse(project));
            
        } catch (Exception e) {
            logger.error("Error creating project with video: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
