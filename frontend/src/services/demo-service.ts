import { Video, Project } from '@/lib/types';
import { VideoThumbnailGenerator, Thumbnail } from '@/lib/thumbnail-generator';

/**
 * Demo service for handling demo video integration
 * This service ensures all projects use the demo.mp4 video file
 */

export const demoService = {
  /**
   * Create a demo video object for any project
   */
  createDemoVideo: (projectId: string): Video => {
    return {
      id: `${projectId}-demo`,
      projectId: projectId,
      url: '/demo-videos/demo.mp4',
      duration: 596, // Demo video duration in seconds (9:56)
      resolution: {
        width: 1280,
        height: 720,
      },
    };
  },

  /**
   * Simulate video upload by returning demo video data
   */
  simulateVideoUpload: async (projectId: string, file?: File): Promise<{
    id: number;
    projectId: string;
    filename: string;
    originalFilename: string;
    contentType: string;
    fileSize: number;
    storageUrl: string;
    duration: number;
    width: number;
    height: number;
    createdAt: string;
  }> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      id: Date.now(),
      projectId: projectId,
      filename: 'demo.mp4',
      originalFilename: file?.name || 'demo.mp4',
      contentType: 'video/mp4',
      fileSize: file?.size || 50000000, // 50MB placeholder
      storageUrl: '/demo-videos/demo.mp4',
      duration: 596,
      width: 1280,
      height: 720,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Create project with demo video
   */
  createProjectWithDemoVideo: async (projectData: Partial<Project>, file?: File): Promise<{ project: Project, video: Video }> => {
    // Create project (in a real app, this would call the API)
    const project: Project = {
      id: `project-${Date.now()}`,
      userId: 'demo-user',
      title: projectData.title || 'Untitled Project',
      description: projectData.description || '',
      audience: projectData.audience || 'general',
      formality: projectData.formality || 'neutral',
      domain: projectData.domain || 'general',
      status: 'completed', // Skip processing steps for demo
      createdAt: new Date().toISOString(),
    };

    // Create demo video
    const video = demoService.createDemoVideo(project.id);

    return { project, video };
  },

  /**
   * Get key moments for demo video based on project type
   */
  getDemoVideoKeyMoments: (projectType?: string) => {
    const baseKeyMoments = [
      { id: 'intro', timestamp: 10, title: 'Introduction', type: 'section' },
      { id: 'main-1', timestamp: 120, title: 'Main Point 1', type: 'section' },
      { id: 'main-2', timestamp: 250, title: 'Main Point 2', type: 'section' },
      { id: 'conclusion', timestamp: 450, title: 'Conclusion', type: 'section' },
      { id: 'eye-contact-1', timestamp: 45, title: 'Eye Contact Issue', type: 'eye-contact' },
      { id: 'body-stability-1', timestamp: 180, title: 'Body Movement', type: 'body-stability' },
      { id: 'gesture-1', timestamp: 320, title: 'Effective Gesture', type: 'gesture' },
    ];

    return baseKeyMoments;
  },

  /**
   * Check if demo video exists
   */
  isDemoVideoAvailable: (): boolean => {
    // In a real app, this could check if the demo video file exists
    return true;
  },

  /**
   * Get demo video metadata
   */
  getDemoVideoMetadata: () => {
    return {
      filename: 'demo.mp4',
      duration: 596,
      resolution: { width: 1280, height: 720 },
      format: 'MP4',
      size: '~50MB',
      description: 'Sample presentation video for demonstration purposes'
    };
  },

  /**
   * Generate thumbnails for demo video key moments
   */
  generateDemoThumbnails: async (timestamps: number[]): Promise<Thumbnail[]> => {
    const generator = new VideoThumbnailGenerator();
    try {
      return await generator.generateThumbnails(
        '/demo-videos/demo.mp4',
        timestamps,
        { width: 160, height: 90, quality: 0.8, format: 'jpeg' }
      );
    } finally {
      generator.dispose();
    }
  },

  /**
   * Generate event thumbnails for demo video
   */
  generateDemoEventThumbnails: async (events: Array<{ id: string; timestamp: number }>): Promise<Map<string, Thumbnail>> => {
    const generator = new VideoThumbnailGenerator();
    try {
      return await generator.generateEventThumbnails(
        '/demo-videos/demo.mp4',
        events,
        { width: 160, height: 90, quality: 0.8, format: 'jpeg' }
      );
    } finally {
      generator.dispose();
    }
  },

  /**
   * Export demo video thumbnail at specific time
   */
  exportDemoThumbnail: async (timestamp: number, filename?: string): Promise<void> => {
    const generator = new VideoThumbnailGenerator();
    try {
      const thumbnail = await generator.generateThumbnail(
        '/demo-videos/demo.mp4',
        timestamp,
        { width: 1920, height: 1080, quality: 0.9, format: 'png' }
      );
      
      const link = document.createElement('a');
      link.href = thumbnail.dataUrl;
      link.download = filename || `demo-thumbnail-${Math.floor(timestamp)}s.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      generator.dispose();
    }
  },

  /**
   * Export all demo video key moments as ZIP
   */
  exportDemoKeyMoments: async (events: Array<{ id: string; timestamp: number; title?: string }>): Promise<void> => {
    const generator = new VideoThumbnailGenerator();
    try {
      const JSZip = (await import('jszip')).default;
      const zipFile = new JSZip();
      
      for (const event of events) {
        const thumbnail = await generator.generateThumbnail(
          '/demo-videos/demo.mp4',
          event.timestamp,
          { width: 1920, height: 1080, quality: 0.9, format: 'png' }
        );
        
        const response = await fetch(thumbnail.dataUrl);
        const blob = await response.blob();
        
        zipFile.file(`${event.title || event.id}-${Math.floor(event.timestamp)}s.png`, blob);
      }
      
      const zipBlob = await zipFile.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'demo-key-moments.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } finally {
      generator.dispose();
    }
  },
};

export default demoService;
