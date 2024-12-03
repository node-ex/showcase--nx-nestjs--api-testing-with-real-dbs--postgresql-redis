import { Controller, Get } from '@nestjs/common';

import { GreetingService } from './greeting.service';

@Controller('greeting')
export class GreetingController {
  constructor(private readonly greetingService: GreetingService) {}

  @Get()
  getGreeting() {
    return this.greetingService.getGreeting();
  }
}
