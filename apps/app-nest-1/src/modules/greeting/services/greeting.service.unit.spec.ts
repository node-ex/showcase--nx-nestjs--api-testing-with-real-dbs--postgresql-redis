import { Test } from '@nestjs/testing';
import { GreetingService } from './greeting.service';
import { ConfigType } from '@nestjs/config';
import { greetingConfig } from '../configs/greeting.config';

describe('GreetingService', () => {
  let service: GreetingService;

  beforeAll(async () => {
    const mockGreetingConfig: ConfigType<typeof greetingConfig> = {
      text: 'Hello, test World!',
    };

    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: greetingConfig.KEY,
          useValue: mockGreetingConfig,
        },
        GreetingService,
      ],
    }).compile();

    service = app.get(GreetingService);
  });

  describe('getGreeting', () => {
    it('should return a static text', () => {
      expect(service.getGreeting()).toEqual({ message: 'Hello, test World!' });
    });
  });
});
