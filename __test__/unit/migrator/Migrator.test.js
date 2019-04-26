import Migrator from '../../../src/migrator/Migrator';
import FileStorage from '../../../src/migrator/fs/FileStorage';
import DatabaseStorage from '../../../src/migrator/db/DatabaseStorage';

jest.mock('../../../src/migrator/fs/FileStorage');
jest.mock('../../../src/migrator/db/DatabaseStorage');

describe('Migrator', () => {
  beforeEach(() => {
    FileStorage.mockClear();
    DatabaseStorage.mockClear();

    delete global.__non_webpack_require__;
  });

  it('splits migrations into pending and applied', async () => {
    DatabaseStorage.mockImplementation(() => {
      return {
        getAppliedMigrations: async () => [
          { name: '1554333809710-testing-migration' },
          { name: '1554334809710-adv' }
        ]
      };
    });

    FileStorage.mockImplementation(() => {
      return {
        findMigrations: () => [
          '1554333809710-testing-migration',
          '1554334809710-adv',
          '1554994809710-channel',
          '1555994809710-regions'
        ]
      };
    });

    const fs = new FileStorage('');
    const db = new DatabaseStorage('');
    const migrator = new Migrator(fs, db);
    const migrations = await migrator.getMigrations();

    expect(migrations.applied).toStrictEqual([
      '1554333809710-testing-migration',
      '1554334809710-adv'
    ]);

    expect(migrations.pending).toStrictEqual([
      '1554994809710-channel',
      '1555994809710-regions'
    ]);
  });

  it('applies migration', async () => {
    const mock = { up: jest.fn() };
    global.__non_webpack_require__ = jest.fn().mockReturnValueOnce(mock);

    FileStorage.mockImplementation(() => {
      return {
        locateMigration: () => '/1554334809710-migration.js'
      };
    });

    DatabaseStorage.mockImplementation(() => {
      return {
        getClient: () => null,
        applyMigration: async () => true
      };
    });

    const fs = new FileStorage('/');
    const db = new DatabaseStorage('');
    const migrator = new Migrator(fs, db);
    const result = await migrator.applyMigration('1554334809710-migration');
    expect(result).toStrictEqual(true);
    expect(mock.up).toHaveBeenNthCalledWith(1, null);
  });

  it('rollbacks migration', async () => {
    const mock = { down: jest.fn() };
    global.__non_webpack_require__ = jest.fn().mockReturnValueOnce(mock);

    FileStorage.mockImplementation(() => {
      return {
        locateMigration: () => '/1554334809710-migration.js'
      };
    });

    DatabaseStorage.mockImplementation(() => {
      return {
        getClient: () => null,
        rollbackMigration: async () => true
      };
    });

    const fs = new FileStorage('/');
    const db = new DatabaseStorage('');
    const migrator = new Migrator(fs, db);
    const result = await migrator.rollbackMigration('1554334809710-migration');
    expect(result).toStrictEqual(true);
    expect(mock.down).toHaveBeenNthCalledWith(1, null);
  });
});
