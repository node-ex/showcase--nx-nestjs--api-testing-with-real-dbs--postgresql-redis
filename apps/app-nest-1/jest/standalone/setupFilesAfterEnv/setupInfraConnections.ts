import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { debug as _debug } from 'debug';
import { Client } from 'pg';
import { rootConfigModuleImports } from '../../../src/shared/imports/root-config-module.imports';
import { rootDatabaseModuleImports } from '../../../src/shared/imports/root-database-module.imports';
import { debugDatabaseEnvironmentVariables } from '../utils/debug.utils';

const debug = _debug('jest-real-dbs:setupFilesAfterEnv:setupInfraConnections');

beforeAll(async () => {
  debug('beforeAll');

  await databaseBeforeAll();
});

beforeEach(async () => {
  debug('beforeEach');

  await databaseBeforeEach();
});

afterAll(async () => {
  debug('afterAll');

  await databaseAfterAll();
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

/**
 * Important steps:
 * - Destroy the TypeORM DataSource for the test database
 * - End the pg Client connection for the test database
 */
async function databaseAfterAll() {
  await globalThis.__TYPEORM_DATA_SOURCE_TEST_DATABASE__.destroy();
  await globalThis.__PG_CLIENT_TEST_DATABASE__.end();
}
