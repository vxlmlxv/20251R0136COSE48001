// Backend API service for database operations
const BACKEND_BASE_URL = 'http://localhost:8080/api';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  userId?: number;
  videoPath?: string;
  audience?: string;
  formality?: string;
  domain?: string;
}

export interface AnalysisResult {
  actions?: Array<{
    action: string;
    timestamp: number;
    confidence: number;
  }>;
  overall_score?: number;
  feedback?: string;
  timeline?: Array<{
    timestamp: number;
    action: string;
    score: number;
  }>;
}

export interface ApiResponse<T = unknown> {
  status: string;
  message?: string;
  data?: T;
}

export interface BodyLanguageAnalysis {
  id: number;
  projectId: string;
  status: string;
  analysisResults?: AnalysisResult;
  createdAt: string;
  updatedAt: string;
}

class BackendService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  }

  // Test endpoints
  async setupTestData(): Promise<{ user: User; project: Project }> {
    return this.fetchWithErrorHandling(`${BACKEND_BASE_URL}/test/setup`, {
      method: 'POST',
    });
  }

  async getTestUser(): Promise<User> {
    return this.fetchWithErrorHandling(`${BACKEND_BASE_URL}/test/user`);
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    return this.fetchWithErrorHandling(`${BACKEND_BASE_URL}/projects`);
  }

  async getProject(id: string): Promise<Project> {
    return this.fetchWithErrorHandling(`${BACKEND_BASE_URL}/projects/${id}`);
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    return this.fetchWithErrorHandling(`${BACKEND_BASE_URL}/projects`, {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  // Analysis endpoints
  async getBodyLanguageAnalysis(projectId: string): Promise<AnalysisResult> {
    return this.fetchWithErrorHandling(`${BACKEND_BASE_URL}/analysis/body-language/${projectId}`);
  }

  async triggerBodyLanguageAnalysis(projectId: string, videoUrl: string): Promise<ApiResponse> {
    return this.fetchWithErrorHandling(`${BACKEND_BASE_URL}/analysis/body-language/trigger`, {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        videoUrl,
      }),
    });
  }

  async checkAnalysisServiceHealth(): Promise<{ status: string; service: string }> {
    return this.fetchWithErrorHandling(`${BACKEND_BASE_URL}/analysis/body-language/health`);
  }

  // Direct database operations for demo purposes
  async saveAnalysisResults(projectId: string, analysisData: AnalysisResult): Promise<void> {
    // This would typically be handled server-side, but for demo we can trigger analysis
    await this.triggerBodyLanguageAnalysis(projectId, 'demo-video-url');
  }

  async loadAnalysisResults(projectId: string): Promise<AnalysisResult | null> {
    try {
      return await this.getBodyLanguageAnalysis(projectId);
    } catch (error) {
      console.log('No existing analysis found for project:', projectId);
      return null;
    }
  }
}

export const backendService = new BackendService();
