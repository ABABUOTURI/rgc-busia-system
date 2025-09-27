"use client";

import { useState } from "react";
import { Home, FileText, BookOpen, Building, Bell, DollarSign, BarChart, Menu } from "lucide-react";

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

  const items = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "sunday-school", label: "Sunday School", icon: BookOpen },
    { id: "construction", label: "Construction", icon: Building },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "church-accounts", label: "Church Accounts", icon: DollarSign },
    // { id: "expenditures", label: "Expenditures", icon: FileText },
    { id: "reports", label: "Reports", icon: BarChart },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-white via-white to-red-500 text-black shadow-lg w-64 p-4 space-y-4 fixed inset-y-0 left-0 transform border-r
          ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-200 z-30`}
      >
        <h2 className="text-xl font-bold text-black mb-6">Finance Panel</h2>
        <nav className="space-y-2">
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
                  ? "bg-red-600/20 text-black"
                  : "text-black/90 hover:bg-red-600/10"
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
