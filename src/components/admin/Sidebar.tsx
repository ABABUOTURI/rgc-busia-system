"use client";
import { useState } from "react";
import { Home, Users, Settings, FileText, Menu } from "lucide-react";

export default function Sidebar({ activePage, setActivePage }: { 
  activePage: string; 
  setActivePage: (page: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "users", label: "Users", icon: Users },
    { id: "logs", label: "Activity Logs", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between ">
        <h1 className="text-lg font-bold text-black">Admin</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6 text-black" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-white text-gray-800 shadow-lg w-64 p-4 space-y-4 fixed inset-y-0 left-0 transform border-r
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-transform duration-200`}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActivePage(id);
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                activePage === id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
