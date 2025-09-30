"use client";

import { useEffect, useState } from "react";
import {
  Home,
  FileText,
  BookOpen,
  Building,
  Bell,
  DollarSign,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  activePage,
  setActivePage,
  showMobileMenu,
  setShowMobileMenu,
}: {
  activePage: string;
  setActivePage: (page: string) => void;
  showMobileMenu?: boolean;
  setShowMobileMenu?: (show: boolean) => void;
}) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  const items = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "sunday-school", label: "Sunday School", icon: BookOpen },
    { id: "construction", label: "Construction", icon: Building },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "church-accounts", label: "Church Accounts", icon: DollarSign },
    { id: "notifications", label: "Notifications", icon: FileText },
  ];

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return (
      (parts[0]?.[0] || "") + (parts[1]?.[0] || "")
    ).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login"; // redirect to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-white via-white to-red-500 text-black shadow-lg w-64 p-4 flex flex-col fixed inset-y-0 left-0 transform border-r
          ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-200 z-50`}
      >
        {/* Top Church Branding */}
        <div className="flex items-center space-x-3 bg-white rounded-lg px-3 py-2 mb-4">
          <img
            src="/rgc.png"
            alt="Church Logo"
            className="w-10 h-10 rounded"
          />
          <div>
            <p className="font-bold text-sm text-red-700">Redeemed Gospel Church Busia</p>
            <p className="text-xs  text-black font-semibold">Finance Portal</p>
          </div>
        </div>

        {/* User Profile */}
        {user && (
          <div
            className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-red-100 rounded-lg mb-4"
            onClick={() => setShowProfileModal(true)}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full border bg-red-600 text-white font-bold">
              {getInitials(user.name)}
            </div>
            <div>
              <p className="font-semibold text-sm">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="space-y-2 flex-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActivePage(id);
                if (setShowMobileMenu) {
                  setShowMobileMenu(false);
                }
              }}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                activePage === id
                  ? "bg-red-600/20 text-black font-semibold"
                  : "text-black/90 hover:bg-red-600/10"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout at bottom */}
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 mt-4 rounded-lg text-left text-red-700 hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </aside>

      {/* Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedUser = {
                  name: formData.get("name") as string,
                  email: formData.get("email") as string,
                };

                const res = await fetch("/api/auth/update-profile", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updatedUser),
                });

                if (res.ok) {
                  const data = await res.json();
                  setUser(data.user);
                  setShowProfileModal(false);
                } else {
                  alert("Failed to update profile");
                }
              }}
              className="space-y-3"
            >
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="email"
                name="email"
                defaultValue={user.email}
                className="w-full border rounded px-3 py-2"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
