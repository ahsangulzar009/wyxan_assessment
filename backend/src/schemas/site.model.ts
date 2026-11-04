import { model, Schema } from "mongoose";

const siteSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,    
      lowercase: true,
      trim: true,
    },
    title:  { type: String, required: true, trim: true },
    html:   { type: String, required: true },   
    text:   { type: String, default: '' }, 
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true } 
);


siteSchema.index(
  { title: 'text', text: 'text' },
  { weights: { title: 5, text: 1 } }
);

export const Site = model('Site', siteSchema);