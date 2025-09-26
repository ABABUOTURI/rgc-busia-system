"use client";

import { useEffect, useState } from "react";

export default function SundaySchoolPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ _id: "", year: "", date: "", amount: "" });
  const [filter, setFilter] = useState("all");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch records
  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/sunday-school", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setRecords(data);
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to load records' });
      }
    } catch (e) {
      setAlert({ type: 'error', message: 'Network error while loading records' });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!form.year || !form.date || !form.amount) {
      setAlert({ type: 'error', message: 'Year, date and amount are required' });
      return;
    }
    setIsSubmitting(true);
    setAlert(null);
    try {
      const endpoint = '/api/sunday-school';
      const method = mode === 'add' ? 'POST' : 'PUT';
      const payload = mode === 'add'
        ? { year: form.year, date: form.date, amount: form.amount }
        : { _id: form._id, year: form.year, date: form.date, amount: form.amount };
      const res = await fetch(endpoint, {
        method,
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: 'success', message: mode === 'add' ? 'Record added successfully' : 'Record updated successfully' });
        setForm({ _id: "", year: "", date: "", amount: "" });
        setMode('add');
        await fetchRecords();
        setOpen(false);
      } else {
        setAlert({ type: 'error', message: data.error || 'Operation failed' });
        setOpen(false);
      }
    } catch (e) {
      setAlert({ type: 'error', message: 'Network error' });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logic
  const filteredRecords = records.filter((r) => {
    if (filter === "all") return true;

    const d = new Date(r.date);
    const month = d.getMonth();
    const quarter = Math.floor(month / 3);
    const half = month < 6 ? 1 : 2;

    if (filter === "monthly") return d.getMonth() === new Date().getMonth();
    if (filter === "quarterly") return quarter === Math.floor(new Date().getMonth() / 3);
    if (filter === "half") return half === (new Date().getMonth() < 6 ? 1 : 2);
    if (filter === "yearly") return d.getFullYear() === new Date().getFullYear();

    return true;
  });

  return (
    <div>
      {alert && (
        <div className={`mb-3 rounded border px-3 py-2 text-sm ${alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {alert.message}
        </div>
      )}
      {/* Header + Button */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-black">Sunday School Accounts</h2>
        <button
          onClick={() => {
            setMode("add");
            setForm({ _id: "", year: "", date: "", amount: "" });
            setOpen(true);
          }}
          className="bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-400 hover:text-black"
        >
          + Add Account
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <select
          className="border px-3 py-2 rounded text-black"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="monthly">This Month</option>
          <option value="quarterly">This Quarter</option>
          <option value="half">This Half</option>
          <option value="yearly">This Year</option>
        </select>
      </div>

      {/* Records Table */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-black">
            <thead>
              <tr className="bg-red-700 text-white">
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.year}</td>
                  <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-2">KES {r.amount}</td>
                  <td className="p-2">
                    <button
                      className="text-gray-600 hover:underline"
                      onClick={() => {
                        setMode("edit");
                        setForm({
                          _id: r._id,
                          year: r.year,
                          date: new Date(r.date).toISOString().split("T")[0],
                          amount: r.amount,
                        });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 text-black">
              {mode === "add" ? "Add Sunday School Account" : "Edit Sunday School Account"}
            </h3>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Year"
                className="w-full border px-3 py-2 rounded text-black"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
              <input
                type="date"
                className="w-full border px-3 py-2 rounded text-black"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount Collected"
                className="w-full border px-3 py-2 rounded text-black"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-gray-300" disabled={isSubmitting}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-700 hover:bg-gray-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (mode === "add" ? "Save" : "Update")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
