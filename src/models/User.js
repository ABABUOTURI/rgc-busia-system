import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    password: { type: String }, // required for password-based login
    role: { 
      type: String, 
      enum: ["Snr Pastor", "Pastor's Wife", "Finance", "Deacons", "Admin"], 
      required: true 
    },
    loginMethod: { type: String, enum: ["password", "otp"], default: "password" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
