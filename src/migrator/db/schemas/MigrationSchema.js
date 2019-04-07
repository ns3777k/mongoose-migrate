import mongoose from 'mongoose';

export const MigrationSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date },
  migratedAt: { type: Date, default: Date.now }
});
