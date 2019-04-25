import FileStorage from '../../../../src/migrator/fs/FileStorage';

class DirectMock {
  constructor(name, directory = false) {
    this.name = name;
    this.directory = directory;
  }

  isDirectory() {
    return this.directory;
  }
}

jest.mock('fs');

describe('FileStorage', () => {
  it('makes valid name', () => {
    const storage = new FileStorage('');
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => 123456);
    const name = storage.makeName('test');

    expect(name).toStrictEqual('123456-test');
    spy.mockRestore();
  });

  it('locates migration', () => {
    const storage = new FileStorage('/testing/directory');
    const name = storage.locateMigration('test');
    expect(name).toStrictEqual('/testing/directory/test.js');
  });

  it('create migration file', () => {
    const spy = jest.spyOn(Date, 'now').mockImplementation(() => 123456);
    const storage = new FileStorage('/testing/directory');
    const fs = require('fs');

    storage.createMigration('testing-migration');
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      '/testing/directory/testing-migration.js',
      storage.prepareTemplate([['{{ name }}', 'testing-migration.js']])
    );
    spy.mockRestore();
  });

  it('finds ignoring directories', () => {
    const fs = require('fs');
    const spy = jest
      .spyOn(fs, 'readdirSync')
      .mockImplementation(() => [
        new DirectMock('1554333809710-testing-migration.js', true)
      ]);

    const storage = new FileStorage('/testing/directory');
    const migrations = storage.findMigrations();
    expect(migrations).toHaveLength(0);
    spy.mockRestore();
  });

  it('finds only js files', () => {
    const fs = require('fs');
    const spy = jest
      .spyOn(fs, 'readdirSync')
      .mockImplementation(() => [
        new DirectMock('1554333809710-testing-migration.js'),
        new DirectMock('1554333809711-testing-migration.txt'),
        new DirectMock('1554333809712-testing-migration.jsx'),
        new DirectMock('1554333809713-testing-migration.sql'),
        new DirectMock('1554333809714-testing-migration.ts'),
        new DirectMock('1554333809715-testing-migration.tsx')
      ]);

    const storage = new FileStorage('/testing/directory');
    const migrations = storage.findMigrations();
    expect(migrations).toHaveLength(1);
    spy.mockRestore();
  });

  it('finds only specific format', () => {
    const fs = require('fs');
    const spy = jest
      .spyOn(fs, 'readdirSync')
      .mockImplementation(() => [
        new DirectMock('1234-testing-migration.js'),
        new DirectMock('324-testing-migration.js'),
        new DirectMock('-testing-migration.js'),
        new DirectMock('igration.js')
      ]);

    const storage = new FileStorage('/testing/directory');
    const migrations = storage.findMigrations();
    expect(migrations).toHaveLength(2);
    spy.mockRestore();
  });

  it('finds and returns names without extension', () => {
    const fs = require('fs');
    const spy = jest
      .spyOn(fs, 'readdirSync')
      .mockImplementation(() => [
        new DirectMock('1234-testing-migration.js'),
        new DirectMock('843764738-migration-nw.js'),
        new DirectMock('129873463-stub-vfr.js')
      ]);

    const storage = new FileStorage('/testing/directory');
    const migrations = storage.findMigrations();
    expect(migrations).toStrictEqual([
      '1234-testing-migration',
      '129873463-stub-vfr',
      '843764738-migration-nw'
    ]);
    spy.mockRestore();
  });

  it('finds and returns asc sorted array by ts', () => {
    const fs = require('fs');
    const spy = jest
      .spyOn(fs, 'readdirSync')
      .mockImplementation(() => [
        new DirectMock('12345-1.js'),
        new DirectMock('1234-2.js'),
        new DirectMock('123-3.js')
      ]);

    const storage = new FileStorage('/testing/directory');
    const migrations = storage.findMigrations();
    expect(migrations).toStrictEqual(['123-3', '1234-2', '12345-1']);
    spy.mockRestore();
  });
});
