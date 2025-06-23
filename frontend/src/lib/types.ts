export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  locale: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  audience: 'general' | 'technical' | 'executive' | 'academic';
  formality: 'casual' | 'neutral' | 'formal';
  domain: string;
  status: 'created' | 'uploading' | 'processing' | 'analyzed' | 'completed';
  createdAt: string;
}

export interface Video {
  id: string;
  projectId: string;
  url: string;
  duration: number;
  resolution: {
    width: number;
    height: number;
  };
}

export interface ScriptSegment {
  id: string;
  projectId: string;
  start: number;
  end: number;
  text: string;
  speechAct: 'statement' | 'question' | 'command' | 'emphasis';
}

export interface ScriptSection {
  id: string;
  projectId: string;
  startTime: number;
  endTime: number;
  sentences: string[];
}

export interface BadgeScore {
  badgeId: string;
  projectId: string;
  stars: 1 | 2 | 3 | 4 | 5;
  totalEvents: number;
}

export interface Suggestion {
  id: string;
  projectId: string;
  sectionId: string;
  type: 'modify' | 'delete' | 'keep';
  category?: 'audience-formality' | 'delivery' | 'clarity'; // Added for modify suggestions
  suggestedText?: string;
  rationale: string;
}

// Body Language Analysis Types
export interface BodyLanguageAnalysisRequest {
  video_url: string;
  project_id: string;
}

export interface BodyLanguageAnalysisResponse {
  status: string;
  results: {
    eye_contact_analysis: {
      eye_contact_score: number;
      eye_contact_events: Array<{
        timestamp: number;
        type: string;
        confidence: number;
        description: string;
      }>;
    };
    body_stability_analysis: {
      body_stability_score: number;
      body_stability_events: Array<{
        timestamp: number;
        stability_type: string;
        confidence: number;
        description: string;
      }>;
    };
    head_posture_analysis: {
      head_posture_score: number;
      head_posture_events: Array<{
        timestamp: number;
        posture_type: string;
        confidence: number;
        description: string;
      }>;
    };
    self_touching_analysis: {
      self_touching_score: number;
      self_touching_events: Array<{
        timestamp: number;
        touching_type: string;
        confidence: number;
        description: string;
      }>;
    };
    facing_away_analysis: {
      facing_away_score: number;
      facing_away_events: Array<{
        timestamp: number;
        facing_type: string;
        confidence: number;
        description: string;
      }>;
    };
    overall_score: number;
    recommendations: string[];
  };
}

export interface BehaviorEvent {
  id: string;
  projectId: string;
  timestamp: number;
  start: number;
  end: number;
  type: 'eye-contact' | 'body-stability' | 'head-posture' | 'self-touching' | 'facing-away';
  category: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

