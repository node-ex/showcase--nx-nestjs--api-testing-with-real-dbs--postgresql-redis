import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { debug as _debug } from 'debug';
import { Client } from 'pg';
import { rootConfigModuleImports } from '../../../src/shared/imports/root-config-module.imports';
import { rootDatabaseModuleImports } from '../../../src/shared/imports/root-database-module.imports';
import { rootCacheModuleImports } from '../../../src/shared/imports/root-cache-module.imports';
import { debugDatabaseEnvironmentVariables } from '../utils/debug.utils';
import { DEFAULT_REDIS, RedisService } from '@liaoliaots/nestjs-redis';

const debug = _debug('jest-real-dbs:setupFilesAfterEnv:setupInfraConnections');

beforeAll(async () => {
  debug('beforeAll');

  await databaseBeforeAll();
  await cacheBeforeAll();
});

beforeEach(async () => {
  debug('beforeEach');

  await databaseBeforeEach();
});

afterEach(async () => {
  debug('afterEach');

  await cacheAfterEach();
});

afterAll(async () => {
  debug('afterAll');

  await databaseAfterAll();
  await cacheAfterAll();
});

/**
 * Important steps:
 * - Create a new NestJS app for accessing the TypeORM DataSource
 * - Retrieve the initialized TypeORM DataSource for the test database from the app's DI container
 * - Store a reference to the TypeORM DataSource for the test database in globalThis
 * - Create and connect a new pg Client for the test database
 * - Store a reference to the pg Client for the test database in globalThis
 */
async function databaseBeforeAll() {
  /**
   * Create a new NestJS application with the TypeOrmModule that uses
   * environment variable values set in the testEnvironment.ts file.
   */
  const app = await Test.createTestingModule({
    imports: [...rootConfigModuleImports, ...rootDatabaseModuleImports],
  }).compile();

  const dataSource = app.get(DataSource);
  debug('dataSource.isInitialized', dataSource.isInitialized);
  globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__ = dataSource;

  debugDatabaseEnvironmentVariables(debug);

  const host = process.env['DATABASE__HOST']!;
  const port = process.env['DATABASE__PORT']!;
  const username = process.env['DATABASE__USERNAME']!;
  const password = process.env['DATABASE__PASSWORD']!;
  const testDatabase = process.env['DATABASE__DATABASE']!;

  const client = new Client({
    host,
    port: parseInt(port, 10),
    user: username,
    password,
    database: testDatabase,
  });

  await client.connect();
  globalThis.__PG_CLIENT_TEST_DATABASE__ = client;
}

async function cacheBeforeAll() {
  /**
   * Create a new NestJS application with the RedisModule that uses
   * the environment variables set in the testEnvironment.ts file.
   */
  const app = await Test.createTestingModule({
    imports: [...rootConfigModuleImports, ...rootCacheModuleImports],
  }).compile();

  const redisService = app.get<RedisService>(RedisService);
  const redis = redisService.getOrThrow(DEFAULT_REDIS);
  globalThis.__IOREDIS_CONNECTION_TEST_KEY_PREFIX__ = redis;

  debug("process.env['CACHE__KEY_PREFIX']", process.env['CACHE__KEY_PREFIX']);
}

/**
 * Important steps:
 * - Delete all data from all tables in the test database
 */
async function databaseBeforeEach() {
  debug('deleting data from all tables');

  const dataSource = globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__;
  /*
   * Data is deleted from all tables in the beforeEach hook and not in the
   * afterEach hook to delete data copied from the template database before
   * the first test is run.
   */
  const truncateAllTablesSql = `
    DO $$
    DECLARE
        tbl RECORD;
        rows_deleted INT;
    BEGIN
        -- Start a transaction
        BEGIN
            -- Loop through all tables in the current database
            FOR tbl IN
                SELECT tablename
                FROM pg_tables
                WHERE schemaname = 'public'
            LOOP
                BEGIN
                    -- Disable all triggers on the current table
                    EXECUTE format('ALTER TABLE public.%I DISABLE TRIGGER ALL;', tbl.tablename);

                    -- Delete all data from the current table
                    EXECUTE format('DELETE FROM public.%I;', tbl.tablename);

                    -- Get the number of rows deleted
                    GET DIAGNOSTICS rows_deleted = ROW_COUNT;
                    IF rows_deleted > 0 THEN
                        RAISE NOTICE 'Deleted % rows from table: %', rows_deleted, tbl.tablename;
                    END IF;

                    -- Re-enable all triggers on the current table
                    EXECUTE format('ALTER TABLE public.%I ENABLE TRIGGER ALL;', tbl.tablename);
                EXCEPTION
                    WHEN OTHERS THEN
                        -- In case of an error, re-enable triggers and raise the error
                        EXECUTE format('ALTER TABLE public.%I ENABLE TRIGGER ALL;', tbl.tablename);
                        RAISE NOTICE 'An error occurred while processing table: % - Error: %', tbl.tablename, SQLERRM;
                        RAISE;
                END;
            END LOOP;
        END;

        RAISE NOTICE 'All tables processed successfully.';
    EXCEPTION
        WHEN OTHERS THEN
            -- Rollback the transaction if any error occurs
            RAISE NOTICE 'Transaction rolled back because an error occurred: %', SQLERRM;
            ROLLBACK;
            RAISE;
    END $$;
  `;
  await dataSource.query(truncateAllTablesSql);
  debug('data deleted from all tables');
}

async function cacheAfterEach() {
  debug('deleting all cache keys with a specific prefix');

  const redis = globalThis.__IOREDIS_CONNECTION_TEST_KEY_PREFIX__;
  const pattern = process.env['CACHE__KEY_PREFIX']! + '*';
  let cursor = '0';
  do {
    const [nextCursor, keysWithPrefix] = await redis.scan(
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      100,
    );
    cursor = nextCursor;
    debug(
      `cache keys to delete (${String(
        keysWithPrefix.length,
      )}): ${keysWithPrefix.join(', ')}`,
    );

    /**
     * Keys returned by the SCAN command are prefixed with the prefix set in
     * the RedisModule.
     *
     * https://github.com/redis/ioredis#transparent-key-prefixing
     */
    const keysWithoutPrefix = keysWithPrefix.map((key) =>
      key.replace(process.env['CACHE__KEY_PREFIX']!, ''),
    );
    if (keysWithoutPrefix.length > 0) {
      const deletedKeyCount = await redis.del(...keysWithoutPrefix);
      debug(`count of deleted cache keys: ${String(deletedKeyCount)}`);
    }
  } while (cursor !== '0');
}

/**
 * Important steps:
 * - Destroy the TypeORM DataSource for the test database
 * - End the pg Client connection for the test database
 */
async function databaseAfterAll() {
  await globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.destroy();
  await globalThis.__PG_CLIENT_TEST_DATABASE__.end();
}

async function cacheAfterAll() {
  globalThis.__IOREDIS_CONNECTION_TEST_KEY_PREFIX__.disconnect();

  return Promise.resolve();
}
