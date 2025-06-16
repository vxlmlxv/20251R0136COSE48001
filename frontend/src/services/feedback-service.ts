
import { api } from '@/lib/api-client';
import { ScriptSegment, PostureEvent, BadgeScore, Suggestion } from '@/lib/types';
import { isDemoMode } from '@/lib/config';
import { 
  mockScriptSegments, 
  mockPostureEvents, 
  mockBadgeScores, 
  mockSuggestions 
} from '@/lib/mock-data';

export const feedbackService = {
  /**
   * Get script segments for a project
   */
  getScriptSegments: async (projectId: string): Promise<ScriptSegment[]> => {
    if (isDemoMode() && projectId === 'demo-project') {
      return mockScriptSegments;
    }
    return await api.get(`/projects/${projectId}/script-segments`);
  },
  
  /**
   * Get posture events for a project
   */
  getPostureEvents: async (projectId: string): Promise<PostureEvent> => {
    if (isDemoMode() && projectId === 'demo-project') {
      return mockPostureEvents;
    }
    return await api.get(`/projects/${projectId}/posture-events`);
  },
  
  /**
   * Get badge scores for a project (if still needed)
   */
  getBadgeScores: async (projectId: string): Promise<BadgeScore[]> => {
    if (isDemoMode() && projectId === 'demo-project') {
      return mockBadgeScores;
    }
    return await api.get(`/projects/${projectId}/badge-scores`);
  },
  
  /**
   * Get improvement suggestions for a project
   */
  getSuggestions: async (projectId: string): Promise<Suggestion[]> => {
    if (isDemoMode() && projectId === 'demo-project') {
      return mockSuggestions;
    }
    return await api.get(`/projects/${projectId}/suggestions`);
  },
  
  /**
   * Accept or reject a suggestion
   */
  processSuggestion: async (
    projectId: string, 
    suggestionId: string, 
    action: 'accept' | 'reject'
  ): Promise<void> => {
    if (isDemoMode()) {
      throw new Error('Demo mode: Cannot modify suggestions in demo mode');
    }
    await api.post(`/projects/${projectId}/suggestions/${suggestionId}/${action}`);
  }
};
