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
import NotificationsContent from "@/components/finance/NotificationsContent";

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
      case "notifications":
        return <NotificationsContent />;
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
