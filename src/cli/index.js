// TODO: migration already exists error info.
// TODO: auto create migration directory
import yargs from 'yargs';
import { version } from '../../package.json';
import { validateDsn, validateMigrationDirectory } from './validation';
// import FsLayer from '../migrator/FsLayer';
// import DbLayer from '../migrator/DbLayer';
// import ui from './ui';

yargs
  .scriptName('mongoose-migrate')
  .version(version)
  .option('dsn', {
    alias: 'd',
    demandOption: true,
    nargs: 1,
    describe: 'MongoDB dsn'
  })
  .option('migrations', {
    alias: 'm',
    demandOption: true,
    nargs: 1,
    normalize: true,
    describe: 'Path to migrations directory',
    default: './migrations'
  })
  .check(argv => {
    validateDsn(argv.dsn);
    validateMigrationDirectory(argv.migrations);

    return true;
  })
  .command({
    command: 'list',
    describe: 'list all migrations',
    builder(yargs) {
      return yargs.option('pending', {
        alias: 'p',
        type: 'boolean',
        describe: 'Only pending migrations'
      });
    },
    handler: argv => {
      console.log(argv);
    }
  })
  .argv;

// p.command('list')
//   .description('list all migrations')
//   .option('-p, --pending')
//   .action(async cmd => {
//     const options = {};
//     const dbLayer = new DbLayer(p.dsn);
//     await dbLayer.connect();
//
//     if (cmd.pending) {
//       options.pending = true;
//     }
//
//     const migrations = await dbLayer.getMigrations(options);
//     ui.printMigrationTable(migrations);
//
//     await dbLayer.disconnect();
//   });
//
// p.command('create <name>')
//   .description('creates new migration')
//   .action(async name => {
//     const fsLayer = new FsLayer(p.migrations);
//     const migrationName = fsLayer.createMigration(name);
//     const dbLayer = new DbLayer(p.dsn);
//
//     await dbLayer.connect();
//     try {
//       await dbLayer.createMigration(migrationName);
//       ui.info(`Migration created: ${migrationName}`);
//     } catch (e) {
//       ui.error(`Error while creating migration ${migrationName}: ${e}`);
//       process.exit(1);
//     }
//     await dbLayer.disconnect();
//   });
//
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
// p.parse(process.argv);
