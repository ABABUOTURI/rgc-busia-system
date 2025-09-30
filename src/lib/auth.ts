import { cookies } from "next/headers";
import { verifyToken } from "./jwt"; // your existing JWT helpers
import { connectDB } from "@/lib/mongodb"; // your MongoDB connector
import User from "@/models/User"; // your rgc_auth.users model
import { ObjectId } from "mongodb";

export async function getUserFromSession() {
  try {
    // In your setup, cookies() returns a Promise<ReadonlyRequestCookies>
    const token = (await cookies()).get("session")?.value;

    if (!token) return null;

    const decoded = verifyToken(token) as { userId?: string };
    if (!decoded?.userId) return null;

    await connectDB();

    const user = await User.findById(decoded.userId)
      .select("name email") // ✅ only name + email
      .lean<{ name: string; email: string }>();

    if (!user) return null;

    return {
      _id: new ObjectId(decoded.userId),
      name: user.name,
      email: user.email,
    } as { _id: ObjectId; name: string; email: string };
  } catch (err) {
    console.error("getUserFromSession error:", err);
    return null;
  }
}
