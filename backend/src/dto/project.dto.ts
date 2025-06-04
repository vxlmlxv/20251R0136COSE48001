import { IsString, IsEnum, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(['general', 'technical', 'executive', 'academic'])
  audience: 'general' | 'technical' | 'executive' | 'academic';

  @IsEnum(['casual', 'neutral', 'formal'])
  formality: 'casual' | 'neutral' | 'formal';

  @IsString()
  domain: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['general', 'technical', 'executive', 'academic'])
  audience?: 'general' | 'technical' | 'executive' | 'academic';

  @IsOptional()
  @IsEnum(['casual', 'neutral', 'formal'])
  formality?: 'casual' | 'neutral' | 'formal';

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsEnum(['created', 'uploading', 'processing', 'analyzed', 'completed'])
  status?: 'created' | 'uploading' | 'processing' | 'analyzed' | 'completed';
}

class ResolutionDto {
  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}

export class CreateVideoDto {
  @IsString()
  projectId: string;

  @IsString()
  url: string;

  @IsNumber()
  duration: number;

  @ValidateNested()
  @Type(() => ResolutionDto)
  resolution: ResolutionDto;
}

export class CreateBehaviorEventDto {
  @IsString()
  projectId: string;

  @IsNumber()
  start: number;

  @IsNumber()
  end: number;

  @IsEnum(['gesture', 'facial', 'posture'])
  type: 'gesture' | 'facial' | 'posture';

  @IsString()
  category: string;

  @IsEnum(['low', 'medium', 'high'])
  severity: 'low' | 'medium' | 'high';
}

export class CreateScriptSegmentDto {
  @IsString()
  projectId: string;

  @IsNumber()
  start: number;

  @IsNumber()
  end: number;

  @IsString()
  text: string;

  @IsEnum(['statement', 'question', 'command', 'emphasis'])
  speechAct: 'statement' | 'question' | 'command' | 'emphasis';
}
