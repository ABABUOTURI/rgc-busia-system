// components/finance/DashboardContent.tsx
"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardData {
  totalOfferings: number;
  totalExpenditure: number;
  netAmount: number;
  recordCount: number;
  chartData: Array<{
    month: string;
    offerings: number;
    expenses: number;
  }>;
  recentActivities: Array<{
    id: string;
    description: string;
    amount?: number;
    timestamp: string;
  }>;
}

export default function DashboardContent() {
  const [filter, setFilter] = useState<"weekly" | "monthly" | "quarterly" | "yearly">("monthly");
  const [data, setData] = useState<DashboardData>({
    totalOfferings: 0,
    totalExpenditure: 0,
    netAmount: 0,
    recordCount: 0,
    chartData: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data from database
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/church-accounts");
        if (response.ok) {
          const records = await response.json();
          
          // Calculate totals
          const totalOfferings = records.reduce((sum: number, record: any) => {
            const mainService = record.offerings?.mainService || 0;
            const hbcTotal = (record.offerings?.hbc?.jerusalem || 0) + 
                            (record.offerings?.hbc?.emmanuel || 0) + 
                            (record.offerings?.hbc?.ebenezer || 0) + 
                            (record.offerings?.hbc?.agape || 0);
            const sundaySchool = record.offerings?.sundaySchool || 0;
            return sum + mainService + hbcTotal + sundaySchool;
          }, 0);

          const totalExpenditure = records.reduce((sum: number, record: any) => {
            return sum + Object.values(record.expenditure || {}).reduce((expSum: number, val: any) => expSum + (val || 0), 0);
          }, 0);

          // Group data by month for chart
          const monthlyData: { [key: string]: { offerings: number; expenses: number } } = {};
          records.forEach((record: any) => {
            const date = new Date(record.date);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = { offerings: 0, expenses: 0 };
            }
            
            const mainService = record.offerings?.mainService || 0;
            const hbcTotal = (record.offerings?.hbc?.jerusalem || 0) + 
                            (record.offerings?.hbc?.emmanuel || 0) + 
                            (record.offerings?.hbc?.ebenezer || 0) + 
                            (record.offerings?.hbc?.agape || 0);
            const sundaySchool = record.offerings?.sundaySchool || 0;
            const offerings = mainService + hbcTotal + sundaySchool;
            const expenses = Object.values(record.expenditure || {}).reduce((sum: number, val: any) => sum + (val || 0), 0);
            
            monthlyData[monthKey].offerings += offerings;
            monthlyData[monthKey].expenses += expenses;
          });

          const chartData = Object.entries(monthlyData).map(([month, data]) => ({
            month,
            offerings: data.offerings,
            expenses: data.expenses
          }));

          // Generate recent activities from records
          const recentActivities = records.slice(0, 5).map((record: any) => {
            const totalOfferings = (record.offerings?.mainService || 0) + 
              (record.offerings?.hbc?.jerusalem || 0) + 
              (record.offerings?.hbc?.emmanuel || 0) + 
              (record.offerings?.hbc?.ebenezer || 0) + 
              (record.offerings?.hbc?.agape || 0) + 
              (record.offerings?.sundaySchool || 0);
            
            return {
              id: record._id,
              description: `Church account recorded for ${new Date(record.date).toLocaleDateString()}`,
              amount: totalOfferings,
              timestamp: record.date
            };
          });

          setData({
            totalOfferings,
            totalExpenditure,
            netAmount: totalOfferings - totalExpenditure,
            recordCount: records.length,
            chartData,
            recentActivities
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl mt-6"></div>
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total Offerings</div>
          <div className="text-2xl font-bold text-green-600">
            KES {data.totalOfferings.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow">
          <div className="text-sm text-gray-500">Total Expenditures</div>
          <div className="text-2xl font-bold text-red-600">
            KES {data.totalExpenditure.toLocaleString()}
          </div>
        </div>

        <div className={`p-4 bg-white/70 backdrop-blur rounded-2xl shadow ${data.netAmount >= 0 ? 'border-green-200' : 'border-red-200'}`}>
          <div className="text-sm text-gray-500">Net Balance</div>
          <div className={`text-2xl font-bold ${data.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            KES {data.netAmount.toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow">
          <div className="text-sm text-gray-500">Records</div>
          <div className="text-2xl font-bold text-blue-600">{data.recordCount}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 bg-white rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Offerings vs Expenditure</h3>
          <div className="text-sm text-gray-500">Period: {filter}</div>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [`KES ${value.toLocaleString()}`, name]}
              />
              <Line type="monotone" dataKey="offerings" stroke="#22c55e" strokeWidth={2} name="Offerings" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenditures" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activities and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow">
          <h4 className="font-semibold mb-2">Recent Activities</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            {data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity) => (
                <li key={activity.id} className="flex justify-between items-center">
                  <span>{activity.description}</span>
                  {activity.amount && (
                    <span className="font-semibold text-green-600">
                      KES {activity.amount.toLocaleString()}
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-400">No recent activities</li>
            )}
          </ul>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          <h4 className="font-semibold mb-2">Quick Actions</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              disabled 
              className="px-4 py-2 rounded bg-gray-400 text-white cursor-not-allowed opacity-50"
            >
              Add Church Account
            </button>
            <button 
              disabled 
              className="px-4 py-2 rounded bg-gray-400 text-white cursor-not-allowed opacity-50"
            >
              Add Expenditure
            </button>
            <button 
              disabled 
              className="px-4 py-2 rounded bg-gray-400 text-white cursor-not-allowed opacity-50"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
