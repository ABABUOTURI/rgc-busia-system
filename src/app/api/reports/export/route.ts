// app/api/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "pdf"; // pdf | excel
    const recordType = searchParams.get("recordType") || "all"; 
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Map recordType -> Mongo collection
    const collections: Record<string, string> = {
      "sunday-school": "sunday_school",
      "church-accounts": "church_accounts",
      "construction": "construction_records",
      "expenditure": "expenditure_records",
    };

    let data: any[] = [];

    if (recordType === "all") {
      // fetch from all collections
      for (const key of Object.values(collections)) {
        const col = db.collection(key);
        let query: any = {};
        if (from && to) query.date = { $gte: from, $lte: to };
        const records = await col.find(query).toArray();
        data.push({ name: key, records });
      }
    } else {
      const collectionName = collections[recordType];
      const col = db.collection(collectionName);
      let query: any = {};
      if (from && to) query.date = { $gte: from, $lte: to };
      const records = await col.find(query).toArray();
      data.push({ name: recordType, records });
    }

    // === PDF Generation ===
    if (type === "pdf") {
      const doc = new PDFDocument();
      const chunks: any[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => {});

      doc.fontSize(18).text("Finance Report", { align: "center" });
      doc.moveDown();

      data.forEach((section) => {
        doc.fontSize(14).text(section.name.toUpperCase(), { underline: true });
        doc.moveDown(0.5);
        section.records.forEach((r: any, i: number) => {
          doc.fontSize(10).text(`${i + 1}. ${JSON.stringify(r)}`);
        });
        doc.moveDown();
      });

      doc.end();
      const buffer = await new Promise<Buffer>((resolve) => {
        const bufs: Buffer[] = [];
        doc.on("data", (d: Buffer) => bufs.push(d));
        doc.on("end", () => resolve(Buffer.concat(bufs)));
      });

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=finance-report.pdf`,
        },
      });
    }

    // === Excel Generation ===
    if (type === "excel") {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Finance System";
      workbook.created = new Date();

      data.forEach((section) => {
        const sheet = workbook.addWorksheet(section.name);
        if (section.records.length > 0) {
          sheet.columns = Object.keys(section.records[0]).map((k) => ({
            header: k,
            key: k,
            width: 20,
          }));
          section.records.forEach((r: any) => {
            sheet.addRow(r);
          });
        } else {
          sheet.addRow(["No records found"]);
        }
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename=finance-report.xlsx`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("Report export error:", err);
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 });
  }
}
