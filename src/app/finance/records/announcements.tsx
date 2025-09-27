// app/finance/records/announcements.tsx
"use client";

import { useEffect, useState } from "react";

interface Announcement {
  _id?: string;
  title: string;
  message: string;
  date: string; // YYYY-MM-DD
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filtered, setFiltered] = useState<Announcement[]>([]);
  const [filterDate, setFilterDate] = useState("");

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      setAnnouncements(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Filter announcements
  const handleFilter = () => {
    if (!filterDate) {
      setFiltered(announcements);
    } else {
      setFiltered(announcements.filter((a) => a.date === filterDate));
    }
  };

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl font-semibold mb-3 text-black">Announcements</h2>

      {/* Filters */}
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="date"
          className="border px-3 py-2 rounded text-black"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button
          onClick={handleFilter}
          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Filter
        </button>
        <button
          onClick={() => {
            setFilterDate("");
            setFiltered(announcements);
          }}
          className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-600">No announcements found.</p>
        ) : (
          filtered.map((a) => (
            <div
              key={a._id}
              className="bg-white p-4 rounded-2xl shadow border border-gray-100"
            >
              <h3 className="font-semibold text-black">{a.title}</h3>
              <p className="text-gray-700">{a.message}</p>
              <p className="text-sm text-gray-500 mt-1">
                📅 {new Date(a.date).toDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
