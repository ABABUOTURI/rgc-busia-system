"use client";

import { useState } from "react";
import Sidebar from "@/components/finance/Sidebar";
import DashboardContent from "@/components/finance/DashboardContent";
import { Bell } from "lucide-react";

export default function FinancePage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [notifications, setNotifications] = useState<string[]>([
    "New donation recorded: $500",
    "Expenditure approved: Bricks/Blocks",
    "Reminder: Submit monthly report",
  ]);
  const [showDropdown, setShowDropdown] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "reports":
        return <div>📊 Reports Section</div>;
      case "sunday-school":
        return <div>📘 Sunday School Records</div>;
      case "construction":
        return <div>🏗️ Construction Records</div>;
      case "announcements":
        return <div>📢 Announcements</div>;
      case "church-accounts":
        return <div>💒 Church Accounts</div>;
      case "expenditures":
        return <div>💸 Expenditures</div>;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 relative">
            {/* Search */}
            <div className="flex items-center gap-3 w-full max-w-lg">
              <input
                type="text"
                placeholder="Search finance..."
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6 relative">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="relative"
                >
                  <Bell className="h-6 w-6 text-gray-700" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div className="p-3 border-b font-semibold text-gray-700">
                      Notifications
                    </div>
                    <ul className="divide-y">
                      {notifications.length > 0 ? (
                        notifications.map((note, i) => (
                          <li
                            key={i}
                            className="p-3 text-sm hover:bg-gray-50 cursor-pointer"
                          >
                            {note}
                          </li>
                        ))
                      ) : (
                        <li className="p-3 text-sm text-gray-500">
                          No new notifications
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* User */}
              <span className="text-sm text-black hidden sm:block">Finance</span>
              <Avatar />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

function Avatar() {
  const [initials] = useState("FO"); // Finance Officer
  return (
    <div className="h-9 w-9 rounded-full bg-red-700 text-white flex items-center justify-center font-bold">
      {initials}
    </div>
  );
}
