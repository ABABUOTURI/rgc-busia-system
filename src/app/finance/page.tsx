"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/finance/Sidebar";
import DashboardContent from "@/components/finance/DashboardContent";
import { Bell, X, CheckCircle, AlertCircle, Info, Menu } from "lucide-react";
import SundaySchoolPage from "./records/sunday-school";
import ConstructionPage from "./records/construction";
import AnnouncementsPage from "./records/announcements";
import ChurchAccountsPage from "./records/church-accounts";
import ExpendituresPage from "./records/expenditures";
// Reports moved to Admin

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function FinancePage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch notifications from database
  const fetchNotifications = async () => {
    try {
      // Fetch recent activities and announcements
      const [churchAccountsRes, announcementsRes] = await Promise.all([
        fetch("/api/church-accounts"),
        fetch("/api/announcements")
      ]);

      const churchAccounts = churchAccountsRes.ok ? await churchAccountsRes.json() : [];
      const announcements = announcementsRes.ok ? await announcementsRes.json() : [];

      const newNotifications: Notification[] = [];

      // Generate notifications from recent church accounts
      churchAccounts.slice(0, 5).forEach((record: any) => {
        const totalOfferings = (record.offerings?.mainService || 0) + 
          (record.offerings?.hbc?.jerusalem || 0) + 
          (record.offerings?.hbc?.emmanuel || 0) + 
          (record.offerings?.hbc?.ebenezer || 0) + 
          (record.offerings?.hbc?.agape || 0) + 
          (record.offerings?.sundaySchool || 0);

        newNotifications.push({
          id: `church-${record._id}`,
          type: "success",
          title: "Church Account Recorded",
          message: `New church account recorded for ${new Date(record.date).toLocaleDateString()} - KES ${totalOfferings.toLocaleString()}`,
          timestamp: record.date,
          read: false
        });
      });

      // Generate notifications from announcements
      announcements.slice(0, 3).forEach((announcement: any) => {
        newNotifications.push({
          id: `announcement-${announcement._id}`,
          type: "info",
          title: "New Announcement",
          message: announcement.title || "New announcement posted",
          timestamp: announcement.createdAt || new Date().toISOString(),
          read: false
        });
      });

      // Add system notifications
      newNotifications.push({
        id: "system-1",
        type: "info",
        title: "System Update",
        message: "Finance system is running smoothly. All records are being processed correctly.",
        timestamp: new Date().toISOString(),
        read: false
      });

      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    // Update unread count based on current notifications
    setUnreadCount(prev => {
      const updatedNotifications = notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      return updatedNotifications.filter(n => !n.read).length;
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // Remove notification
  const removeNotification = (notificationId: string) => {
    const notificationToRemove = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    // Only decrease count if the removed notification was unread
    if (notificationToRemove && !notificationToRemove.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showDropdown && !target.closest('.notification-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      // reports moved to Admin
      case "sunday-school":
        return <SundaySchoolPage />;
      case "construction":
        return <ConstructionPage />;
      case "announcements":
        return <AnnouncementsPage />;
      case "church-accounts":
        return <ChurchAccountsPage />;
      // case "expenditures":
      //   return <ExpendituresPage />;
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
          onClick={() => {
            console.log('Overlay clicked, closing mobile menu');
            setShowMobileMenu(false);
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />

      {/* Main Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        

        {/* Content - Responsive */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-y-auto">{renderContent()}</main>
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
