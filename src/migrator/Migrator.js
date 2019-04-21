import presetEnv from '@babel/preset-env';
import transformRuntime from '@babel/plugin-transform-runtime';

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
   * @returns {String}
   */
  createMigration(name) {
    const migrationName = this.fileStorage.makeName(name);
    this.fileStorage.createMigration(migrationName);

    return migrationName;
  }

  /**
   * @returns {Promise}
   */
  async getMigrations() {
    const all = this.fileStorage.findMigrations();
    const applied = (await this.databaseStorage.getAppliedMigrations()).map(
      migration => migration.name
    );
    const pending = all.filter(m => !applied.includes(m));

    return {
      applied,
      pending
    };
  }

  /**
   * Executes migration file and updates the status in database.
   *
   * @param {String} migrationName
   * @returns {Promise}
   */
  async applyMigration(migrationName) {
    require('@babel/register')({
      ignore: [/node_modules/],
      presets: [presetEnv],
      plugins: [transformRuntime]
    });

    const file = this.locateMigration(migrationName);
    const m = __non_webpack_require__(file);
    await m.up(this.databaseStorage.getClient());

    return this.databaseStorage.applyMigration(migrationName);
  }

  /**
   * Executes migration file and updates the status in database.
   *
   * @param {String} migrationName
   * @returns {Promise}
   */
  async rollbackMigration(migrationName) {
    require('@babel/register')({
      ignore: [/node_modules/],
      presets: [presetEnv],
      plugins: [transformRuntime]
    });

    const file = this.locateMigration(migrationName);
    const m = __non_webpack_require__(file);
    await m.down(this.databaseStorage.getClient());

    return this.databaseStorage.rollbackMigration(migrationName);
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
