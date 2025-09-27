// app/api/expenditure/route.ts
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

    const expenditureRecords = await db.collection("expenditure_records").find({}).sort({ date: -1 }).toArray();
    
    return NextResponse.json(expenditureRecords);
  } catch (error) {
    console.error("Error fetching expenditure records:", error);
    return NextResponse.json({ error: "Failed to fetch expenditure records" }, { status: 500 });
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
    const expenditureRecord = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection("expenditure_records").insertOne(expenditureRecord);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "Expenditure record created successfully" 
    });
  } catch (error) {
    console.error("Error creating expenditure record:", error);
    return NextResponse.json({ error: "Failed to create expenditure record" }, { status: 500 });
  }
}
