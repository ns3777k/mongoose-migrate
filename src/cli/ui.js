import Table from 'cli-table';
import chalk from 'chalk';
import { STATE_DOWN } from '../migrator/index';

function formatMigrationState(state) {
  return state === STATE_DOWN
    ? chalk.red.bold(state)
    : chalk.green.bold(state);
}

function printMigrationTable(migrations) {
  const table = new Table({
    head: ['Name', 'State', 'Created'],
    colWidths: [40, 8, 30]
  });

  migrations.forEach(migration => {
    table.push([
      migration.name,
      formatMigrationState(migration.state),
      migration.createdAt.toLocaleString()
    ]);
  });

  console.log(table.toString());
}

function error(msg) {
  console.log(chalk.red.bold(msg));
}

function info(msg) {
  console.log(chalk.green.bold(msg));
}

export default {
  printMigrationTable,
  error,
  info
};
