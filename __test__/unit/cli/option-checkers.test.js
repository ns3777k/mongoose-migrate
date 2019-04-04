import { resolve } from 'path';
import { checkDsn, checkMigrationDirectory } from '../../../src/cli/option-checkers';

describe('checkDsn', () => {
  it('throws error on non mongodb proto', () => {
    expect(() => checkDsn('http://test.local')).toThrowError();
  });

  it('does not throw error on mongodb proto', () => {
    expect(() => checkDsn('mongodb://127.0.0.1:27017')).not.toThrowError();
  });
});

describe('checkMigrationDirectory', () => {
  it('throws error if path does not exist', () => {
    const path = resolve(__dirname, '__fixtures__', 'migrations-error');
    expect(() => checkMigrationDirectory(path)).toThrowError(/does not exist/);
  });

  it('throws error if path is not a directory', () => {
    const path = resolve(__dirname, '__fixtures__', 'migrations', 'migrations.js');
    expect(() => checkMigrationDirectory(path)).toThrowError(/is not a directory/);
  });

  it('does not throw error if migrations directory exists', () => {
    const path = resolve(__dirname, '__fixtures__', 'migrations');
    expect(() => checkMigrationDirectory(path)).not.toThrowError();
  });
});
