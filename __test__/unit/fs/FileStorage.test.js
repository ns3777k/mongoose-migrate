import FileStorage from '../../../src/migrator/fs/FileStorage';

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

    storage.createMigration('testing-migration');
    expect(require('fs').writeFileSync)
      .toHaveBeenNthCalledWith(
        1,
        '/testing/directory/testing-migration.js',
        storage.prepareTemplate(['{{ name }}', 'testing-migration.js'])
      );
    spy.mockRestore();
  });
});
