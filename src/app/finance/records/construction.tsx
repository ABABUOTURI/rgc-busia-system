// app/finance/records/construction.tsx
"use client";

export default function ConstructionPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Church Construction Project</h2>
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        <p className="text-gray-600">Track land costs, project year, design notes, approvals, title deeds, and other custom fields.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white/50 rounded border">Project Name: Main Sanctuary</div>
          <div className="p-3 bg-white/50 rounded border">Budget: KES 2,000,000</div>
          <div className="p-3 bg-white/50 rounded border">Approvals: Health, Planning</div>
          <div className="p-3 bg-white/50 rounded border">Title Deed: Completed</div>
        </div>
      </div>
    </div>
  );
}
