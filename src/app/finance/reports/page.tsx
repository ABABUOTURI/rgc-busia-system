// app/finance/reports/page.tsx
"use client";

import { useState } from "react";
import FinanceCharts from "@/components/finance/FinanceCharts";
import { ToastContainer } from "@/components/ui/toast";

export default function ReportsPage() {
  const [range, setRange] = useState({ from: "", to: "" });
  const [recordType, setRecordType] = useState("all");
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: "success" | "error";
    message: string;
  }>>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleExport = async (type: "pdf" | "excel") => {
    try {
      const res = await fetch(`/api/reports/export?type=${type}&recordType=${recordType}&from=${range.from}&to=${range.to}`);
      if (!res.ok) throw new Error("Failed to export");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `finance-report-${recordType}-${range.from || "all"}-to-${range.to || "all"}.${type === "pdf" ? "pdf" : "xlsx"}`;
      link.click();
      window.URL.revokeObjectURL(url);
      addToast("success", `✅ ${type.toUpperCase()} report exported successfully!`);
    } catch (err) {
      console.error("Export error:", err);
      addToast("error", "❌ Failed to export report. Please try again.");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black">Reports & Analytics</h2>

      {/* Filters Section - Responsive */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl shadow">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
          {/* Record Type Filter - Responsive */}
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="border rounded px-2 sm:px-3 py-2 text-black text-sm sm:text-base w-full lg:w-auto"
          >
            <option value="all">All Records</option>
            <option value="sunday-school">Sunday School Records</option>
            <option value="church-accounts">Church Accounts Records</option>
            <option value="construction">Construction Records</option>
            <option value="expenditure">Expenditure</option>
          </select>

          {/* Date Range Filter - Responsive */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <input
              type="date"
              value={range.from}
              onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              className="border rounded px-2 sm:px-3 py-2 text-black text-sm sm:text-base w-full sm:w-auto"
            />
            <input
              type="date"
              value={range.to}
              onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              className="border rounded px-2 sm:px-3 py-2 text-black text-sm sm:text-base w-full sm:w-auto"
            />
          </div>

          {/* Filter Button - Responsive */}
          <button className="px-3 sm:px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base w-full lg:w-auto">
            Filter
          </button>

          {/* Export Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:ml-auto">
            <button
              onClick={() => handleExport("pdf")}
              className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto"
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <FinanceCharts recordType={recordType} from={range.from} to={range.to} />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
