import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';

@Module({
  imports: [],
  controllers: [AppController, UsersController, ProjectsController],
  providers: [AppService, UsersService, ProjectsService],
})
export class AppModule {}
