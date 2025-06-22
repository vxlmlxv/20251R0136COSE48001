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
  title: string;
  start: number;
  end: number;
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
    gesture_analysis: {
      total_gestures: number;
      gesture_quality_score: number;
      gesture_events: Array<{
        timestamp: number;
        type: string;
        confidence: number;
        description: string;
      }>;
    };
    posture_analysis: {
      average_posture_score: number;
      posture_events: Array<{
        timestamp: number;
        posture_type: string;
        confidence: number;
        description: string;
      }>;
    };
    facial_expression_analysis: {
      smile_consistency: number;
      eye_contact_score: number;
      expression_events: Array<{
        timestamp: number;
        expression_type: string;
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
  type: 'gesture' | 'posture' | 'facial';
  category: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}
