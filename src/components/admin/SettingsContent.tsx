"use client";

export default function SettingsContent() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">System Settings</h2>
      <button className="rounded bg-blue-600 px-4 py-2 text-white">
        Backup Database
      </button>
      <button className="ml-4 rounded bg-gray-600 px-4 py-2 text-white">
        Restore Backup
      </button>
    </div>
  );
}
