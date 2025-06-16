export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  locale?: string;
  plan?: string;
}

export type AudienceType = 'GENERAL' | 'TECHNICAL' | 'BUSINESS' | 'ACADEMIC' | 'executive' | 'technical' | 'general';
export type FormalityType = 'INFORMAL' | 'NEUTRAL' | 'FORMAL' | 'casual' | 'neutral' | 'formal';

export interface ProjectRequest {
  title: string;
  description: string;
  audience: AudienceType;
  formality: FormalityType;
  domain: string;
}

export type ProjectStatus = 'CREATED' | 'PROCESSING' | 'COMPLETED';

export interface ProjectResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  audience: AudienceType;
  formality: FormalityType;
  domain: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SpeechActType = 'representatives' | 'directives' | 'commissives' | 'expressives' | 'declaratives' | 'statement' | 'question' | 'emphasis';

export interface ScriptSegmentResponse {
  id: string;
  projectId: string;
  sectionName?: string;
  start: number;
  end: number;
  text: string;
  speechAct: SpeechActType;
}

export interface PostureEventResponse {
  projectId: string;
  totalBadPostures: number;
  totalDurationSeconds: number;
  detectedActions: DetectedActionResponse[];
}

export interface DetectedActionResponse {
  actionName: string;
  periods: ActionPeriodResponse[];
  summary: ActionSummaryResponse;
}

export interface ActionPeriodResponse {
  startFrame: number;
  endFrame: number;
  durationSeconds: number;
}

export interface ActionSummaryResponse {
  totalDurationSeconds: number;
  occurrenceCount: number;
}

export type SuggestionType = 'modify' | 'add' | 'remove' | 'keep' | 'delete';

export interface SuggestionResponse {
  id: string;
  projectId: string;
  sectionId: string;
  type: SuggestionType;
  suggestedText?: string;
  originalText?: string;
  explanation?: string;
  rationale?: string;
}

export interface VideoUploadRequest {
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface VideoResponse {
  id: string;
  projectId: string;
  url: string;
  duration: number;
  thumbnail?: string;
  resolution: ResolutionResponse;
}

export interface ResolutionResponse {
  width: number;
  height: number;
}

// Backward compatibility aliases for existing frontend code
export type User = UserResponse;
export type Project = ProjectResponse;
export type Video = VideoResponse;
export type ScriptSegment = ScriptSegmentResponse;
export type PostureEvent = PostureEventResponse;
export type DetectedAction = DetectedActionResponse;
export type ActionPeriod = ActionPeriodResponse;
export type ActionSummary = ActionSummaryResponse;
export type Suggestion = SuggestionResponse;
export type VideoUpload = VideoUploadRequest;
export type Resolution = ResolutionResponse;

// Additional types needed for the frontend that aren't in the API spec
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
  stars: number;
  totalEvents: number;
}