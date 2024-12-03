import { Module } from '@nestjs/common';
import { GreetingController } from './greeting.controller';
import { GreetingService } from './greeting.service';

@Module({
  imports: [],
  controllers: [GreetingController],
  providers: [GreetingService],
})
export class GreetingModule {}
