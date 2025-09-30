"use client";

import { useEffect, useState } from "react";

type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  date?: string;
  createdAt?: string;
  createdBy?: string;
};

export default function NotificationsContent() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const fetchNotifications = async () => {
    try {
      // Use announcements as the source of notifications (normalized on API)
      const res = await fetch("/api/announcements", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.warn("Failed to load notifications", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load read state from localStorage
    try {
      const saved = localStorage.getItem('notifications.readIds');
      if (saved) setReadIds(new Set(JSON.parse(saved)));
    } catch {}

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem('notifications.readIds', JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  };

  const isRead = (id: string) => readIds.has(id);

  const sorted = [...items].sort((a, b) => {
    const da = new Date(a.date || a.createdAt || 0).getTime();
    const db = new Date(b.date || b.createdAt || 0).getTime();
    return db - da; // latest first
  });

  const filtered = sorted.filter(n => {
    if (filter === 'all') return true;
    return filter === 'read' ? isRead(n._id) : !isRead(n._id);
  });

  if (loading) {
    return <p className="p-4">Loading notifications...</p>;
  }

  if (!items.length) {
    return (
      <div className="p-4 text-gray-600">
        <h2 className="text-lg font-semibold mb-2 text-black">Notifications</h2>
        <p>No notifications at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg font-semibold text-black">Notifications</h2>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all'?'bg-gray-700 text-white':'bg-white'}`}>All</button>
          <button onClick={() => setFilter('unread')} className={`px-3 py-1 rounded ${filter==='unread'?'bg-gray-700 text-white':'bg-white'}`}>Unread</button>
          <button onClick={() => setFilter('read')} className={`px-3 py-1 rounded ${filter==='read'?'bg-gray-700 text-white':'bg-white'}`}>Read</button>
        </div>
      </div>
      <ul className="space-y-2">
        {filtered.map((n) => (
          <li key={n._id} className={`bg-white rounded-lg  shadow p-2 sm:p-3 ${!isRead(n._id) ? 'border-l-4 border-l-red-600' : ''}`} onClick={() => markAsRead(n._id)}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 className="font-semibold text-black break-words">{n.title}</h3>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(n.date || n.createdAt || Date.now()).toLocaleString()}
              </span>
            </div>
            {n.message && (
              <p className="text-sm text-gray-700 mt-1 break-words">{n.message}</p>
            )}
            {n.createdBy && (
              <p className="text-xs text-gray-500 mt-2">By {n.createdBy}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


