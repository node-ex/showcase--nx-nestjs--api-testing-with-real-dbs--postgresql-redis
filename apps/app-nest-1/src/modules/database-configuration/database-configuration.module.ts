import { Module } from '@nestjs/common';
import { DatabaseConfigurationService } from './services/database-configuration.service';
import { databaseConfigModuleImports } from './imports/database-config-module.imports';

@Module({
  imports: [...databaseConfigModuleImports],
  providers: [DatabaseConfigurationService],
  exports: [DatabaseConfigurationService],
})
export class DatabaseConfigurationModule {}
