// app/api/announcements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    const announcements = await db.collection("announcements").find({}).sort({ createdAt: -1 }).limit(10).toArray();
    
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    const body = await req.json();
    const announcement = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection("announcements").insertOne(announcement);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "Announcement created successfully" 
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
