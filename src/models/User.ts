import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["Snr Pastor", "Pastor's Wife", "Finance", "Deacons", "Admin"],
      required: true,
    },
    loginMethod: { type: String, enum: ["password", "otp"], default: "password" },
    isActive: { type: Boolean, default: true },
    // OTP fields for phone-based login
    otpCode: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
