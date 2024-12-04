import type { DataSource } from 'typeorm';
import type { Client } from 'pg';
import type { Redis } from 'ioredis';

declare global {
  /* ################## */
  /* ### PostgreSQL ### */
  /* ################## */

  /**
   * Available in the global Node.js context
   */
  // eslint-disable-next-line no-var
  var __TEMPLATE_DATABASE_NAME__: string;
  // eslint-disable-next-line no-var
  var __TYPEORM_DATA_SOURCE_SYSTEM_DATABASE__: DataSource;

  /**
   * Available in the isolated test context
   */
  // eslint-disable-next-line no-var
  var __TYPEORM_DATA_SOURCE_TEST_DATABASE__: DataSource;
  // eslint-disable-next-line no-var
  var __PG_CLIENT_TEST_DATABASE__: Client;

  /* ############# */
  /* ### Redis ### */
  /* ############# */

  /**
   * Available in the isolated test context
   */
  // eslint-disable-next-line no-var
  var __IOREDIS_CONNECTION_TEST_KEY_PREFIX__: Redis;
}

export {};
