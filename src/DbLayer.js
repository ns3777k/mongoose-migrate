import mongoose from 'mongoose';
import { Status } from './schema';

export default class DbLayer {
  constructor(dsn, schemas = []) {
    this.dsn = dsn;
    this.schemas = schemas;
  }

  async connect() {
    this.client = await mongoose.connect(this.dsn, { useNewUrlParser: true });
    this.schemas.forEach(schema => {
      this.client.model(schema.name, schema.schema);
    });
  }

  createMigration(name) {
    const migration = new this.client.models.Migration({ name });
    return migration.save();
  }

  getMigrations(options = {}) {
    const filter = {};
    const model = this.client.models.Migration;

    if (options.pending) {
      filter.state = Status.STATE_DOWN;
    }

    if (Array.isArray(options.migrations) && options.migrations.length > 0) {
      filter.name = { $in: options.migrations };
    }

    return model.find(filter).sort({ createdAt: -1 });
  }

  upMigration(migration) {
    migration.state = Status.STATE_UP;
    return migration.save();
  }

  disconnect() {
    return this.client.disconnect();
  }
}
