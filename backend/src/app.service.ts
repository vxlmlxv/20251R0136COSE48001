import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Preffy Video Feedback API is running! 🎬';
  }
}
