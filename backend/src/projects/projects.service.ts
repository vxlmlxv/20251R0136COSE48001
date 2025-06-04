import { Injectable } from '@nestjs/common';
import {
  Project,
  Video,
  ScriptSegment,
  BehaviorEvent,
  BadgeScore,
  Suggestion,
} from '../interfaces/project.interface';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateVideoDto,
  CreateBehaviorEventDto,
  CreateScriptSegmentDto,
} from '../dto/project.dto';
import {
  mockProjects,
  mockVideos,
  mockScriptSegments,
  mockBehaviorEvents,
  mockBadgeScores,
  mockSuggestions,
} from '../data/mock-data';

@Injectable()
export class ProjectsService {
  private projects: Project[] = [...mockProjects];
  private videos: Video[] = [...mockVideos];
  private scriptSegments: ScriptSegment[] = [...mockScriptSegments];
  private behaviorEvents: BehaviorEvent[] = [...mockBehaviorEvents];
  private badgeScores: BadgeScore[] = [...mockBadgeScores];
  private suggestions: Suggestion[] = [...mockSuggestions];

  // Projects
  findAllProjects(userId?: string): Project[] {
    if (userId) {
      return this.projects.filter((project) => project.userId === userId);
    }
    return this.projects;
  }

  findProject(id: string): Project | undefined {
    return this.projects.find((project) => project.id === id);
  }

  createProject(createProjectDto: CreateProjectDto): Project {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      status: 'created',
      createdAt: new Date().toISOString(),
      ...createProjectDto,
    };
    this.projects.push(newProject);
    return newProject;
  }

  updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Project | undefined {
    const projectIndex = this.projects.findIndex(
      (project) => project.id === id,
    );
    if (projectIndex === -1) return undefined;

    this.projects[projectIndex] = {
      ...this.projects[projectIndex],
      ...updateProjectDto,
    };
    return this.projects[projectIndex];
  }

  removeProject(id: string): boolean {
    const projectIndex = this.projects.findIndex(
      (project) => project.id === id,
    );
    if (projectIndex === -1) return false;

    this.projects.splice(projectIndex, 1);
    // Also remove related data
    this.videos = this.videos.filter((video) => video.projectId !== id);
    this.scriptSegments = this.scriptSegments.filter(
      (segment) => segment.projectId !== id,
    );
    this.behaviorEvents = this.behaviorEvents.filter(
      (event) => event.projectId !== id,
    );
    this.badgeScores = this.badgeScores.filter(
      (score) => score.projectId !== id,
    );
    this.suggestions = this.suggestions.filter(
      (suggestion) => suggestion.projectId !== id,
    );
    return true;
  }

  // Videos
  findProjectVideos(projectId: string): Video[] {
    return this.videos.filter((video) => video.projectId === projectId);
  }

  createVideo(createVideoDto: CreateVideoDto): Video {
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      ...createVideoDto,
    };
    this.videos.push(newVideo);
    return newVideo;
  }

  // Script Segments
  findProjectScriptSegments(projectId: string): ScriptSegment[] {
    return this.scriptSegments.filter(
      (segment) => segment.projectId === projectId,
    );
  }

  createScriptSegment(createSegmentDto: CreateScriptSegmentDto): ScriptSegment {
    const newSegment: ScriptSegment = {
      id: `segment-${Date.now()}`,
      ...createSegmentDto,
    };
    this.scriptSegments.push(newSegment);
    return newSegment;
  }

  // Behavior Events
  findProjectBehaviorEvents(projectId: string): BehaviorEvent[] {
    return this.behaviorEvents.filter((event) => event.projectId === projectId);
  }

  createBehaviorEvent(createEventDto: CreateBehaviorEventDto): BehaviorEvent {
    const newEvent: BehaviorEvent = {
      id: `event-${Date.now()}`,
      ...createEventDto,
    };
    this.behaviorEvents.push(newEvent);
    return newEvent;
  }

  // Badge Scores
  findProjectBadgeScores(projectId: string): BadgeScore[] {
    return this.badgeScores.filter((score) => score.projectId === projectId);
  }

  // Suggestions
  findProjectSuggestions(projectId: string): Suggestion[] {
    return this.suggestions.filter(
      (suggestion) => suggestion.projectId === projectId,
    );
  }
}
