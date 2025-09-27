// components/finance/FinanceCharts.tsx
"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface FinanceChartsProps {
  recordType: string;
  from: string;
  to: string;
}

interface ChartData {
  name: string;
  value?: number;
  [key: string]: any;
}

export default function FinanceCharts({ recordType, from, to }: FinanceChartsProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalOfferings: 0,
    totalExpenditure: 0,
    netAmount: 0,
    recordCount: 0
  });

  // Fetch data based on record type and filters
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = "";
        let data: any[] = [];

        // Determine endpoint based on record type
        switch (recordType) {
          case "church-accounts":
            endpoint = "/api/church-accounts";
            break;
          case "construction":
            endpoint = "/api/construction";
            break;
          case "sunday-school":
            endpoint = "/api/sunday-school";
            break;
          case "expenditure":
            endpoint = "/api/expenditure";
            break;
          default:
            // For "all", we'll fetch church accounts as the main data
            endpoint = "/api/church-accounts";
        }

        console.log(`Fetching data from: ${endpoint} for record type: ${recordType}`);

        const response = await fetch(endpoint);
        if (response.ok) {
          data = await response.json();
          console.log(`Fetched ${data.length} records from ${endpoint}:`, data);
        } else {
          console.error(`Failed to fetch data from ${endpoint}:`, response.status, response.statusText);
        }

        // Filter data by date range if provided
        let filteredData = data;
        if (from && to) {
          filteredData = data.filter((record: any) => {
            const recordDate = new Date(record.date);
            return recordDate >= new Date(from) && recordDate <= new Date(to);
          });
          console.log(`Filtered to ${filteredData.length} records for date range ${from} to ${to}`);
        }

        // Process data based on record type
        const processedData = processDataForCharts(filteredData, recordType);
        console.log(`Processed chart data:`, processedData);
        setChartData(processedData);
        
        // Calculate summary
        calculateSummary(filteredData, recordType);
        
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [recordType, from, to]);

  const processDataForCharts = (data: any[], type: string): ChartData[] => {
    if (type === "church-accounts") {
      return data.map(record => {
        const mainService = record.offerings?.mainService || 0;
        const hbcTotal = (record.offerings?.hbc?.jerusalem || 0) + 
                        (record.offerings?.hbc?.emmanuel || 0) + 
                        (record.offerings?.hbc?.ebenezer || 0) + 
                        (record.offerings?.hbc?.agape || 0);
        const sundaySchool = record.offerings?.sundaySchool || 0;
        const totalOfferings = mainService + hbcTotal + sundaySchool;
        const totalExpenditure = Object.values(record.expenditure || {}).reduce((sum: number, val: any) => sum + (val || 0), 0);
        
        return {
          name: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: record.date,
          totalOfferings,
          totalExpenditure,
          netAmount: totalOfferings - totalExpenditure,
          mainService,
          hbcTotal,
          sundaySchool,
          tithe: record.expenditure?.tithe || 0,
          apostolic: record.expenditure?.apostolic || 0,
          bricks: record.expenditure?.bricks || 0,
          banking: record.expenditure?.banking || 0,
          pastorsUse: record.expenditure?.pastorsUse || 0
        };
      });
    }
    
    // For other record types, create basic structure
    return data.map((record, index) => ({
      name: `Record ${index + 1}`,
      value: record.amount || record.total || 0,
      date: record.date
    }));
  };

  const calculateSummary = (data: any[], type: string) => {
    if (type === "church-accounts") {
      const totalOfferings = data.reduce((sum, record) => {
        const mainService = record.offerings?.mainService || 0;
        const hbcTotal = (record.offerings?.hbc?.jerusalem || 0) + 
                        (record.offerings?.hbc?.emmanuel || 0) + 
                        (record.offerings?.hbc?.ebenezer || 0) + 
                        (record.offerings?.hbc?.agape || 0);
        const sundaySchool = record.offerings?.sundaySchool || 0;
        return sum + mainService + hbcTotal + sundaySchool;
      }, 0);

      const totalExpenditure = data.reduce((sum, record) => {
        return sum + Object.values(record.expenditure || {}).reduce((expSum: number, val: any) => expSum + (val || 0), 0);
      }, 0);

      setSummary({
        totalOfferings,
        totalExpenditure,
        netAmount: totalOfferings - totalExpenditure,
        recordCount: data.length
      });
    }
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-3 text-gray-600">No Data Available</h3>
        <p className="text-gray-500">No records found for the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards - Responsive */}
      {recordType === "church-accounts" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
            <h4 className="text-xs sm:text-sm font-medium text-green-800">Total Offerings</h4>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 break-words">
              KES {summary.totalOfferings.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
            <h4 className="text-xs sm:text-sm font-medium text-red-800">Total Expenditure</h4>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 break-words">
              KES {summary.totalExpenditure.toLocaleString()}
            </p>
          </div>
          <div className={`p-3 sm:p-4 rounded-lg border ${summary.netAmount >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h4 className={`text-xs sm:text-sm font-medium ${summary.netAmount >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              Net Amount
            </h4>
            <p className={`text-lg sm:text-xl lg:text-2xl font-bold break-words ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              KES {summary.netAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
            <h4 className="text-xs sm:text-sm font-medium text-blue-800">Records</h4>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{summary.recordCount}</p>
          </div>
        </div>
      )}

      {/* Charts - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bar Chart - Offerings vs Expenditure */}
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">📊 Offerings vs Expenditure</h3>
          <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value, name) => [`KES ${value.toLocaleString()}`, name]}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="totalOfferings" fill="#22c55e" name="Total Offerings" />
                <Bar dataKey="totalExpenditure" fill="#ef4444" name="Total Expenditure" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Net Amount Trend */}
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">📈 Net Amount Trend</h3>
          <div style={{ width: "100%", height: "250px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value) => [`KES ${value.toLocaleString()}`, 'Net Amount']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="netAmount" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Offerings Breakdown */}
        {recordType === "church-accounts" && (
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">🥧 Offerings Breakdown</h3>
            <div style={{ width: "100%", height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Main Service", value: chartData.reduce((sum, item) => sum + item.mainService, 0) },
                      { name: "HBC Total", value: chartData.reduce((sum, item) => sum + item.hbcTotal, 0) },
                      { name: "Sunday School", value: chartData.reduce((sum, item) => sum + item.sundaySchool, 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} contentStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Expenditure Breakdown */}
        {recordType === "church-accounts" && (
          <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">💸 Expenditure Breakdown</h3>
            <div style={{ width: "100%", height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={60} fontSize={12} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => `KES ${value.toLocaleString()}`} contentStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="tithe" stackId="a" fill="#ef4444" name="Tithe" />
                  <Bar dataKey="apostolic" stackId="a" fill="#f97316" name="Apostolic" />
                  <Bar dataKey="bricks" stackId="a" fill="#eab308" name="Bricks" />
                  <Bar dataKey="banking" stackId="a" fill="#22c55e" name="Banking" />
                  <Bar dataKey="pastorsUse" stackId="a" fill="#3b82f6" name="Pastor's Use" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
