import type { DataSource } from 'typeorm';
import type { Client } from 'pg';

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
}

export {};
