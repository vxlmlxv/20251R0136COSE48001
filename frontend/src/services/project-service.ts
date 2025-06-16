
import { api } from '@/lib/api-client';
import { Project, Video } from '@/lib/types';

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
      const interval = setInterval(() => {
        const progress = Math.random() * 10;
        onProgress(Math.min(progress + (onProgress as any).lastProgress || 0, 100));
        if ((onProgress as any).lastProgress >= 100) {
          clearInterval(interval);
        }
      }, 200);
      
      // Store the last progress value
      (onProgress as any).lastProgress = 0;
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
  getAnalysisResults: async (projectId: string): Promise<any> => {
    return await api.get(`/projects/${projectId}/analysis`);
  },
  
  /**
   * Get videos for a project
   */
  getProjectVideos: async (projectId: string): Promise<Video[]> => {
    return await api.get(`/projects/${projectId}/videos`);
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
};
