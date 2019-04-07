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
    process.exit(1);
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
        const migrationName = migrator.createMigration(argv.name);
        ui.info(`Migration created: ${migrationName}`);
      });
    }
  })
  .command({
    command: 'list',
    describe: 'list migrations',
    builder(yargs) {
      return yargs.option('all', {
        alias: 'a',
        type: 'boolean',
        describe: 'Show all migrations (only pending by default)'
      });
    },
    handler: argv => {
      migratorWrap(argv, async migrator => {
        const migrations = await migrator.getMigrations();
        const showAll = argv.all;

        if (!showAll && migrations.pending.length === 0) {
          ui.error('No pending migrations');
          return;
        }

        ui.printPendingTable('Pending migrations', migrations.pending);

        if (argv.all) {
          ui.printMigratedTable('\nApplied migrations', migrations.applied);
        }
      });
    }
  })
  .command({
    command: 'up [migrations..]',
    describe: 'apply migrations',
    handler: argv => {
      migratorWrap(argv, async migrator => {
        const migrations = await migrator.getMigrations();
        const toApply =
          (argv.migrations || []).length > 0
            ? migrations.pending.filter(m => argv.migrations.includes(m))
            : migrations.pending;

        for (let migration of toApply) {
          ui.info(`Applying migration ${migration}...`);
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
        const migrations = await migrator.getMigrations();
        const toRollback = migrations.applied.filter(m =>
          argv.migrations.includes(m)
        );

        for (let migration of toRollback) {
          ui.info(`Rolling back migration ${migration}...`);
          await migrator.rollbackMigration(migration);
        }
      });
    }
  }).argv;
