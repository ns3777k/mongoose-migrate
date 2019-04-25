import DatabaseStorage from '../../../../src/migrator/db/DatabaseStorage';

process.env.MONGODB &&
  describe('DatabaseStorage', () => {
    let storage;

    beforeEach(async () => {
      storage = new DatabaseStorage(process.env.MONGODB);
      await storage.connect();
      await storage.getClient().connection.dropDatabase();
    });

    afterEach(async () => {
      await storage.disconnect();
    });

    it('applies migrations', async () => {
      const migration = await storage.applyMigration('migration-1');
      expect(migration.name).toStrictEqual('migration-1');
    });

    it('rollbacks migrations', async () => {
      await storage.applyMigration('migration-1');
      await storage.applyMigration('migration-2');
      await storage.applyMigration('migration-3');

      await storage.rollbackMigration('migration-2');

      const migrations = await storage
        .getClient()
        .model('Migration')
        .find();

      expect(migrations).toHaveLength(2);
      expect(migrations[0].name).toStrictEqual('migration-1');
      expect(migrations[1].name).toStrictEqual('migration-3');
    });

    it('queries migrations sorting by creation time desc', async () => {
      await storage.applyMigration('migration-1');
      await storage.applyMigration('migration-2');
      await storage.applyMigration('migration-3');

      const migrations = (await storage.getAppliedMigrations()).map(
        migration => migration.name
      );

      expect(migrations).toHaveLength(3);
      expect(migrations).toEqual(['migration-3', 'migration-2', 'migration-1']);
    });
  });
