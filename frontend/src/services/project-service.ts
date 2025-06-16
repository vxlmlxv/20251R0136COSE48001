import { api } from '@/lib/api-client';
import { Project, Video, CreateProjectRequest } from '@/lib/types';
import { mockProjects, mockVideos } from '@/lib/mock-data';
import { isDemoMode } from '@/lib/config';

export const projectService = {
  /**
   * Get all projects for the current user
   */
  getProjects: async (): Promise<Project[]> => {
    if (isDemoMode()) {
      const demoUserId = 'demo-user';
      return mockProjects.filter(project => project.userId === demoUserId);
    }
    return await api.get('/projects');
  },
  
  /**
   * Get a single project by ID
   */
  getProjectById: async (projectId: string): Promise<Project> => {
    if (isDemoMode()) {
      const project = mockProjects.find(p => p.id === projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    }
    return await api.get(`/projects/${projectId}`);
  },
  
  /**
   * Create a new project
   */
  createProject: async (projectData: CreateProjectRequest): Promise<Project> => {
    if (isDemoMode()) {
      throw new Error('Creating new projects is not available in demo mode. Please view the existing demo project.');
    }
    return await api.post('/projects', projectData);
  },
  
  /**
   * Update an existing project
   */
  updateProject: async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    if (isDemoMode()) {
      throw new Error('Updating projects is not available in demo mode');
    }
    return await api.put(`/projects/${projectId}`, projectData);
  },
  
  /**
   * Delete a project
   */
  deleteProject: async (projectId: string): Promise<void> => {
    if (isDemoMode()) {
      throw new Error('Deleting projects is not available in demo mode');
    }
    await api.delete(`/projects/${projectId}`);
  },
  
  /**
   * Get video for a project
   */
  getProjectVideo: async (projectId: string): Promise<Video> => {
    if (isDemoMode()) {
      const video = mockVideos.find(v => v.projectId === projectId);
      if (!video) {
        throw new Error('Video not found');
      }
      return video;
    }
    return await api.get(`/projects/${projectId}/video`);
  },

  /**
   * Upload a video for a project
   */
  uploadVideo: async (projectId: string, file: File, onProgress?: (progress: number) => void): Promise<Video> => {
    if (isDemoMode()) {
      throw new Error('Video upload is not available in demo mode. Please view the existing demo project.');
    }
    
    // Simulate upload progress if callback provided
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          onProgress(100);
        } else {
          onProgress(progress);
        }
      }, 200);
    }
    
    // Send video metadata to backend
    const videoData = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    };
    
    return await api.post(`/projects/${projectId}/video`, videoData);
  },
  
  /**
   * Get analysis results for a project
   */
  getAnalysisResults: async (projectId: string): Promise<{status: string; message: string}> => {
    if (isDemoMode()) {
      return { 
        status: 'completed', 
        message: 'Demo analysis complete with comprehensive feedback and insights' 
      };
    }
    return await api.get(`/projects/${projectId}/analysis`);
  },
  
  /**
   * Get project status
   */
  getProjectStatus: async (projectId: string): Promise<{status: string; progress: number}> => {
    if (isDemoMode()) {
      return { status: 'completed', progress: 100 };
    }
    return await api.get(`/projects/${projectId}/status`);
  },
  
  /**
   * Poll for project status updates
   */
  pollProjectStatus: async (projectId: string, callback: (status: string, progress?: number) => void): Promise<void> => {
    const checkStatus = async () => {
      try {
        const result = await projectService.getProjectStatus(projectId);
        callback(result.status, result.progress);
        
        if (result.status !== 'COMPLETED') {
          setTimeout(checkStatus, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        console.error('Error polling project status:', error);
        setTimeout(checkStatus, 5000); // Retry after 5 seconds on error
      }
    };
    
    checkStatus();
  },
};
