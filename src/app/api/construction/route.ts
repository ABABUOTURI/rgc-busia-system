// app/api/construction/route.ts
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

    const constructionRecords = await db.collection("construction_records").find({}).sort({ date: -1 }).toArray();
    
    return NextResponse.json(constructionRecords);
  } catch (error) {
    console.error("Error fetching construction records:", error);
    return NextResponse.json({ error: "Failed to fetch construction records" }, { status: 500 });
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
    const constructionRecord = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection("construction_records").insertOne(constructionRecord);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "Construction record created successfully" 
    });
  } catch (error) {
    console.error("Error creating construction record:", error);
    return NextResponse.json({ error: "Failed to create construction record" }, { status: 500 });
  }
}