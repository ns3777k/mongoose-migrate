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

  /**
   * Creates new migration on file system and inside database.
   *
   * @param {String} name
   * @returns {Promise<String>}
   */
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

  /**
   * Proxies migrations query to underlying database storage.
   *
   * @param {Object} options
   * @returns {Promise}
   */
  getMigrations(options) {
    return this.databaseStorage.getMigrations(options);
  }

  /**
   * Executes migration file and updates the status in database.
   *
   * @param {Object} migration
   * @returns {Promise}
   */
  async applyMigration(migration) {
    const file = this.locateMigration(migration.name);
    await require(file).up(this.databaseStorage.getClient());

    return this.databaseStorage.applyMigration(migration);
  }

  /**
   * Executes migration file and updates the status in database.
   *
   * @param {Object} migration
   * @returns {Promise}
   */
  async rollbackMigration(migration) {
    const file = this.locateMigration(migration.name);
    await require(file).down(this.databaseStorage.getClient());

    return this.databaseStorage.rollbackMigration(migration);
  }

  /**
   * Proxies migration path resolving call to file storage.
   *
   * @param {String} name
   * @returns {String}
   */
  locateMigration(name) {
    return this.fileStorage.locateMigration(name);
  }

  /**
   * Prepares the storages.
   *
   * @returns {Promise}
   */
  setup() {
    return this.databaseStorage.connect();
  }

  /**
   * Shuts down the storages.
   *
   * @returns {Promise}
   */
  teardown() {
    return this.databaseStorage.disconnect();
  }
}

export default Migrator;
