class Migrator {
  /**
   *
   * @param {FileStorage} fileStorage
   * @param {DatabaseStorage} databaseStorage
   */
  constructor(fileStorage, databaseStorage) {
    this.fileStorage = fileStorage;
    this.databaseStorage = databaseStorage;
  }

  async createMigration(name) {
    const migrationName = this.fileStorage.makeName(name);
    const found = await this.databaseStorage.findMigration(migrationName);
    if (found) {
      throw Error(`Migration ${migrationName} already exists!`);
    }

    this.fileStorage.createMigration(migrationName);
    await this.databaseStorage.createMigration(migrationName);

    return migrationName;
  }

  getMigrations(options) {
    return this.databaseStorage.getMigrations(options);
  }

  applyMigration(migration) {
    return this.databaseStorage.applyMigration(migration);
  }

  locateMigration(name) {
    return this.fileStorage.locateMigration(name);
  }

  setup() {
    return this.databaseStorage.connect();
  }

  teardown() {
    return this.databaseStorage.disconnect();
  }
}

export default Migrator;
