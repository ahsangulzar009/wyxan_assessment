import { model, Schema, Types } from "mongoose";

export const VIA = ['typed', 'link', 'history', 'search'] as const;
export type Via = (typeof VIA)[number];

export interface VisitDoc {
  user: Types.ObjectId;
  address: string;
  via: Via;
  visitedAt: Date;
}

const visitSchema = new Schema<VisitDoc>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true, lowercase: true, trim: true },
  via: {
    type: String,
    enum: VIA,      
    required: true,
  },
  visitedAt: { type: Date, default: Date.now },
});

visitSchema.index({ user: 1, visitedAt: -1 });

export const Visit = model<VisitDoc>('Visit', visitSchema);