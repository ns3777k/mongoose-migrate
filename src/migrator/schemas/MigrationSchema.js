import mongoose from 'mongoose';
import { STATE_UP, STATE_DOWN } from '../constants';

export const MigrationSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  state: {
    type: String,
    enum: [ STATE_UP, STATE_DOWN ],
    default: STATE_DOWN
  }
});
