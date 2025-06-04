
import { api } from '@/lib/api-client';
import { ScriptSegment, BehaviorEvent, BadgeScore, Suggestion } from '@/lib/types';

export const feedbackService = {
  /**
   * Get script segments for a project
   */
  getScriptSegments: async (projectId: string): Promise<ScriptSegment[]> => {
    return await api.get(`/projects/${projectId}/script-segments`);
  },
  
  /**
   * Get behavior events for a project
   */
  getBehaviorEvents: async (projectId: string, type?: 'gesture' | 'facial' | 'posture'): Promise<BehaviorEvent[]> => {
    const endpoint = type 
      ? `/projects/${projectId}/behavior-events?type=${type}`
      : `/projects/${projectId}/behavior-events`;
    return await api.get(endpoint);
  },
  
  /**
   * Get badge scores for a project
   */
  getBadgeScores: async (projectId: string): Promise<BadgeScore[]> => {
    return await api.get(`/projects/${projectId}/badge-scores`);
  },
  
  /**
   * Get improvement suggestions for a project
   */
  getSuggestions: async (projectId: string): Promise<Suggestion[]> => {
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
    await api.post(`/projects/${projectId}/suggestions/${suggestionId}/${action}`);
  }
};
