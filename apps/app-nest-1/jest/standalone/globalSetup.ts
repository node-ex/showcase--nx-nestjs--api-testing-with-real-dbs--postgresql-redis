import type { Config } from '@jest/types';
import { debug as _debug } from 'debug';
import { createAppAndExtractTypeormDataSource } from '../../src/modules/typeorm-data-sources/utils/typeorm-data-sources.utils';
import {
  debugCacheEnvironmentVariables,
  debugDatabaseEnvironmentVariables,
} from './utils/debug.utils';
import { Redis } from 'ioredis';

const debug = _debug('jest-real-dbs:setup');

export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  /** For outputting next debug message on a new line */
  debug('');
  debug('standalone setup.ts');

  await setupDatabase();
  await setupCache();
};

/**
 * Important steps:
 * - Create and initialize a new TypeORM DataSource for the template database
 * - Store a reference to the initialized TypeORM DataSource in globalThis
 */
async function setupDatabase() {
  debugDatabaseEnvironmentVariables(debug);

  const dataSource = await createAppAndExtractTypeormDataSource();
  await dataSource.initialize();

  globalThis.__GLOBAL_TYPEORM_DATA_SOURCE_TEMPLATE_DATABASE__ = dataSource;
}

async function setupCache() {
  debugCacheEnvironmentVariables(debug);

  const host = process.env['CACHE__HOST']!;
  const port = parseInt(process.env['CACHE__PORT']!, 10);
  const password = process.env['CACHE__PASSWORD'];
  const keyPrefix = process.env['CACHE__KEY_PREFIX'];

  try {
    const connection = new Redis({
      host,
      port,
      ...(password != null ? { password } : {}),
      ...(keyPrefix != null ? { keyPrefix } : {}),
      lazyConnect: true,
    });
    await connection.connect();
    debug('cache connection test successful');
    connection.disconnect();
  } catch (e) {
    debug('cache connection test error', e);
    throw e;
  }
}
