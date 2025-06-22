import { BodyLanguageAnalysisRequest, BodyLanguageAnalysisResponse } from '../lib/types';

// Body Language Analysis API Base URL
const BODY_LANGUAGE_API_BASE = 'http://moonsvr.com:8000';

/**
 * Analyzes body language from a video URL
 * @param videoUrl The URL of the video to analyze
 * @param projectId The project ID for the analysis
 * @returns Promise with analysis results
 */
export async function analyzeBodyLanguage(videoUrl: string, projectId: string): Promise<BodyLanguageAnalysisResponse> {
  // Convert relative URLs to absolute URLs
  let absoluteVideoUrl = videoUrl;
  if (videoUrl.startsWith('/')) {
    // Get the current origin (protocol + hostname + port)
    absoluteVideoUrl = `${window.location.origin}${videoUrl}`;
  }

  console.log('Analyzing video at URL:', absoluteVideoUrl);
  console.log('Project ID:', projectId);

  const requestBody: BodyLanguageAnalysisRequest = {
    video_url: absoluteVideoUrl,
    project_id: projectId
  };

  try {
    // Add longer timeout for video analysis (5 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

    const response = await fetch(`${BODY_LANGUAGE_API_BASE}/analysis/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data: BodyLanguageAnalysisResponse = await response.json();
    console.log('Analysis result:', data);
    return data;
  } catch (error) {
    console.error('Error analyzing body language:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze body language: ${error.message}`);
    }
    throw new Error('Failed to analyze body language. Please try again.');
  }
}

/**
 * Check if the body language analysis service is available
 */
export async function checkBodyLanguageServiceHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${BODY_LANGUAGE_API_BASE}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Body language service health check failed:', error);
    return false;
  }
}
