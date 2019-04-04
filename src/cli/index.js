import yargs from 'yargs';
import { version } from '../../package.json';
import { checkDsn, checkMigrationDirectory } from './option-checkers';
import { Migrator, DatabaseStorage, FileStorage } from '../migrator';
import ui from './ui';

async function migratorWrap(argv, wrapFn) {
  const migrator = new Migrator(
    new FileStorage(argv.migrationsPath),
    new DatabaseStorage(argv.dsn)
  );

  try {
    await migrator.setup();
    await wrapFn(migrator);
  } catch (e) {
    ui.error(e);
  }

  await migrator.teardown();
}

yargs
  .scriptName('mongoose-migrate')
  .version(version)
  .option('dsn', {
    alias: 'd',
    demandOption: true,
    nargs: 1,
    describe: 'MongoDB dsn'
  })
  .option('migrationsPath', {
    alias: 'm',
    demandOption: true,
    nargs: 1,
    normalize: true,
    describe: 'Path to migrations directory',
    default: './migrations'
  })
  .check(argv => {
    checkDsn(argv.dsn);
    checkMigrationDirectory(argv.migrationsPath);

    return true;
  })
  .command({
    command: 'create <name>',
    describe: 'create migration',
    handler: argv => {
      migratorWrap(argv, async migrator => {
        const migrationName = await migrator.createMigration(argv.name);
        ui.info(`Migration created: ${migrationName}`);
      });
    }
  })
  .command({
    command: 'list',
    describe: 'list migrations',
    builder(yargs) {
      return yargs.option('pending', {
        alias: 'p',
        type: 'boolean',
        describe: 'Only pending migrations'
      });
    },
    handler: argv => {
      migratorWrap(argv, async migrator => {
        const options = 'pending' in argv ? { pending: true } : {};
        const migrations = await migrator.getMigrations(options);

        ui.printMigrationTable(migrations);
      });
    }
  })
  .command({
    command: 'up [migrations..]',
    describe: 'apply migrations',
    handler: argv => {
      migratorWrap(argv, async migrator => {
        const options = { pending: true };
        const migrations = argv.migrations || [];

        if (migrations.length > 0) {
          options.migrations = migrations;
        }

        const downMigrations = await migrator.getMigrations(options);
        for (let migration of downMigrations) {
          ui.info(`Applying migration ${migration.name}...`);
          await migrator.applyMigration(migration);
        }
      });
    }
  })
  .command({
    command: 'down <migrations..>',
    describe: 'rollback migrations',
    handler: argv => {
      migratorWrap(argv, async migrator => {
        const options = { pending: false, migrations: argv.migrations };
        const upMigrations = await migrator.getMigrations(options);

        for (let migration of upMigrations) {
          ui.info(`Rolling back migration ${migration.name}...`);
          await migrator.rollbackMigration(migration);
        }
      });
    }
  })
  .argv;
