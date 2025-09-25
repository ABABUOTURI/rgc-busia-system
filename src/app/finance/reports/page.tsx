// app/finance/reports/page.tsx
"use client";

import { useState } from "react";
import FinanceCharts from "@/components/finance/FinanceCharts";

export default function ReportsPage() {
  const [range, setRange] = useState({ from: "", to: "" });

  const handleExport = (type: "pdf" | "excel") => {
    // placeholder - integrate with server side generation
    alert(`Exporting ${type.toUpperCase()} for ${range.from} -> ${range.to}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Reports & Analytics</h2>

      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input type="date" value={range.from} onChange={(e) => setRange(r => ({...r, from: e.target.value}))} className="border rounded px-3 py-2" />
          <input type="date" value={range.to} onChange={(e) => setRange(r => ({...r, to: e.target.value}))} className="border rounded px-3 py-2" />
          <button className="px-4 py-2 rounded bg-red-600 text-white">Filter</button>
          <div className="ml-auto flex gap-2">
            <button onClick={() => handleExport("pdf")} className="px-3 py-2 rounded bg-gray-800 text-white">Export PDF</button>
            <button onClick={() => handleExport("excel")} className="px-3 py-2 rounded bg-green-600 text-white">Export Excel</button>
          </div>
        </div>
      </div>

      <FinanceCharts />
    </div>
  );
}
