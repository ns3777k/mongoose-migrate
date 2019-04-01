import p from 'commander';
import { version } from '../package.json';
import { Schema as MigrationSchema } from './schema';
import FsLayer from './FsLayer';
import DbLayer from './DbLayer';
import ui from './ui';
import { statSync } from 'fs';

const schemas = [
  { name: 'Migration', schema: MigrationSchema }
];

p.version(version, '-v, --version')
  .option('-d, --dsn <dsn>', 'mongodb dsn')
  .option('-m, --migrations <migrationsPath>', 'path to migrations directory');

// p.on('option:dsn', dsn => {
//   process.exit(1);
// });

p.on('option:migrations', migrationsPath => {
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
});

p.command('list')
  .description('list all migrations')
  .option('-p, --pending')
  .action(async cmd => {
    const options = {};
    const dbLayer = new DbLayer(p.dsn, schemas);
    await dbLayer.connect();

    if (cmd.pending) {
      options.pending = true;
    }

    const migrations = await dbLayer.getMigrations(options);
    ui.printMigrationTable(migrations);

    await dbLayer.disconnect();
  });

p.command('create <name>')
  .description('creates new migration')
  .action(async name => {
    const fsLayer = new FsLayer(p.migrations);
    const migrationName = fsLayer.createMigration(name);
    const dbLayer = new DbLayer(p.dsn, schemas);

    await dbLayer.connect();
    try {
      await dbLayer.createMigration(migrationName);
      ui.info(`Migration created: ${migrationName}`);
    } catch (e) {
      ui.error(`Error while creating migration ${migrationName}: ${e}`);
      process.exit(1);
    }
    await dbLayer.disconnect();
  });

p.command('up [migrations...]')
  .description('apply migrations')
  .action(async chosenMigrations => {
    const fsLayer = new FsLayer(p.migrations);
    const dbLayer = new DbLayer(p.dsn, schemas);
    const options = { pending: true };
    await dbLayer.connect();

    if (chosenMigrations.length > 0) {
      options.migrations = chosenMigrations;
    }

    const migrations = await dbLayer.getMigrations(options);
    for (let migration of migrations) {
      ui.info(`Applying ${migration.name}...`);
      const f = fsLayer.locateMigration(migration.name);
      const m = require(f);
      await m.up(dbLayer.client);
      await dbLayer.upMigration(migration);
    }

    await dbLayer.disconnect();
  });

p.parse(process.argv);
