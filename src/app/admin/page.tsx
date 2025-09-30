"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/admin/Sidebar";
import DashboardContent from "../../components/admin/DashboardContent";
import UsersContent from "../../components/admin/UsersContent";
import LogsContent from "../../components/admin/LogsContent";
import SettingsContent from "../../components/admin/SettingsContent";
import AnnouncementsContent from "../../components/admin/AnnouncementsContent";
import ReportsPage from "../finance/reports/page";
import { Bell } from "lucide-react";

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "New user registered: Finance Officer",
    "Backup completed successfully",
    "System update scheduled for Sunday",
  ]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      if (decoded.role !== "Admin") {
        router.push("/dashboard");
        return;
      }

      // ✅ fetch user name from MongoDB Atlas API
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/${decoded.userId}`);
          if (res.ok) {
            const data = await res.json();
            setUserName(data.name || "Admin");
            localStorage.setItem("name", data.name || "Admin"); // keep consistency for Avatar
          }
        } catch (err) {
          console.error("Failed to fetch user", err);
        }
      };

      fetchUser();
      setLoading(false);
    } catch {
      router.push("/login");
    }
  }, [router]);

  if (loading) return <p className="p-8">Loading...</p>;

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UsersContent />;
      case "announcements":
        return <AnnouncementsContent />;
      case "logs":
        return <LogsContent />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-2 sm:px-4 py-3 relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>
            {/* Left side: Welcome */}
            <h2 className="text-lg font-semibold text-gray-800">
              Welcome, {userName || "Admin"} 👋
            </h2>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 relative flex-shrink-0">
              {/* Search input (smaller) */}
              <div className="hidden sm:block w-48">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

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

              {/* Avatar */}
              <Avatar />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

function Avatar() {
  const [initials, setInitials] = useState("A");
  useEffect(() => {
    const storedName =
      typeof window !== "undefined" ? localStorage.getItem("name") : null;
    if (storedName) {
      const parts = storedName.trim().split(/\s+/);
      const first = parts[0]?.[0] || "";
      const second = parts[1]?.[0] || "";
      const init = (first + second).toUpperCase() || "A";
      setInitials(init);
    }
  }, []);
  return (
    <div className="h-9 w-9 rounded-full bg-red-700 text-white flex items-center justify-center font-bold">
      {initials}
    </div>
  );
}
