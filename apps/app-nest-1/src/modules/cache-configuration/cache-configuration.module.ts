import { Module } from '@nestjs/common';
import { CacheConfigurationService } from './services/cache-configuration.service';
import { cacheConfigModuleImports } from './imports/cache-config-module.imports';

@Module({
  imports: [...cacheConfigModuleImports],
  providers: [CacheConfigurationService],
  exports: [CacheConfigurationService],
})
export class CacheConfigurationModule {}
