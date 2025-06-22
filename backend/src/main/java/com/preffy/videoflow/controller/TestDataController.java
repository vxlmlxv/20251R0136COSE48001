package com.preffy.videoflow.controller;

import com.preffy.videoflow.model.User;
import com.preffy.videoflow.model.Project;
import com.preffy.videoflow.repository.UserRepository;
import com.preffy.videoflow.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestDataController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/setup")
    public ResponseEntity<?> setupTestData() {
        try {
            // Create test user
            User testUser;
            Optional<User> existingUser = userRepository.findByEmail("test@example.com");
            
            if (existingUser.isPresent()) {
                testUser = existingUser.get();
            } else {
                testUser = new User();
                testUser.setUsername("testuser");
                testUser.setEmail("test@example.com");
                testUser.setPassword(passwordEncoder.encode("password123"));
                testUser.setFullName("Test User");
                testUser = userRepository.save(testUser);
            }

            // Create test project
            Project testProject = new Project();
            testProject.setTitle("Body Language Analysis Demo");
            testProject.setDescription("Demo project for testing body language feedback");
            testProject.setUser(testUser);
            testProject.setAudience(Project.AudienceType.GENERAL);
            testProject.setFormality(Project.FormalityLevel.NEUTRAL);
            testProject.setDomain("demo");
            testProject.setStatus(Project.ProjectStatus.CREATED);
            
            Project savedProject = projectRepository.save(testProject);

            Map<String, Object> response = new HashMap<>();
            response.put("user", Map.of(
                "id", testUser.getId(),
                "username", testUser.getUsername(),
                "email", testUser.getEmail(),
                "fullName", testUser.getFullName()
            ));
            response.put("project", Map.of(
                "id", savedProject.getId(),
                "title", savedProject.getTitle(),
                "description", savedProject.getDescription(),
                "status", savedProject.getStatus()
            ));
            response.put("message", "Test data setup successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to setup test data: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getTestUser() {
        try {
            User testUser = userRepository.findByEmail("test@example.com")
                .orElseThrow(() -> new RuntimeException("Test user not found"));
            
            Map<String, Object> response = Map.of(
                "id", testUser.getId(),
                "username", testUser.getUsername(),
                "email", testUser.getEmail(),
                "fullName", testUser.getFullName()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Test user not found: " + e.getMessage());
        }
    }
}
