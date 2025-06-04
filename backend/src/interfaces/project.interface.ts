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
  segmentIds: string[];
  beforeText: string;
  afterText: string;
  rationale: string;
}
