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

  createMigration(name) {
    // TODO: check existent
    const migrationName = this.fileStorage.createMigration(name);
    this.databaseStorage.createMigration(migrationName);

    return migrationName;
  }
}
