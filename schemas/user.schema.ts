import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false }, // NUNCA guardes plano
  name: String,
  role: { type: String, enum: ["admin","user"], default: "admin" },

  failedLogins: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
}, { timestamps: true });

export default models.User || model("User", UserSchema);
