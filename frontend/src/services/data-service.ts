import { Project, Video } from '@/lib/types';
import { demoService } from './demo-service';

const API_BASE_URL = 'http://localhost:8080/api';

interface VideoResponse {
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
  updatedAt?: string;
}

// Project Service
export const projectService = {
  async setupTestData() {
    const response = await fetch(`${API_BASE_URL}/test/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to setup test data');
    }

    return response.json();
  },

  async getTestUser() {
    const response = await fetch(`${API_BASE_URL}/test/user`);
    
    if (!response.ok) {
      throw new Error('Failed to get test user');
    }

    return response.json();
  },

  async getProjectVideos(projectId: string): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/videos/project/${projectId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch project videos');
    }

    const videos = await response.json();
    return videos.map((video: VideoResponse) => ({
      id: video.id.toString(),
      projectId: video.projectId,
      url: video.storageUrl, // Use direct path instead of localhost URL
      duration: video.duration,
      resolution: {
        width: video.width || 1280,
        height: video.height || 720,
      },
    }));
  },
};

// Video Service
export const videoService = {
  async uploadVideo(projectId: string, file: File) {
    // Use demo service for consistent demo video usage
    return await demoService.simulateVideoUpload(projectId, file);
  },

  async getVideo(videoId: string) {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }

    return response.json();
  },
};

// Initialize test data if needed
export const initializeTestData = async () => {
  try {
    // Try to get test user first
    await projectService.getTestUser();
    console.log('Test user already exists');
  } catch (error) {
    // If user doesn't exist, create test data
    console.log('Setting up test data...');
    await projectService.setupTestData();
    console.log('Test data setup complete');
  }
};
