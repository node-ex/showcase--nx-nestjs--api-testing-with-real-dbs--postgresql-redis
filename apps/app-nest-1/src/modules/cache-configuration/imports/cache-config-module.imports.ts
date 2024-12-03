import { ConfigModule } from '@nestjs/config';
import { cacheConfig } from '../configs/cache.config';

export const cacheConfigModuleImports = [ConfigModule.forFeature(cacheConfig)];
