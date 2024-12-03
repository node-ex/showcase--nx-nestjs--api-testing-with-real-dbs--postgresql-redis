import { Inject, Injectable } from '@nestjs/common';
import { greetingConfig as _greetingConfig } from '../configs/greeting.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class GreetingService {
  constructor(
    @Inject(_greetingConfig.KEY)
    private greetingConfig: ConfigType<typeof _greetingConfig>,
  ) {}

  getGreeting(): { message: string } {
    return { message: this.greetingConfig.text! };
  }
}
