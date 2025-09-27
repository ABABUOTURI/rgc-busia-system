// components/finance/FinanceCharts.tsx
"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", donations: 4000, expenses: 2400 },
  { name: "Feb", donations: 3000, expenses: 1398 },
  { name: "Mar", donations: 2000, expenses: 9800 },
  { name: "Apr", donations: 2780, expenses: 3908 },
  { name: "May", donations: 1890, expenses: 4800 },
];

interface FinanceChartsProps {
  recordType: string;
  from: string;
  to: string;
}

export default function FinanceCharts({ recordType, from, to }: FinanceChartsProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h3 className="text-lg font-semibold mb-3">Donation & Expense Chart</h3>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="donations" fill="#ef4444" />
            <Bar dataKey="expenses" fill="#4b5563" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
