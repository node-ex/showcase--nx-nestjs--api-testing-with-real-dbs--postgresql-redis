import type { Config } from '@jest/types';
import { debug as _debug } from 'debug';
import { createAppAndExtractTypeormDataSource } from '../../src/modules/typeorm-data-sources/utils/typeorm-data-sources.utils';
import { debugDatabaseEnvironmentVariables } from './utils/debug.utils';

const debug = _debug('jest-real-dbs:setup');

/**
 * Important steps:
 * - Create and initialize a new TypeORM DataSource for the template database
 * - Store a reference to the initialized TypeORM DataSource in globalThis
 */
export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  /** For outputting next debug message on a new line */
  debug('');
  debug('standalone setup.ts');

  await setupDatabase();
};

async function setupDatabase() {
  globalThis.__TEMPLATE_DATABASE_NAME__ = process.env['DATABASE__DATABASE']!;

  process.env['DATABASE__DATABASE'] = 'postgres';
  debugDatabaseEnvironmentVariables(debug);

  const dataSource = await createAppAndExtractTypeormDataSource();
  await dataSource.initialize();

  globalThis.__TYPEORM_DATA_SOURCE_SYSTEM_DATABASE__ = dataSource;
}
