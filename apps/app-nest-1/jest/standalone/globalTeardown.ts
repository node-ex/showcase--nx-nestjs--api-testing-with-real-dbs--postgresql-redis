import type { Config } from '@jest/types';
import { debug as _debug } from 'debug';

const debug = _debug('jest-real-dbs:teardown');

export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  debug('standalone teardown.ts');

  await teardownDatabase();
  await teardownCache();
};

/**
 * Important steps:
 * - Drop all test databases
 * - Destroy the TypeORM DataSource for the template database initialized in the global setup
 */
async function teardownDatabase() {
  const dataSource = globalThis.__TYPEORM_DATA_SOURCE_SYSTEM_DATABASE__;
  const testDatabasesResult = await dataSource.query<{ datname: string }[]>(`
    SELECT datname
    FROM pg_database
    WHERE datname LIKE 'test_%'
    AND datname NOT IN ('postgres', 'template0', 'template1')
  `);
  const testDatabases = testDatabasesResult.map((row) => row.datname);
  debug('test databases before dropping them', testDatabases);

  for (const dbName of testDatabases) {
    try {
      await dataSource.query(`DROP DATABASE IF EXISTS ${dbName};`);
      debug(`Database dropped successfully: ${dbName}`);
    } catch (error) {
      debug(`Failed to drop database: ${dbName}`, error);
    }
  }
  debug('all test databases dropped');

  const remainingDatabasesResult = await dataSource.query<
    { datname: string }[]
  >(`
    SELECT datname
    FROM pg_database
    WHERE datname LIKE 'test_%'
    AND datname NOT IN ('postgres', 'template0', 'template1')
  `);
  const remainingDatabases = remainingDatabasesResult.map((row) => row.datname);
  debug('test databases after dropping them', remainingDatabases);

  await dataSource.destroy();
}

async function teardownCache() {
  debug('no need to teardown cache');

  return Promise.resolve();
}
