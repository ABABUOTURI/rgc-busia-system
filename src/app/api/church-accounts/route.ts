import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ChurchAccount from "@/models/ChurchAccount";

// GET all or filtered accounts
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");       // exact date (YYYY-MM-DD)
    const month = searchParams.get("month");     // month number 1–12
    const quarter = searchParams.get("quarter"); // 1, 2, 3, 4
    const year = searchParams.get("year");       // YYYY

    const filter: any = {};

    if (date) {
      filter.date = date;
    }

    if (month || quarter || year) {
      const start = new Date();
      const end = new Date();

      if (month && year) {
        // Specific month
        start.setFullYear(Number(year), Number(month) - 1, 1);
        end.setFullYear(Number(year), Number(month), 0);
        end.setHours(23, 59, 59, 999);
      } else if (quarter && year) {
        // Quarter ranges
        const q = Number(quarter);
        const y = Number(year);
        const startMonth = (q - 1) * 3;
        const endMonth = startMonth + 2;

        start.setFullYear(y, startMonth, 1);
        end.setFullYear(y, endMonth + 1, 0);
        end.setHours(23, 59, 59, 999);
      } else if (year) {
        // Whole year
        start.setFullYear(Number(year), 0, 1);
        end.setFullYear(Number(year), 11, 31);
        end.setHours(23, 59, 59, 999);
      }

      filter.createdAt = { $gte: start, $lte: end };
    }

    const accounts = await ChurchAccount.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch church accounts" },
      { status: 500 }
    );
  }
}

// POST create new church account
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const account = await ChurchAccount.create(body);
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create church account" },
      { status: 500 }
    );
  }
}
