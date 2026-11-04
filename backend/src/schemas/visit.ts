import { model, Schema } from "mongoose";

const visitSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true, lowercase: true, trim: true },
  via: {
    type: String,
    enum: ['typed', 'link', 'history', 'search'],
    required: true,
  },
  visitedAt: { type: Date, default: Date.now },
});


visitSchema.index({ user: 1, visitedAt: -1 });

export const Visit = model('Visit', visitSchema);