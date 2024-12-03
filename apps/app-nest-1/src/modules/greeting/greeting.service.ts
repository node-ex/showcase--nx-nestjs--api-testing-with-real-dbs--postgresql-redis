import { Injectable } from '@nestjs/common';

@Injectable()
export class GreetingService {
  getGreeting(): { message: string } {
    return { message: 'Hello from the API' };
  }
}
