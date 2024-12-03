import { Module } from '@nestjs/common';
import { GreetingController } from './greeting.controller';
import { GreetingService } from './greeting.service';
import { greetingConfigModuleImports } from './imports/greeting-config-module.imports';

@Module({
  imports: [...greetingConfigModuleImports],
  controllers: [GreetingController],
  providers: [GreetingService],
})
export class GreetingModule {}
