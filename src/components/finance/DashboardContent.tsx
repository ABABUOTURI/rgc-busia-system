// components/finance/DashboardContent.tsx
"use client";

import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sampleData = [
  { month: "Jan", donations: 4000, expenses: 2500 },
  { month: "Feb", donations: 3500, expenses: 2100 },
  { month: "Mar", donations: 5200, expenses: 3000 },
  { month: "Apr", donations: 4600, expenses: 3200 },
  { month: "May", donations: 6100, expenses: 3500 },
];

export default function DashboardContent() {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "quarterly" | "yearly">("monthly");

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(["weekly","monthly","quarterly","yearly"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm ${filter === f ? "bg-red-600 text-white" : "bg-white border"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Quick stats (responsive grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow">
          <div className="text-sm text-gray-500">Offerings</div>
          <div className="text-2xl font-bold text-red-600">KES 120,000</div>
        </div>

        <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow">
          <div className="text-sm text-gray-500">Expenditures</div>
          <div className="text-2xl font-bold">KES 60,000</div>
        </div>

        <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow">
          <div className="text-sm text-gray-500">Balance</div>
          <div className="text-2xl font-bold">KES 60,000</div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 bg-white rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Giving vs Expenditure</h3>
          <div className="text-sm text-gray-500">Period: {filter}</div>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="donations" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#4b5563" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activities and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow">
          <h4 className="font-semibold mb-2">Recent Activities</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>John recorded a donation — KES 5,000 (2 hrs ago)</li>
            <li>Added new construction expense — KES 20,000 (6 hrs ago)</li>
            <li>Announcement published: Sunday meeting (1 day ago)</li>
          </ul>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          <h4 className="font-semibold mb-2">Quick Actions</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-4 py-2 rounded bg-red-600 text-white">Add Donation</button>
            <button className="px-4 py-2 rounded bg-gray-700 text-white">Add Expense</button>
            <button className="px-4 py-2 rounded bg-green-600 text-white">Export Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
