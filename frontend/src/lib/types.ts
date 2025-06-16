export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  locale?: string;
  plan?: 'free' | 'premium' | 'enterprise';
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  audience: 'general' | 'technical' | 'executive' | 'academic';
  formality: 'casual' | 'neutral' | 'formal';
  domain: string;
  status: 'created' | 'processing' | 'completed';
  videoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  audience: 'GENERAL' | 'TECHNICAL' | 'EXECUTIVE' | 'ACADEMIC';
  formality: 'CASUAL' | 'NEUTRAL' | 'FORMAL';
  domain: string;
}

export interface Video {
  id: string;
  projectId: string;
  url: string;
  duration: number;
  resolution: Resolution;
}

export interface ScriptSegment {
  id: string;
  projectId: string;
  sectionName: string;
  start: number;
  end: number;
  text: string;
  speechAct: 'representatives' | 'directives' | 'commissives' | 'expressives' | 'declaratives';
}

export interface ScriptSection {
  id: string;
  projectId: string;
  title: string;
  start: number;
  end: number;
  sentences: string[];
}

export interface PostureEvent {
  projectId: string;
  totalBadPostures: number;
  totalDurationSeconds: number;
  detectedActions: DetectedAction[];
}

export interface DetectedAction {
  actionName: string;
  periods: ActionPeriod[];
  summary: ActionSummary;
}

export interface ActionPeriod {
  startFrame: number;
  endFrame: number;
  durationSeconds: number;
}

export interface ActionSummary {
  totalDurationSeconds: number;
  occurrenceCount: number;
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
  type: 'modify' | 'add' | 'remove';
  suggestedText?: string;
  originalText?: string;
  explanation?: string;
}

// Request types for API calls
export interface ProjectRequest {
  title: string;
  description: string;
  audience: 'GENERAL' | 'TECHNICAL' | 'BUSINESS' | 'ACADEMIC';
  formality: 'INFORMAL' | 'NEUTRAL' | 'FORMAL';
  domain: string;
}

export interface VideoUploadRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface Resolution {
  width: number;
  height: number;
}
