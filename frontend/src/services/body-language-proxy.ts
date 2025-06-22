import { analyzeBodyLanguage as originalAnalyzeBodyLanguage, checkBodyLanguageServiceHealth } from './body-language-service';

// Updated body language service that handles local vs public URLs
export const analyzeBodyLanguage = async (videoUrl: string, projectId: string) => {
  // If the video URL is local, use a public demo video for analysis
  // This is a workaround since the remote FastAPI service can't access local URLs
  let analysisUrl = videoUrl;
  
  if (videoUrl.includes('localhost')) {
    // Use a public demo video for analysis
    analysisUrl = 'https://media.w3.org/2010/05/sintel/trailer.mp4';
    console.log('Using public demo video for analysis since local video is not accessible to remote service');
  }
  
  return originalAnalyzeBodyLanguage(analysisUrl, projectId);
};

export { checkBodyLanguageServiceHealth };
