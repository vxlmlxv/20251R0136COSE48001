package com.preffy.videoflow.service;

import com.preffy.videoflow.dto.*;
import com.preffy.videoflow.model.*;
import com.preffy.videoflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    
    @Autowired
    private ScriptSegmentRepository scriptSegmentRepository;
    
    @Autowired
    private PostureEventRepository postureEventRepository;
    
    @Autowired
    private SuggestionRepository suggestionRepository;
    
    @Autowired
    private VideoRepository videoRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    // Script Segments
    public List<ScriptSegmentResponse> getScriptSegments(Long projectId) {
        List<ScriptSegment> segments = scriptSegmentRepository.findByProjectIdOrderByStartTime(projectId);
        return segments.stream()
                .map(this::convertToScriptSegmentResponse)
                .collect(Collectors.toList());
    }
    
    // Posture Events
    public List<PostureEventResponse> getPostureEvents(Long projectId) {
        List<PostureEvent> events = postureEventRepository.findByProjectIdOrderByCreatedAt(projectId);
        return events.stream()
                .map(this::convertToPostureEventResponse)
                .collect(Collectors.toList());
    }
    
    // Suggestions
    public List<SuggestionResponse> getSuggestions(Long projectId) {
        List<Suggestion> suggestions = suggestionRepository.findByProjectId(projectId);
        return suggestions.stream()
                .map(this::convertToSuggestionResponse)
                .collect(Collectors.toList());
    }
    
    public void processSuggestion(Long projectId, Long suggestionId, String action) {
        Optional<Suggestion> suggestionOpt = suggestionRepository.findById(suggestionId);
        if (suggestionOpt.isPresent()) {
            Suggestion suggestion = suggestionOpt.get();
            if (suggestion.getProject().getId().equals(projectId)) {
                if ("accept".equals(action)) {
                    suggestion.setStatus(Suggestion.SuggestionStatus.ACCEPTED);
                } else if ("reject".equals(action)) {
                    suggestion.setStatus(Suggestion.SuggestionStatus.REJECTED);
                }
                suggestionRepository.save(suggestion);
            }
        }
    }
    
    // Video Upload
    public VideoResponse uploadVideo(Long projectId, VideoUploadRequest request) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isPresent()) {
            Project project = projectOpt.get();
            
            // Create video record
            Video video = new Video();
            video.setProject(project);
            video.setFileName(request.getFileName());
            video.setFileSize(request.getFileSize());
            video.setMimeType(request.getFileType());
            
            // For demo purposes, set some default values
            video.setFilePath("/uploads/videos/" + UUID.randomUUID().toString() + "_" + request.getFileName());
            video.setDuration(300); // 5 minutes default
            video.setWidth(1920);
            video.setHeight(1080);
            
            video = videoRepository.save(video);
            
            // Update project status
            project.setStatus(Project.ProjectStatus.PROCESSING);
            projectRepository.save(project);
            
            return convertToVideoResponse(video);
        }
        
        throw new RuntimeException("Project not found");
    }
    
    // Conversion methods
    private ScriptSegmentResponse convertToScriptSegmentResponse(ScriptSegment segment) {
        return new ScriptSegmentResponse(
                segment.getId().toString(),
                segment.getProject().getId().toString(),
                segment.getSectionName(),
                segment.getStartTime(),
                segment.getEndTime(),
                segment.getText(),
                segment.getSpeechAct() != null ? segment.getSpeechAct().name().toLowerCase() : null
        );
    }
    
    private PostureEventResponse convertToPostureEventResponse(PostureEvent event) {
        List<PostureEventResponse.DetectedActionResponse> actionResponses = event.getDetectedActions().stream()
                .map(this::convertToDetectedActionResponse)
                .collect(Collectors.toList());
                
        return new PostureEventResponse(
                event.getProject().getId().toString(),
                event.getTotalBadPostures(),
                event.getTotalDurationSeconds(),
                actionResponses
        );
    }
    
    private PostureEventResponse.DetectedActionResponse convertToDetectedActionResponse(DetectedAction action) {
        List<PostureEventResponse.ActionPeriodResponse> periodResponses = action.getPeriods().stream()
                .map(this::convertToActionPeriodResponse)
                .collect(Collectors.toList());
                
        PostureEventResponse.ActionSummaryResponse summaryResponse = new PostureEventResponse.ActionSummaryResponse(
                action.getSummary().getTotalDurationSeconds(),
                action.getSummary().getOccurrenceCount()
        );
        
        return new PostureEventResponse.DetectedActionResponse(
                action.getActionName(),
                periodResponses,
                summaryResponse
        );
    }
    
    private PostureEventResponse.ActionPeriodResponse convertToActionPeriodResponse(ActionPeriod period) {
        return new PostureEventResponse.ActionPeriodResponse(
                period.getStartFrame(),
                period.getEndFrame(),
                period.getDurationSeconds()
        );
    }
    
    private SuggestionResponse convertToSuggestionResponse(Suggestion suggestion) {
        return new SuggestionResponse(
                suggestion.getId().toString(),
                suggestion.getProject().getId().toString(),
                suggestion.getSectionId(),
                suggestion.getSuggestionType().name().toLowerCase(),
                suggestion.getSuggestedText(),
                suggestion.getOriginalText(),
                suggestion.getExplanation()
        );
    }
    
    private VideoResponse convertToVideoResponse(Video video) {
        VideoResponse.ResolutionResponse resolution = new VideoResponse.ResolutionResponse(
                video.getWidth(), video.getHeight()
        );
        
        return new VideoResponse(
                video.getId().toString(),
                video.getProject().getId().toString(),
                video.getFilePath(), // In production, this would be a proper URL
                video.getFileName(),
                video.getFileSize(),
                "completed", // status
                video.getDuration(),
                resolution
        );
    }
}
