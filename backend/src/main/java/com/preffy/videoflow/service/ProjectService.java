package com.preffy.videoflow.service;

import com.preffy.videoflow.dto.ProjectRequest;
import com.preffy.videoflow.entity.ScriptAnalysis;
import com.preffy.videoflow.model.Project;
import com.preffy.videoflow.model.User;
import com.preffy.videoflow.model.Video;
import com.preffy.videoflow.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
public class ProjectService {
    
    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private VideoService videoService;
    
    @Autowired
    private GoogleTranscoderService transcoderService;
    
    @Autowired
    private BodyLanguageAnalysisService bodyLanguageAnalysisService;
    
    @Autowired
    private ScriptAnalysisService scriptAnalysisService;
    
    public List<Project> getProjectsByUserId(Long userId) {
        logger.debug("Fetching projects for user: {}", userId);
        User user = userService.findById(userId);
        List<Project> projects = projectRepository.findByUserOrderByCreatedAtDesc(user);
        logger.info("Found {} projects for user {}", projects.size(), userId);
        return projects;
    }
    
    public Project getProjectById(Long projectId, Long userId) {
        logger.debug("Fetching project {} for user {}", projectId, userId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> {
                    logger.warn("Project {} not found", projectId);
                    return new RuntimeException("Project not found");
                });
        
        if (!project.getUser().getId().equals(userId)) {
            logger.warn("User {} attempted to access project {} owned by user {}", 
                       userId, projectId, project.getUser().getId());
            throw new RuntimeException("Access denied");
        }
        
        logger.debug("Successfully retrieved project {} for user {}", projectId, userId);
        return project;
    }
    
    public Project createProject(ProjectRequest request, Long userId) {
        logger.info("Creating new project '{}' for user {}", request.getTitle(), userId);
        User user = userService.findById(userId);
        
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUser(user);
        
        if (request.getAudience() != null) {
            project.setAudience(Project.AudienceType.valueOf(request.getAudience().toUpperCase()));
        }
        if (request.getFormality() != null) {
            project.setFormality(Project.FormalityLevel.valueOf(request.getFormality().toUpperCase()));
        }
        if (request.getDomain() != null) {
            project.setDomain(request.getDomain());
        }
        
        Project savedProject = projectRepository.save(project);
        logger.info("Successfully created project {} for user {}", savedProject.getId(), userId);
        return savedProject;
    }
    
    /**
     * Create project with video upload and trigger analysis
     */
    @Async
    public CompletableFuture<Project> createProjectWithVideo(ProjectRequest request, MultipartFile videoFile, Long userId) {
        try {
            logger.info("Starting project creation with video for user: {}", userId);
            
            // Create the project first
            Project project = createProject(request, userId);
            project.setStatus(Project.ProjectStatus.UPLOADING);
            project = projectRepository.save(project);
            
            // Upload video
            logger.info("Uploading video for project: {}", project.getId());
            Video video = videoService.uploadVideo(project.getId().toString(), videoFile);
            
            // Update project with video path
            project.setVideoPath(video.getStorageUrl());
            project.setStatus(Project.ProjectStatus.PROCESSING);
            project = projectRepository.save(project);
            
            // Start analysis workflow asynchronously
            startAnalysisWorkflow(project, video);
            
            return CompletableFuture.completedFuture(project);
            
        } catch (Exception e) {
            logger.error("Error creating project with video: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create project with video: " + e.getMessage(), e);
        }
    }
    
    /**
     * Start the complete analysis workflow
     */
    @Async
    public void startAnalysisWorkflow(Project project, Video video) {
        try {
            logger.info("Starting analysis workflow for project: {}", project.getId());
            
            // 1. Extract MP3 audio from video
            logger.info("Extracting audio for project: {}", project.getId());
            String audioUrl = transcoderService.extractAudioFromVideo(video.getStorageUrl(), project.getId().toString());
            
            // 2. Start body language analysis (using video URL)
            logger.info("Starting body language analysis for project: {}", project.getId());
            CompletableFuture<Void> bodyAnalysisFuture = CompletableFuture.runAsync(() -> {
                bodyLanguageAnalysisService.triggerAnalysis(project.getId().toString(), video.getStorageUrl());
            });
            
            // 3. Start script analysis (using audio URL)
            logger.info("Starting script analysis for project: {}", project.getId());
            CompletableFuture<ScriptAnalysis> scriptAnalysisFuture = CompletableFuture.supplyAsync(() -> {
                return scriptAnalysisService.analyzeScript(project.getId(), audioUrl);
            });
            
            // 4. Wait for both analyses to complete
            CompletableFuture.allOf(bodyAnalysisFuture, scriptAnalysisFuture).join();
            
            // 5. Update project status
            project.setStatus(Project.ProjectStatus.ANALYZED);
            projectRepository.save(project);
            
            logger.info("Analysis workflow completed for project: {}", project.getId());
            
        } catch (Exception e) {
            logger.error("Error in analysis workflow for project {}: {}", project.getId(), e.getMessage(), e);
            
            // Update project status to indicate error
            project.setStatus(Project.ProjectStatus.CREATED); // Reset to created state
            projectRepository.save(project);
        }
    }
    
    public Project updateProject(Long projectId, ProjectRequest request, Long userId) {
        Project project = getProjectById(projectId, userId);
        
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        
        if (request.getAudience() != null) {
            project.setAudience(Project.AudienceType.valueOf(request.getAudience().toUpperCase()));
        }
        if (request.getFormality() != null) {
            project.setFormality(Project.FormalityLevel.valueOf(request.getFormality().toUpperCase()));
        }
        if (request.getDomain() != null) {
            project.setDomain(request.getDomain());
        }
        
        return projectRepository.save(project);
    }
    
    public void deleteProject(Long projectId, Long userId) {
        Project project = getProjectById(projectId, userId);
        projectRepository.delete(project);
    }
}
