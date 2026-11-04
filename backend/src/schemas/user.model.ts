import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
});

export const User = model('User', userSchema);