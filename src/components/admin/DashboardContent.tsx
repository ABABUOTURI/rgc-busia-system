"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Types for clarity
interface Summary {
  donations: number;
  expenses: number;
  attendance: number;
}

interface MonthlyData {
  name: string; // e.g. Jan, Feb, Mar
  churchAccounts: number;
  construction: number;
  expenditures: number;
  sundaySchool: number;
  fundraising: number;
}

interface Activity {
  _id: string;
  date: string;
  user: string;
  action: string;
  details: string;
}

export default function DashboardContent() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/finance/dashboard"); // API route
        const data = await res.json();

        setSummary(data.summary);
        setMonthlyData(data.monthlyOverview);
        setActivities(data.recentActivity);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">💰 Donations: KES {summary?.donations.toLocaleString()}</CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">📊 Expenses: KES {summary?.expenses.toLocaleString()}</CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">👥 Attendance: {summary?.attendance}</CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 font-bold">Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="churchAccounts" stroke="blue" name="Church Accounts" />
              <Line type="monotone" dataKey="construction" stroke="orange" name="Construction" />
              <Line type="monotone" dataKey="expenditures" stroke="red" name="Expenditures" />
              <Line type="monotone" dataKey="sundaySchool" stroke="green" name="Sunday School" />
              <Line type="monotone" dataKey="fundraising" stroke="purple" name="Fundraising" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 font-bold">Recent Activity</h3>
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-600">
                    <th className="p-2">Date</th>
                    <th className="p-2">User</th>
                    <th className="p-2">Action</th>
                    <th className="p-2">Details</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {activities.map((activity) => (
                    <tr key={activity._id} className="border-t">
                      <td className="p-2">{new Date(activity.date).toLocaleDateString()}</td>
                      <td className="p-2">{activity.user}</td>
                      <td className="p-2">{activity.action}</td>
                      <td className="p-2">{activity.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
