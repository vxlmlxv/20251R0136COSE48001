package com.preffy.videoflow.service;

import com.preffy.videoflow.dto.ProjectRequest;
import com.preffy.videoflow.model.Project;
import com.preffy.videoflow.model.User;
import com.preffy.videoflow.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectService {
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserService userService;
    
    public List<Project> getProjectsByUserId(Long userId) {
        User user = userService.findById(userId);
        return projectRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    public Project getProjectById(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        if (!project.getUser().getId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        
        return project;
    }
    
    public Project createProject(ProjectRequest request, Long userId) {
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
        
        return projectRepository.save(project);
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
