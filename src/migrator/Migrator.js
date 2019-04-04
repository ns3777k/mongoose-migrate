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

  async applyMigration(migration) {
    const file = this.locateMigration(migration.name);
    await require(file).up(this.databaseStorage.getClient());

    return this.databaseStorage.applyMigration(migration);
  }

  async rollbackMigration(migration) {
    const file = this.locateMigration(migration.name);
    await require(file).down(this.databaseStorage.getClient());

    return this.databaseStorage.rollbackMigration(migration);
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
