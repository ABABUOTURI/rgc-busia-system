import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  userId: string;
  name: string;
  action: string;
  page: string;
  device?: string;
  ip?: string;
  mac?: string;
  timestamp: Date;
}

// Prevent model overwrite on hot reloads
const LogSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  action: { type: String, required: true },
  page: { type: String, required: true },
  device: { type: String },
  ip: { type: String },
  mac: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);
