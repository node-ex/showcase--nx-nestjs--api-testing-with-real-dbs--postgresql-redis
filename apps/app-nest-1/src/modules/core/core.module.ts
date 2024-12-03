import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GreetingModule } from '../greeting/greeting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // No need to import in other modules
      isGlobal: true,
      expandVariables: true,
      // cache: true,
    }),
    GreetingModule,
  ],
})
export class CoreModule {}
