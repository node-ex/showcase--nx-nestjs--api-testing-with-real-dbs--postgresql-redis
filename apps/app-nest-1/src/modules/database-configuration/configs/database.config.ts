import { registerAs } from '@nestjs/config';

const DATABASE_CONFIG_NAMESPACE = 'databaseConfig';

export const databaseConfig = registerAs(DATABASE_CONFIG_NAMESPACE, () => ({
  host: process.env['DATABASE__HOST']!,
  port: parseInt(process.env['DATABASE__PORT']!, 10),
  username: process.env['DATABASE__USERNAME']!,
  password: process.env['DATABASE__PASSWORD']!,
  database: process.env['DATABASE__DATABASE']!,
  shouldSynchronize: process.env['DATABASE__SYNCHRONIZE'] === 'true',
}));
