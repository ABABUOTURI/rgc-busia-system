import Log from "@/models/Log";
import { connectDB } from "./mongodb";

export async function logActivity({
  userId,
  username,
  action,
  page,
  device,
  ip,
  mac,
}: {
  userId: string;
  username: string;
  action: string;
  page: string;
  device?: string;
  ip?: string;
  mac?: string;
}) {
  await connectDB();

  try {
    await Log.create({
      userId,
      username,
      action,
      page,
      device,
      ip,
      mac,
    });
    console.log("✅ Activity logged:", action);
  } catch (err) {
    console.error("❌ Failed to log activity:", err);
  }
}
