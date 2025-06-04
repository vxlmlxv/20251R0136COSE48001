import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateVideoDto,
  CreateBehaviorEventDto,
  CreateScriptSegmentDto,
} from '../dto/project.dto';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.projectsService.findAllProjects(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const project = this.projectsService.findProject(id);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    const project = this.projectsService.updateProject(id, updateProjectDto);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const success = this.projectsService.removeProject(id);
    if (!success) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Project deleted successfully' };
  }

  // Videos
  @Get(':id/videos')
  getProjectVideos(@Param('id') projectId: string) {
    return this.projectsService.findProjectVideos(projectId);
  }

  @Post(':id/videos')
  createVideo(
    @Param('id') projectId: string,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    createVideoDto.projectId = projectId;
    return this.projectsService.createVideo(createVideoDto);
  }

  // Script Segments
  @Get(':id/script-segments')
  getProjectScriptSegments(@Param('id') projectId: string) {
    return this.projectsService.findProjectScriptSegments(projectId);
  }

  @Post(':id/script-segments')
  createScriptSegment(
    @Param('id') projectId: string,
    @Body() createSegmentDto: CreateScriptSegmentDto,
  ) {
    createSegmentDto.projectId = projectId;
    return this.projectsService.createScriptSegment(createSegmentDto);
  }

  // Behavior Events
  @Get(':id/behavior-events')
  getProjectBehaviorEvents(@Param('id') projectId: string) {
    return this.projectsService.findProjectBehaviorEvents(projectId);
  }

  @Post(':id/behavior-events')
  createBehaviorEvent(
    @Param('id') projectId: string,
    @Body() createEventDto: CreateBehaviorEventDto,
  ) {
    createEventDto.projectId = projectId;
    return this.projectsService.createBehaviorEvent(createEventDto);
  }

  // Badge Scores
  @Get(':id/badge-scores')
  getProjectBadgeScores(@Param('id') projectId: string) {
    return this.projectsService.findProjectBadgeScores(projectId);
  }

  // Suggestions
  @Get(':id/suggestions')
  getProjectSuggestions(@Param('id') projectId: string) {
    return this.projectsService.findProjectSuggestions(projectId);
  }
}
