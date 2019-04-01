import mongoose from 'mongoose';

const STATE_UP = 'up';
const STATE_DOWN = 'down';

const Schema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  state: {
    type: String,
    enum: [ STATE_UP, STATE_DOWN ],
    default: STATE_DOWN
  }
});

const Status = { STATE_UP, STATE_DOWN };

export { Schema, Status };
