import mongoose from 'mongoose';
import { MigrationSchema } from './schemas/MigrationSchema';
import { STATE_DOWN, STATE_UP } from '../constants';

class DatabaseStorage {
  constructor(dsn) {
    this.dsn = dsn;
    this.schemas = [
      { name: 'Migration', schema: MigrationSchema }
    ];
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

  findMigration(name) {
    return this.client.models.Migration.findOne();
  }

  getMigrations(options = {}) {
    const filter = {};
    const model = this.client.models.Migration;

    if (options.pending) {
      filter.state = STATE_DOWN;
    }

    if (Array.isArray(options.migrations) && options.migrations.length > 0) {
      filter.name = { $in: options.migrations };
    }

    return model.find(filter).sort({ createdAt: -1 });
  }

  applyMigration(migration) {
    migration.state = STATE_UP;
    return migration.save();
  }

  disconnect() {
    return this.client.disconnect();
  }
}

export default DatabaseStorage;
