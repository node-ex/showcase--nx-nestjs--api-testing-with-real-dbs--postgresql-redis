import { debug as _debug } from 'debug';

const debug = _debug('jest-real-dbs:test:cache');

describe('Cache test', () => {
  it('test1', async () => {
    debug("process.env['CACHE__HOST']", process.env['CACHE__HOST']);
    debug("process.env['CACHE__PORT']", process.env['CACHE__PORT']);
    debug("process.env['CACHE__KEY_PREFIX']", process.env['CACHE__KEY_PREFIX']);
    debug("process.env['CACHE__PASSWORD']", process.env['CACHE__PASSWORD']);

    await globalThis.__IOREDIS_CONNECTION_TEST_KEY_PREFIX__.set(
      'test1',
      'test',
    );
    const keyNames =
      await globalThis.__IOREDIS_CONNECTION_TEST_KEY_PREFIX__.keys('*');
    debug('test1 keyNames', keyNames);

    expect(true).toBe(true);
  });

  it('test2', async () => {
    await globalThis.__IOREDIS_CONNECTION_TEST_KEY_PREFIX__.set(
      'test2',
      'test',
    );
    const keyNames =
      await globalThis.__IOREDIS_CONNECTION_TEST_KEY_PREFIX__.keys('*');
    debug('test2 keyNames', keyNames);

    expect(true).toBe(true);
  });
});
