import { Inject, Injectable } from '@nestjs/common';
import { cacheConfig as _cacheConfig } from '../configs/cache.config';
import { ConfigType } from '@nestjs/config';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

@Injectable()
export class CacheConfigurationService {
  constructor(
    @Inject(_cacheConfig.KEY)
    private cacheConfig: ConfigType<typeof _cacheConfig>,
  ) {}

  getRedisModuleOptions(): RedisModuleOptions {
    return {
      config: {
        host: this.cacheConfig.host,
        port: this.cacheConfig.port,
        ...(this.cacheConfig.password
          ? { password: this.cacheConfig.password }
          : {}),
        ...(this.cacheConfig.keyPrefix
          ? { keyPrefix: this.cacheConfig.keyPrefix }
          : {}),
      },
    };
  }
}
