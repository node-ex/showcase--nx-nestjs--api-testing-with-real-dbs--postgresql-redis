import { Module } from '@nestjs/common';
import { rootConfigModuleImports } from '../../shared/imports/root-config-module.imports';
import { DatabaseConfigurationModule } from '../database-configuration/database-configuration.module';

@Module({
  imports: [...rootConfigModuleImports, DatabaseConfigurationModule],
})
export class TypeormDataSourcesModule {}
