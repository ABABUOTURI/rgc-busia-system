import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

async function updateAdminPassword() {
  try {
    await connectDB();

    const email = "ababuoturi@gmail.com";
    const newPlainPassword = "EO@@254legend";

    const user = await User.findOne({ email, role: "Admin" });
    if (!user) {
      console.log("⚠️ Admin user not found:", email);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(newPlainPassword, 10);
    user.password = hashedPassword;
    await user.save();

    console.log("✅ Admin password updated successfully for:", email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to update admin password:", err);
    process.exit(1);
  }
}

updateAdminPassword();



