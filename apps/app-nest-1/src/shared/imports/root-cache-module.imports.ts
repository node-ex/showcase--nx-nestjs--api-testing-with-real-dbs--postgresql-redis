import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheConfigurationModule } from '../../modules/cache-configuration/cache-configuration.module';
import { CacheConfigurationService } from '../../modules/cache-configuration/services/cache-configuration.service';

type GenericUseFactory = (...args: any[]) => any;

export const rootCacheModuleImports = [
  RedisModule.forRootAsync({
    imports: [CacheConfigurationModule],
    useFactory: ((cacheConfigurationService: CacheConfigurationService) =>
      cacheConfigurationService.getRedisModuleOptions()) as GenericUseFactory,
    inject: [CacheConfigurationService],
  }),
];
