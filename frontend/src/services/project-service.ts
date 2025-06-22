import { api } from '@/lib/api-client';
import { Project, Video, BodyLanguageAnalysisResponse } from '@/lib/types';

export const projectService = {
  /**
   * Get all projects for the current user
   */
  getProjects: async (): Promise<Project[]> => {
    return await api.get('/projects');
  },
  
  /**
   * Get a single project by ID
   */
  getProjectById: async (projectId: string): Promise<Project> => {
    return await api.get(`/projects/${projectId}`);
  },
  
  /**
   * Create a new project
   */
  createProject: async (projectData: Omit<Project, 'id' | 'userId' | 'status' | 'createdAt'>): Promise<Project> => {
    return await api.post('/projects', projectData);
  },
  
  /**
   * Update an existing project
   */
  updateProject: async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    return await api.put(`/projects/${projectId}`, projectData);
  },
  
  /**
   * Delete a project
   */
  deleteProject: async (projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },
  
  /**
   * Upload a video for a project
   * This would normally handle the file upload to a storage service
   */
  uploadVideo: async (projectId: string, file: File, onProgress?: (progress: number) => void): Promise<Video> => {
    // In a real implementation, this would use FormData and track upload progress
    // For now, we'll simulate the upload process
    
    // Simulate upload progress
    if (onProgress) {
      let lastProgress = 0;
      const interval = setInterval(() => {
        const progress = Math.random() * 10;
        lastProgress = Math.min(progress + lastProgress, 100);
        onProgress(lastProgress);
        if (lastProgress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
    
    // Simulate API call for video upload
    return await api.post(`/projects/${projectId}/video`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
  },
  
  /**
   * Get analysis results for a project
   */
  getAnalysisResults: async (projectId: string): Promise<unknown> => {
    return await api.get(`/projects/${projectId}/analysis`);
  },

  /**
   * Get body language analysis results for a project
   */
  getBodyLanguageAnalysis: async (projectId: string): Promise<BodyLanguageAnalysisResponse> => {
    return await api.get(`/analysis/body-language/${projectId}`);
  },

  /**
   * Check if body language analysis service is available
   */
  checkBodyLanguageServiceHealth: async (): Promise<boolean> => {
    try {
      const response = await api.get('/analysis/body-language/health');
      return response.status === 'available';
    } catch (error) {
      console.error('Body language service health check failed:', error);
      return false;
    }
  },
  
  /**
   * Poll for project status updates
   */
  pollProjectStatus: async (projectId: string, callback: (status: string) => void): Promise<void> => {
    // In a real implementation, this might use WebSockets or Server-Sent Events
    // For the prototype, we'll simulate polling
    const checkStatus = async () => {
      try {
        const project = await api.get<Project>(`/projects/${projectId}/status`);
        callback(project.status);
        
        if (project.status !== 'completed') {
          setTimeout(checkStatus, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        console.error('Error polling project status:', error);
        setTimeout(checkStatus, 5000); // Retry after 5 seconds on error
      }
    };
    
    checkStatus();
  },

  /**
   * Poll for body language analysis results
   */
  pollForAnalysisResults: async (
    projectId: string, 
    callback: (results: BodyLanguageAnalysisResponse | null) => void,
    maxAttempts: number = 30
  ): Promise<void> => {
    let attempts = 0;
    
    const checkResults = async () => {
      try {
        attempts++;
        const results = await api.get(`/analysis/body-language/${projectId}`);
        
        if (results && results.status === 'completed') {
          callback(results);
          return;
        }
        
        if (attempts < maxAttempts) {
          setTimeout(checkResults, 5000); // Poll every 5 seconds
        } else {
          console.warn('Maximum polling attempts reached for analysis results');
          callback(null);
        }
      } catch (error) {
        console.error('Error polling for analysis results:', error);
        
        if (attempts < maxAttempts) {
          setTimeout(checkResults, 10000); // Retry after 10 seconds on error
        } else {
          callback(null);
        }
      }
    };
    
    checkResults();
  },
};
