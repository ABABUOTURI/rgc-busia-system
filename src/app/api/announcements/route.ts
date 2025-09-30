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
    
    // Normalize fields for consumers (finance expects: title, message, date)
    const normalized = announcements.map((a: any) => ({
      _id: a._id,
      title: a.title,
      message: a.content ?? a.message ?? "",
      date: a.date ?? (a.createdAt ? new Date(a.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)),
      createdAt: a.createdAt,
      createdBy: a.createdBy || "Admin",
    }));
    
    return NextResponse.json(normalized);
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
      createdBy: "Admin", // You can get this from JWT token
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
