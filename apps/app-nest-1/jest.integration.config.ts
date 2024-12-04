import type { Config } from '@jest/types';
import unitTestConfig from './jest.unit.config';

export default {
  ...unitTestConfig,
  /*
   * Modified the default value:
   * https://github.com/nrwl/nx/blob/master/packages/jest/preset/jest-preset.ts#L4
   */
  testMatch: ['**/?(*.)integration.spec.[jt]s?(x)'],
  globalSetup: './jest/standalone/globalSetup.ts',
  globalTeardown: './jest/standalone/globalTeardown.ts',
  testEnvironment: './jest/standalone/testEnvironment.ts',
  setupFilesAfterEnv: [
    './jest/standalone/setupFilesAfterEnv/setupInfraConnections.ts',
  ],
  maxWorkers: 1,
} as Config.InitialOptions;
