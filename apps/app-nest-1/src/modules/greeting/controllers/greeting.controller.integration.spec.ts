import { Test, TestingModule } from '@nestjs/testing';
import { GreetingController } from './greeting.controller';
import { GreetingService } from '../services/greeting.service';
import { rootConfigModuleImports } from '../../../shared/imports/root-config-module.imports';
import { greetingConfigModuleImports } from '../imports/greeting-config-module.imports';

describe('GreetingController', () => {
  let app: TestingModule;
  let controller: GreetingController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        // Imports from the CoreModule
        ...rootConfigModuleImports,
        ...greetingConfigModuleImports,
      ],
      controllers: [GreetingController],
      providers: [GreetingService],
    }).compile();

    controller = app.get(GreetingController);
  });

  describe('getGreeting', () => {
    it('should return a static text', () => {
      expect(controller.getGreeting()).toEqual({
        message: 'Hello, World!',
      });
    });
  });
});
