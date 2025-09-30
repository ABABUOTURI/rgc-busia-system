"use client";
import { useEffect, useState } from "react";

interface Log {
  _id: string;
  userId: string;
  username: string;
  action: string;
  date: string;
  device?: string;
  ip?: string;
  mac?: string;
}

export default function LogsContent() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = (filterUser === "all" ? logs : logs.filter(log => log.username === filterUser))
    .filter(log => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        log.username.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        (log.device?.toLowerCase().includes(q) ?? false) ||
        (log.ip?.toLowerCase().includes(q) ?? false) ||
        (log.mac?.toLowerCase().includes(q) ?? false)
      );
    });

  const uniqueUsers = Array.from(new Set(logs.map(log => log.username)));

  if (loading) return <p>Loading logs...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Activity Logs</h2>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <label htmlFor="userFilter" className="text-sm font-medium">
          Filter by User:
        </label>
        <select
          id="userFilter"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
        >
          <option value="all">All Users</option>
          {uniqueUsers.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search logs (user, action, device, IP, MAC)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border px-2 py-1 text-sm flex-1 min-w-[200px]"
        />
      </div>

      {/* Logs List */}
      <ul className="space-y-2">
        {filteredLogs.map(log => (
          <li
            key={log._id}
            className="rounded bg-white p-4 shadow border border-gray-100"
          >
            <div className="flex justify-between">
              <p className="font-medium">{log.action}</p>
              <span className="text-xs text-gray-500">
                {new Date(log.date).toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <p>User: {log.username}</p>
              {log.device && <p>Device: {log.device}</p>}
              {log.ip && <p>IP: {log.ip}</p>}
              {log.mac && <p>MAC: {log.mac}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
