import { Module } from '@nestjs/common';
import { GreetingModule } from '../greeting/greeting.module';
import { rootConfigModuleImports } from '../../shared/imports/root-config-module.imports';

@Module({
  imports: [...rootConfigModuleImports, GreetingModule],
})
export class CoreModule {}
