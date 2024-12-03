import { Test, TestingModule } from '@nestjs/testing';
import { GreetingController } from './greeting.controller';
import { GreetingService } from './greeting.service';

describe('GreetingController', () => {
  let app: TestingModule;
  let controller: GreetingController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [GreetingController],
      providers: [GreetingService],
    }).compile();

    controller = app.get(GreetingController);
  });

  describe('getGreeting', () => {
    it('should return a static text', () => {
      expect(controller.getGreeting()).toEqual({
        message: 'Hello from the API',
      });
    });
  });
});
