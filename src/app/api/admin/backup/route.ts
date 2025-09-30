import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(_req: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not available");

    const collections = await db.listCollections().toArray();
    const backup: Record<string, any[]> = {};

    for (const col of collections) {
      const name = col.name;
      const docs = await db.collection(name).find({}).toArray();
      backup[name] = docs;
    }

    const json = JSON.stringify({ createdAt: new Date().toISOString(), backup }, null, 2);

    // Send email
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;
    const to = process.env.ADMIN_EMAIL || user;

    if (!host || !port || !user || !pass || !from || !to) {
      console.warn("SMTP not fully configured; returning backup directly");
      return NextResponse.json({ message: "Backup created (email not configured)", backup }, { status: 200 });
    }

    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    await transporter.sendMail({
      from: from as string,
      to,
      subject: `RGC MIS Backup ${new Date().toLocaleString()}`,
      text: "Database backup attached.",
      attachments: [
        { filename: `backup-${Date.now()}.json`, content: json }
      ],
    });

    return NextResponse.json({ message: "Backup emailed to admin" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create backup" }, { status: 500 });
  }
}


