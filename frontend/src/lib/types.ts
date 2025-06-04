
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

export interface BehaviorEvent {
  id: string;
  projectId: string;
  start: number;
  end: number;
  type: 'gesture' | 'facial' | 'posture';
  category: string;
  severity: 'low' | 'medium' | 'high';
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
  suggestedText?: string;
  rationale: string;
}
