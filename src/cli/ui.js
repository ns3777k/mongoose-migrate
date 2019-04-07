import chalk from 'chalk';

function printTable(migrations, colorFn) {
  migrations.forEach((m, i) => console.log(colorFn(`${++i}. ${m}`)));
}

function printPendingTable(title, migrations) {
  if (migrations.length === 0) {
    return;
  }

  error(`${title}:\n`);
  printTable(migrations, chalk.red.bold);
}

function printMigratedTable(title, migrations) {
  if (migrations.length === 0) {
    return;
  }

  info(`${title}:\n`);
  printTable(migrations, chalk.green.bold);
}

function error(msg) {
  console.log(chalk.red.bold(msg));
}

function info(msg) {
  console.log(chalk.green.bold(msg));
}

export default {
  printPendingTable,
  printMigratedTable,
  error,
  info
};
