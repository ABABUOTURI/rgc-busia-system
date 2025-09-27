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
    const records = await db
      .collection("construction")
      .find({})
      .sort({ _id: -1 })
      .toArray();
    return NextResponse.json(records);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch construction records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }
    const body = await req.json();
    const doc = {
      construction: {
        churchLand: Number(body?.construction?.churchLand || 0),
        projectBegan: Number(body?.construction?.projectBegan || 0),
        planDesign: Number(body?.construction?.planDesign || 0),
      },
      approvals: {
        publicHealth: Number(body?.approvals?.publicHealth || 0),
        physicalPlanning: Number(body?.approvals?.physicalPlanning || 0),
        urbanDevelopment: Number(body?.approvals?.urbanDevelopment || 0),
        titleDeed: Number(body?.approvals?.titleDeed || 0),
      },
      createdAt: new Date(),
    };

    await db.collection("construction").insertOne(doc as any);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save construction record" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }
    const body = await req.json();
    if (!body?._id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }
    await db.collection("construction").updateOne(
      { _id: new ObjectId(body._id) },
      {
        $set: {
          construction: {
            churchLand: Number(body?.construction?.churchLand || 0),
            projectBegan: Number(body?.construction?.projectBegan || 0),
            planDesign: Number(body?.construction?.planDesign || 0),
          },
          approvals: {
            publicHealth: Number(body?.approvals?.publicHealth || 0),
            physicalPlanning: Number(body?.approvals?.physicalPlanning || 0),
            urbanDevelopment: Number(body?.approvals?.urbanDevelopment || 0),
            titleDeed: Number(body?.approvals?.titleDeed || 0),
          },
          updatedAt: new Date(),
        },
      }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update construction record" }, { status: 500 });
  }
}




