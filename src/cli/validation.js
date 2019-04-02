import { parse } from 'url';
import { statSync } from 'fs';

export function validateDsn(dsn) {
  const p = parse(dsn);

  if (p.protocol !== 'mongodb:') {
    throw Error(`Protocol ${p.protocol} is not valid`);
  }
}

export function validateMigrationDirectory(migrationsPath) {
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
