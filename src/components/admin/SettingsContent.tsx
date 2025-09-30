"use client";

import { useState } from "react";

export default function SettingsContent() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleBackup = async () => {
    try {
      setBusy(true);
      setMessage(null);
      const res = await fetch("/api/admin/backup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Backup failed");
      setMessage("Backup started. The backup will be emailed to the admin.");
    } catch (e: any) {
      setMessage(e.message || "Backup failed");
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async (file: File) => {
    try {
      setBusy(true);
      setMessage(null);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/restore", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed");
      setMessage("Restore completed successfully.");
    } catch (e: any) {
      setMessage(e.message || "Restore failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-black">System Settings</h2>
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={handleBackup} disabled={busy} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-60">
          {busy ? "Processing..." : "Backup Database"}
        </button>
        <label className="ml-0 rounded bg-gray-600 px-4 py-2 text-white cursor-pointer">
          Restore Backup
          <input type="file" accept="application/json" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleRestore(f);
          }} />
        </label>
      </div>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
