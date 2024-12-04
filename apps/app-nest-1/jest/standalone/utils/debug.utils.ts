import { Debugger } from 'debug';

export function debugDatabaseEnvironmentVariables(
  debug: Debugger,
  env = process.env,
  envName = 'process.env',
) {
  const databaseEnvVars = Object.keys(env).filter((key) =>
    key.startsWith('DATABASE__'),
  );

  debug(`Found ${envName} database variables:`);
  databaseEnvVars.forEach((key) => {
    debug(`${envName}['${key}']: ${String(env[key])}`);
  });
}