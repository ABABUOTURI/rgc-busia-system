"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RecordItem {
  _id: string;
  date: string;
  amount: number;
  description?: string;
}

interface Activity {
  _id: string;
  date: string;
  user: string;
  action: string;
  details: string;
}

export default function DashboardContent() {
  const [sundaySchool, setSundaySchool] = useState<RecordItem[]>([]);
  const [churchAccounts, setChurchAccounts] = useState<RecordItem[]>([]);
  const [construction, setConstruction] = useState<RecordItem[]>([]);
  const [expenditure, setExpenditure] = useState<RecordItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/finance/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();

        setSundaySchool(data.sundaySchool || []);
        setChurchAccounts(data.churchAccounts || []);
        setConstruction(data.construction || []);
        setExpenditure(data.expenditure || []);
        setActivities(data.recentActivity || []);
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
        setSundaySchool([]);
        setChurchAccounts([]);
        setConstruction([]);
        setExpenditure([]);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 15000);
    return () => clearInterval(interval);
  }, []);

  const applyFilter = (records: RecordItem[], key: string) => {
    if (!filters[key]) return records;
    return records.filter((r) =>
      new Date(r.date).toLocaleDateString().includes(filters[key])
    );
  };

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6 text-black">
      {/* Records in 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sunday School Records */}
        <Card className="shadow-lg rounded-2xl hover:shadow-2xl transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Sunday School Records</h3>
              <input
                type="text"
                placeholder="Filter by date..."
                className="border px-2 py-1 rounded"
                value={filters.sundaySchool || ""}
                onChange={(e) =>
                  setFilters({ ...filters, sundaySchool: e.target.value })
                }
              />
            </div>
            {applyFilter(sundaySchool, "sundaySchool").length === 0 ? (
              <p className="text-sm text-gray-500">No Sunday school records</p>
            ) : (
              <ul className="space-y-2">
                {applyFilter(sundaySchool, "sundaySchool").map((rec) => (
                  <li
                    key={rec._id}
                    className="p-3 rounded-xl shadow-md bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    {new Date(rec.date).toLocaleDateString()} — KES{" "}
                    {rec.amount.toLocaleString()} ({rec.description})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Church Accounts */}
        <Card className="shadow-lg rounded-2xl hover:shadow-2xl transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Church Accounts</h3>
              <input
                type="text"
                placeholder="Filter by date..."
                className="border px-2 py-1 rounded"
                value={filters.churchAccounts || ""}
                onChange={(e) =>
                  setFilters({ ...filters, churchAccounts: e.target.value })
                }
              />
            </div>
            {applyFilter(churchAccounts, "churchAccounts").length === 0 ? (
              <p className="text-sm text-gray-500">No church account records</p>
            ) : (
              <ul className="space-y-2">
                {applyFilter(churchAccounts, "churchAccounts").map((rec) => (
                  <li
                    key={rec._id}
                    className="p-3 rounded-xl shadow-md bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    {new Date(rec.date).toLocaleDateString()} — KES{" "}
                    {rec.amount.toLocaleString()} ({rec.description})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Construction Records */}
        <Card className="shadow-lg rounded-2xl hover:shadow-2xl transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Construction Records</h3>
              <input
                type="text"
                placeholder="Filter by date..."
                className="border px-2 py-1 rounded"
                value={filters.construction || ""}
                onChange={(e) =>
                  setFilters({ ...filters, construction: e.target.value })
                }
              />
            </div>
            {applyFilter(construction, "construction").length === 0 ? (
              <p className="text-sm text-gray-500">No construction records</p>
            ) : (
              <ul className="space-y-2">
                {applyFilter(construction, "construction").map((rec) => (
                  <li
                    key={rec._id}
                    className="p-3 rounded-xl shadow-md bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    {new Date(rec.date).toLocaleDateString()} — KES{" "}
                    {rec.amount.toLocaleString()} ({rec.description})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Expenditure Records */}
        <Card className="shadow-lg rounded-2xl hover:shadow-2xl transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Expenditure Records</h3>
              <input
                type="text"
                placeholder="Filter by date..."
                className="border px-2 py-1 rounded"
                value={filters.expenditure || ""}
                onChange={(e) =>
                  setFilters({ ...filters, expenditure: e.target.value })
                }
              />
            </div>
            {applyFilter(expenditure, "expenditure").length === 0 ? (
              <p className="text-sm text-gray-500">No expenditure records</p>
            ) : (
              <ul className="space-y-2">
                {applyFilter(expenditure, "expenditure").map((rec) => (
                  <li
                    key={rec._id}
                    className="p-3 rounded-xl shadow-md bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    {new Date(rec.date).toLocaleDateString()} — KES{" "}
                    {rec.amount.toLocaleString()} ({rec.description})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg rounded-2xl hover:shadow-2xl transition-shadow">
        <CardContent className="p-4">
          <h3 className="mb-4 font-bold">Recent Activity</h3>
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow">
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
                    <tr
                      key={activity._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-2">
                        {new Date(activity.date).toLocaleDateString()}
                      </td>
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
