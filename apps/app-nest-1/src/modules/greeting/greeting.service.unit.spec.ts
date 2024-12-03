import { Test } from '@nestjs/testing';
import { GreetingService } from './greeting.service';

describe('GreetingService', () => {
  let service: GreetingService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [GreetingService],
    }).compile();

    service = app.get(GreetingService);
  });

  describe('getGreeting', () => {
    it('should return a static text', () => {
      expect(service.getGreeting()).toEqual({ message: 'Hello from the API' });
    });
  });
});
