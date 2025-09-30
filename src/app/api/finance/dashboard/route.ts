import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not available");

    console.log("🔍 Fetching dashboard data...");
    
    // Fetch core collections
    const churchAccounts = await db.collection("church_accounts").find({}).toArray();
    const construction = await db.collection("construction_records").find({}).toArray();
    const sundaySchool = await db.collection("sunday_school").find({}).toArray();
    
    console.log("📊 Data counts:", { 
      churchAccounts: churchAccounts.length, 
      construction: construction.length, 
      sundaySchool: sundaySchool.length 
    });

    // Totals
    const totalOfferings = churchAccounts.reduce((sum: number, record: any) => {
      const mainService = record.offerings?.mainService || 0;
      const hbcTotal = (record.offerings?.hbc?.jerusalem || 0)
        + (record.offerings?.hbc?.emmanuel || 0)
        + (record.offerings?.hbc?.ebenezer || 0)
        + (record.offerings?.hbc?.agape || 0);
      const sunday = record.offerings?.sundaySchool || 0;
      return sum + mainService + hbcTotal + sunday;
    }, 0);

    const totalExpenses = churchAccounts.reduce((sum: number, record: any) => {
      const exp = Object.values(record.expenditure || {}).reduce((s: number, v: any) => s + (v || 0), 0);
      return sum + exp;
    }, 0);

    // Monthly overview (combine accounts + construction + sunday school counts)
    type MonthBucket = { label: string; order: number; churchAccounts: number; construction: number; sundaySchool: number; expenditures: number };
    const monthlyMap: Record<string, MonthBucket> = {};

    const addToMonth = (date: any, updater: (m: MonthBucket) => void) => {
      const d = new Date(date);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyMap[ym]) monthlyMap[ym] = { label, order: d.getFullYear() * 100 + (d.getMonth() + 1), churchAccounts: 0, construction: 0, sundaySchool: 0, expenditures: 0 };
      updater(monthlyMap[ym]);
    };

    churchAccounts.forEach((rec: any) => {
      const mainService = rec.offerings?.mainService || 0;
      const hbcTotal = (rec.offerings?.hbc?.jerusalem || 0)
        + (rec.offerings?.hbc?.emmanuel || 0)
        + (rec.offerings?.hbc?.ebenezer || 0)
        + (rec.offerings?.hbc?.agape || 0);
      const sunday = rec.offerings?.sundaySchool || 0;
      const offerings = mainService + hbcTotal + sunday;
      const expenses = Object.values(rec.expenditure || {}).reduce((s: number, v: any) => s + (v || 0), 0);
      addToMonth(rec.date, (m) => { m.churchAccounts += offerings; m.expenditures += expenses; });
    });

    construction.forEach((rec: any) => addToMonth(rec.date, (m) => { m.construction += rec.amount || 0; }));
    sundaySchool.forEach((rec: any) => addToMonth(rec.date, (m) => { m.sundaySchool += (rec.attendance || 0); }));

    const monthlyOverview = Object.values(monthlyMap)
      .sort((a, b) => a.order - b.order)
      .map((v) => ({ name: v.label, churchAccounts: v.churchAccounts, construction: v.construction, sundaySchool: v.sundaySchool, expenditures: v.expenditures }));

    // Recent activity (from logs if available; fallback to latest church accounts)
    let recentActivity: any[] = [];
    try {
      const logs = await db.collection("logs").find({}).sort({ timestamp: -1 }).limit(10).toArray();
      recentActivity = logs.map((log: any) => ({
        _id: log._id?.toString(),
        date: log.timestamp || log.date || new Date().toISOString(),
        user: log.username || log.name || 'User',
        action: log.action,
        details: `${log.page || 'system'} • ${log.ip || ''}`.trim(),
      }));
    } catch {}
    if (recentActivity.length === 0) {
      recentActivity = churchAccounts.slice(0, 10).map((rec: any) => ({
        _id: rec._id?.toString(),
        date: rec.date,
        user: 'Finance',
        action: 'Church Account Recorded',
        details: new Date(rec.date).toLocaleDateString(),
      }));
    }

    const response = {
      summary: {
        totalOfferings,
        expenses: totalExpenses,
        net: totalOfferings - totalExpenses,
        records: churchAccounts.length,
      },
      monthlyOverview,
      recentActivity,
    };
    
    console.log("✅ Dashboard response:", JSON.stringify(response, null, 2));
    return NextResponse.json(response);
  } catch (e: any) {
    console.error("❌ Dashboard API error:", e);
    return NextResponse.json({ error: e.message || 'Failed to load' }, { status: 500 });
  }
}
