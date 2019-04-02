import { statSync } from 'fs';

export function validate(p, ui) {
  return migrationsPath => {
    let stats;

    try {
      stats = statSync(migrationsPath);
    } catch (e) {
      if (e.code === 'ENOENT') {
        ui.error(`Directory ${migrationsPath} does not exist`);
        process.exit(1);
      }

      throw e;
    }

    if (!stats.isDirectory()) {
      ui.error(`${migrationsPath} is not a directory!`);
      process.exit(1);
    }
  };
}
