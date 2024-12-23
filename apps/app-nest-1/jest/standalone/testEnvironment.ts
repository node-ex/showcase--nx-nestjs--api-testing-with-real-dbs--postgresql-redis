import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';
import { TestEnvironment as NodeEnvironment } from 'jest-environment-node';
import { debug as _debug } from 'debug';
import { createHash } from 'crypto';
import {
  debugCacheEnvironmentVariables,
  debugDatabaseEnvironmentVariables,
} from './utils/debug.utils';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const debug = _debug('jest-real-dbs:environment');

export default class TestEnvironment extends NodeEnvironment {
  testFilePath: string;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    debug('standalone TestEnvironment.constructor');

    this.testFilePath = context.testPath;

    debug('this.testFilePath', this.testFilePath);
  }

  override async setup() {
    await super.setup();

    debug('standalone TestEnvironment.setup');

    await this.setupDatabase();
    await this.setupCache();
  }

  override async teardown() {
    await super.teardown();

    debug('standalone TestEnvironment.teardown');

    await this.teardownDatabase();
    await this.teardownCache();
  }

  override getVmContext() {
    /* A lot of calls... */
    // debug('standalone TestEnvironment.getVmContext');
    return super.getVmContext();
  }

  /**
   * Important steps:
   * - Create and connect a new pg Client for the system database
   * - Terminate all connections to the template database
   * - Create a new test database from the template database
   * - Set environment variables of the isolated test context to values required to connect to the test database
   * - Store a reference to the pg Client for the system database in globalThis
   */
  private async setupDatabase() {
    const host = process.env['DATABASE__HOST']!;
    const port = process.env['DATABASE__PORT']!;
    const username = process.env['DATABASE__USERNAME']!;
    const password = process.env['DATABASE__PASSWORD']!;
    const templateDatabaseName = process.env['DATABASE__DATABASE']!;
    const systemDatabaseName = 'postgres';

    const client = new Client({
      host,
      port: parseInt(port, 10),
      user: username,
      password,
      database: systemDatabaseName,
    });

    await client.connect();

    /**
     * When creating a new database via a template database, the
     * template database must not have any connections to it.
     */
    await client.query(
      `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
        AND pid <> pg_backend_pid();
    `,
      [templateDatabaseName],
    );

    /**
     * Requirements for the DB name:
     * - Can contain only ASCII characters
     * - Must be at least 1 character long and no more than 64 bytes long
     *
     * MD5 hash in a hexadecimal format is 32 characters long and contains only
     * ASCII letters and numbers, so it should be a valid DB name.
     *
     * Sources
     * - https://www.postgresql.org/docs/current/datatype-character.html
     *   - See the name type documentation
     */
    const testDatabaseName =
      'test_' + createHash('md5').update(this.testFilePath).digest('hex');
    /*
     * Parameterized placeholders cannot be used for database, table, or
     * column names.
     */
    await client.query(
      /* Copies not only the DDL, but also the data, last SEQUENCE numbers, etc. */
      `CREATE DATABASE ${testDatabaseName} TEMPLATE ${templateDatabaseName}`,
    );

    /**
     * When DATABASE__* environment variables are set via process.env here,
     * tests do not see this change because they run inside the
     * `this.global` vm context that is isolated from the global Node.js
     * context. Only environment variables present in the global Node.js
     * context (process.env) at the time of isolated context creation are
     * available to the tests.
     *
     * this.global allows to access isolated context used for running tests.
     */
    this.global.process.env['DATABASE__DATABASE'] = testDatabaseName;

    globalThis.__TEST_ENVIRONMENT_PG_CLIENT_SYSTEM_DATABASE__ = client;

    debugDatabaseEnvironmentVariables(debug);
    debugDatabaseEnvironmentVariables(
      debug,
      this.global.process.env,
      'this.global.process.env',
    );
  }

  private async setupCache() {
    /**
     * Requirements for the key (prefix):
     * - Keys are binary safe, so even content of a JPEG file can be used as a key
     * - Must be at least 1 character long and no more than 512 MB long
     *
     * MD5 hash in a hexadecimal format is 32 characters long and contains only
     * ASCII letters and numbers, so it should be a valid key (prefix).
     *
     * Sources
     * - https://redis.io/docs/latest/develop/use/keyspace/
     */
    const redisKeyPrefix =
      createHash('md5').update(this.testFilePath).digest('hex') + ':';
    /*
     * When CACHE__* environment variable is set via process.env here, tests do
     * not see this change because they are run inside the `this.global` vm
     * context that is isolated from the global Node.js context. Only
     * environment variables present in the global Node.js context
     * (process.env) at the time of isolated context creation are available to
     * the tests.
     *
     * But setting it via this.global.process.env works.
     */
    this.global.process.env['CACHE__KEY_PREFIX'] = redisKeyPrefix;

    debugCacheEnvironmentVariables(debug);
    debugCacheEnvironmentVariables(
      debug,
      this.global.process.env,
      'this.global.process.env',
    );

    return Promise.resolve();
  }

  /**
   * Important steps:
   * - Drop the test database (there should be no connections to it)
   * - End the pg Client connection for the system database
   */
  private async teardownDatabase() {
    debugDatabaseEnvironmentVariables(
      debug,
      this.global.process.env,
      'this.global.process.env',
    );

    const testDatabaseName = this.global.process.env['DATABASE__DATABASE']!;
    const client = globalThis.__TEST_ENVIRONMENT_PG_CLIENT_SYSTEM_DATABASE__;
    /*
     * Parameterized placeholders cannot be used for database, table, or
     * column names.
     */
    await client.query(`DROP DATABASE IF EXISTS ${testDatabaseName}`);
    await client.end();
  }

  private async teardownCache() {
    debug('no need for cache teardown');

    return Promise.resolve();
  }
}
