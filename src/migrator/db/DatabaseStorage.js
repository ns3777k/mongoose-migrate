import mongoose from 'mongoose';
import { MigrationSchema } from './schemas/MigrationSchema';
import { STATE_DOWN, STATE_UP } from '../constants';

class DatabaseStorage {
  /**
   * @param {String} dsn
   */
  constructor(dsn) {
    this.dsn = dsn;
    this.schemas = [{ name: 'Migration', schema: MigrationSchema }];
  }

  /**
   * Initiates a connection to database.
   */
  async connect() {
    this.client = await mongoose.connect(this.dsn, { useNewUrlParser: true });
    this.schemas.forEach(schema => {
      this.client.model(schema.name, schema.schema);
    });
  }

  getClient() {
    return this.client;
  }

  /**
   * Creates new migration.
   *
   * @param {String} name
   * @returns {Promise}
   */
  createMigration(name) {
    const migration = new this.client.models.Migration({ name });
    return migration.save();
  }

  /**
   * Queries migration by name.
   *
   * @param {String} name
   * @returns {Promise}
   */
  findMigration(name) {
    return this.client.models.Migration.findOne({ name });
  }

  /**
   * Queries migration records.
   *
   * @param {Object} options
   * @returns {Promise}
   */
  getMigrations(options = {}) {
    const filter = {};
    const sorting = { createdAt: -1 };
    const model = this.client.models.Migration;

    if ('pending' in options) {
      if (options.pending) {
        filter.state = STATE_DOWN;
      } else {
        filter.state = STATE_UP;
        sorting.createdAt = 1;
      }
    }

    if (Array.isArray(options.migrations) && options.migrations.length > 0) {
      filter.name = { $in: options.migrations };
    }

    return model.find(filter).sort(sorting);
  }

  /**
   * Updates migration status to UP.
   *
   * @param {Object} migration
   * @returns {Promise}
   */
  applyMigration(migration) {
    migration.state = STATE_UP;
    return migration.save();
  }

  /**
   * Updates migration status to DOWN.
   *
   * @param {Object} migration
   * @returns {Promise}
   */
  rollbackMigration(migration) {
    migration.state = STATE_DOWN;
    return migration.save();
  }

  /**
   * Closes the connection.
   */
  disconnect() {
    return this.client.disconnect();
  }
}

export default DatabaseStorage;
