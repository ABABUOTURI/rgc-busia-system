// app/api/announcements/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    const body = await req.json();
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection("announcements").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Announcement updated successfully" 
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    const result = await db.collection("announcements").deleteOne(
      { _id: new ObjectId(params.id) }
    );
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Announcement deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
