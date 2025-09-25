// app/finance/records/announcements.tsx
"use client";

export default function AnnouncementsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Announcements</h2>
      <div className="bg-white p-4 rounded-2xl shadow">
        <p className="text-gray-600 mb-3">Create, edit and broadcast announcements to members.</p>
        <button className="px-4 py-2 rounded bg-red-600 text-white">+ New Announcement</button>
      </div>
    </div>
  );
}
