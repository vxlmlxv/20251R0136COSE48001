import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  locale: string;

  @IsEnum(['free', 'pro', 'enterprise'])
  plan: 'free' | 'pro' | 'enterprise';
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsEnum(['free', 'pro', 'enterprise'])
  plan?: 'free' | 'pro' | 'enterprise';
}
