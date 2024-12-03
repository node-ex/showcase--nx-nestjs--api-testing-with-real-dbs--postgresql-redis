import { registerAs } from '@nestjs/config';

const CACHE_CONFIG_NAMESPACE = 'cacheConfig';

export const cacheConfig = registerAs(CACHE_CONFIG_NAMESPACE, () => ({
  host: process.env['CACHE__HOST']!,
  port: parseInt(process.env['CACHE__PORT']!, 10),
  password: process.env['CACHE__PASSWORD'],
  keyPrefix: process.env['CACHE__KEY_PREFIX'],
}));
