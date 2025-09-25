import bcrypt from "bcryptjs";
import {connectDB }from "@/lib/mongodb";
import User from "@/models/User";

async function seedAdmin() {
  await connectDB();

  const existing = await User.findOne({ email: "ababuoturi@gmail.com" });
  if (existing) {
    console.log("⚠️ Admin already exists:", existing.email);
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10); // change password later

  await User.create({
    role: "Admin",
    email: "ababuoturi@gmail.com",
    phone: "0714205641",
    password: hashedPassword,
  });

  console.log("✅ Admin user created!");
  process.exit();
}

seedAdmin();
