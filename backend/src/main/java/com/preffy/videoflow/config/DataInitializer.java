package com.preffy.videoflow.config;

import com.preffy.videoflow.model.*;
import com.preffy.videoflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private ScriptSegmentRepository scriptSegmentRepository;
    
    @Autowired
    private PostureEventRepository postureEventRepository;
    
    @Autowired
    private SuggestionRepository suggestionRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeSampleData();
    }
    
    private void initializeSampleData() {
        // Create sample user
        if (userRepository.count() == 0) {
            User user = new User();
            user.setUsername("demo");
            user.setFullName("Demo User");
            user.setEmail("demo@preffy.com");
            user.setPassword(passwordEncoder.encode("password123"));
            user = userRepository.save(user);
            
            // Create sample project
            Project project = new Project();
            project.setTitle("Sample Presentation Analysis");
            project.setDescription("A sample presentation for testing the video analysis features");
            project.setUser(user);
            project.setStatus(Project.ProjectStatus.COMPLETED);
            project.setAudience(Project.AudienceType.GENERAL);
            project.setFormality(Project.FormalityLevel.NEUTRAL);
            project.setDomain("technology");
            project.setVideoUrl("https://example.com/sample-video.mp4");
            project = projectRepository.save(project);
            
            // Create sample script segments
            ScriptSegment segment1 = new ScriptSegment(project, 0.0, 5.2, "Welcome everyone to today's presentation about our new product features.");
            segment1.setSpeechAct(ScriptSegment.SpeechAct.REPRESENTATIVES);
            segment1.setSectionName("Introduction");
            scriptSegmentRepository.save(segment1);
            
            ScriptSegment segment2 = new ScriptSegment(project, 5.3, 8.7, "Are you ready to see what we've built?");
            segment2.setSpeechAct(ScriptSegment.SpeechAct.DIRECTIVES);
            segment2.setSectionName("Opening Hook");
            scriptSegmentRepository.save(segment2);
            
            ScriptSegment segment3 = new ScriptSegment(project, 8.8, 15.4, "Let me start by showing you the main dashboard interface.");
            segment3.setSpeechAct(ScriptSegment.SpeechAct.REPRESENTATIVES);
            segment3.setSectionName("Main Content");
            scriptSegmentRepository.save(segment3);
            
            // Create sample posture event
            PostureEvent postureEvent = new PostureEvent();
            postureEvent.setProject(project);
            postureEvent.setTotalBadPostures(5);
            postureEvent.setTotalDurationSeconds(15.6);
            postureEventRepository.save(postureEvent);
            
            // Note: DetectedAction, ActionSummary, ActionPeriod creation would require
            // additional repositories which are not set up in this demo.
            // In a full implementation, you would also create sample detected actions here.
            
            // Create sample suggestions
            Suggestion suggestion1 = new Suggestion(project, "intro", Suggestion.SuggestionType.MODIFY, "Consider starting with a more engaging hook to capture audience attention immediately");
            suggestion1.setOriginalText("Welcome everyone to today's presentation");
            suggestion1.setSuggestedText("Imagine if you could revolutionize your workflow in just 10 minutes");
            suggestion1.setConfidenceScore(0.85);
            suggestionRepository.save(suggestion1);
            
            Suggestion suggestion2 = new Suggestion(project, "transition", Suggestion.SuggestionType.MODIFY, "Add smoother transitions between main points to improve flow");
            suggestion2.setConfidenceScore(0.78);
            suggestionRepository.save(suggestion2);
            
            System.out.println("Sample data initialized successfully!");
            System.out.println("Demo user credentials:");
            System.out.println("Email: demo@preffy.com");
            System.out.println("Password: password123");
        }
    }
}
