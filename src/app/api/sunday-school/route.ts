import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }
    const records = await db.collection("sundaySchool").find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(records);
  } catch {
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    // Sanitize input and ignore provided _id to avoid duplicates/errors
    const doc = {
      year: Number(body.year),
      amount: Number(body.amount),
      date: new Date(body.date),
    } as any;

    await db.collection("sundaySchool").insertOne(doc);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save record" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    await db.collection("sundaySchool").updateOne(
      { _id: new ObjectId(body._id) },
      {
        $set: {
          year: Number(body.year),
          amount: Number(body.amount),
          date: new Date(body.date),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}
