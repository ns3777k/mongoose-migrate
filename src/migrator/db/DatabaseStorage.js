import mongoose from 'mongoose';
import { MigrationSchema } from './schemas/MigrationSchema';

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
   * Queries migration records.
   *
   * @returns {Promise}
   */
  getAppliedMigrations() {
    const model = this.client.models.Migration;
    return model.find().sort({ createdAt: -1 });
  }

  /**
   * Updates migration status to UP.
   *
   * @param {String} migrationName
   * @returns {Promise}
   */
  applyMigration(migrationName) {
    const model = this.client.models.Migration;
    const migration = new model({
      name: migrationName,
      createdAt: Date.now()
    });

    return migration.save();
  }

  /**
   * Updates migration status to DOWN.
   *
   * @param {String} migrationName
   * @returns {Promise}
   */
  rollbackMigration(migrationName) {
    const model = this.client.models.Migration;
    return model.deleteOne({ name: migrationName });
  }

  /**
   * Closes the connection.
   */
  disconnect() {
    return this.client.disconnect();
  }
}

export default DatabaseStorage;
