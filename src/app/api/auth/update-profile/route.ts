import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb"; // MongoDB connection helper (mongoose)
import { getUserFromSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { name, email } }
    );

    return NextResponse.json({ success: true, user: { ...user, name, email } });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
