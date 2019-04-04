import { parse } from 'url';
import { statSync } from 'fs';

/**
 * Validates dsn has mongodb protocol.
 *
 * @param {String} dsn
 */
export function checkDsn(dsn) {
  const p = parse(dsn);

  if (p.protocol !== 'mongodb:') {
    throw Error(`Protocol ${p.protocol} is not valid`);
  }
}

/**
 * Validates migrationsPath is a directory and it exists.
 *
 * @param {String} migrationsPath
 */
export function checkMigrationDirectory(migrationsPath) {
  let stats;

  try {
    stats = statSync(migrationsPath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw Error(`Directory ${migrationsPath} does not exist`);
    }

    throw e;
  }

  if (!stats.isDirectory()) {
    throw Error(`${migrationsPath} is not a directory!`);
  }
}
