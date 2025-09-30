import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not available");

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const text = await file.text();
    const parsed = JSON.parse(text);
    const backup = parsed.backup as Record<string, any[]>;
    if (!backup || typeof backup !== 'object') {
      return NextResponse.json({ error: "Invalid backup format" }, { status: 400 });
    }

    // Simple restore: replace each collection content
    for (const [name, docs] of Object.entries(backup)) {
      const col = db.collection(name);
      await col.deleteMany({});
      if (Array.isArray(docs) && docs.length > 0) {
        // Remove _id to avoid duplicate key errors if needed
        const sanitized = docs.map((d: any) => {
          const { _id, ...rest } = d || {};
          return rest;
        });
        await col.insertMany(sanitized, { ordered: false });
      }
    }

    return NextResponse.json({ message: "Restore completed" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to restore" }, { status: 500 });
  }
}


