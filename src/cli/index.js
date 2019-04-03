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
        const options = { pending: argv.pending };
        const migrations = await migrator.getMigrations(options);

        ui.printMigrationTable(migrations);
      });
    }
  })
  .command({
    command: 'up',
    describe: 'apply migrations',
    builder(yargs) {
      return yargs.option('migrations', {
        type: 'array',
        describe: 'migrations to apply'
      });
    },
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
          const f = migrator.locateMigration(migration.name);
          const m = require(f);
          await m.up(migrator.databaseStorage.client);
          await migrator.applyMigration(migration);
        }
      });
    }
  });

yargs.argv;

// p.command('up [migrations...]')
//   .description('apply migrations')
//   .action(async chosenMigrations => {
//     const fsLayer = new FsLayer(p.migrations);
//     const dbLayer = new DbLayer(p.dsn);
//     const options = { pending: true };
//     await dbLayer.connect();
//
//     if (chosenMigrations.length > 0) {
//       options.migrations = chosenMigrations;
//     }
//
//     const migrations = await dbLayer.getMigrations(options);
//     for (let migration of migrations) {
//       ui.info(`Applying ${migration.name}...`);
//       const f = fsLayer.locateMigration(migration.name);
//       const m = require(f);
//       await m.up(dbLayer.client);
//       await dbLayer.applyMigration(migration);
//     }
//
//     await dbLayer.disconnect();
//   });
//
