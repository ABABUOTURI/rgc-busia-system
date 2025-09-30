import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt"; // ✅ correct file now

export async function POST(req: Request) {
  try {
    await connectDB();
    const { identifier, password, role } = await req.json();

    const normalizedPhone = typeof identifier === "string" ? identifier.replace(/[^\d]/g, "") : "";

    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: normalizedPhone }],
      role,
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Generate JWT
    const token = signToken({ userId: user._id, role: user.role });

    // ✅ Set httpOnly cookie
    const res = NextResponse.json({ token, role: user.role, name: user.name });
    res.cookies.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
