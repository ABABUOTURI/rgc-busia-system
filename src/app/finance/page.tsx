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
import ReportsPage from "./reports/page";

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
      case "reports":
        return <ReportsPage/>;
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
        <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-2 sm:px-4 py-3 relative">
            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                console.log('Mobile menu clicked, current state:', showMobileMenu);
                setShowMobileMenu(!showMobileMenu);
              }}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>

            {/* Search - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 w-full max-w-lg mx-2 sm:mx-0">
              <input
                type="text"
                placeholder="Search finance..."
                className="w-full rounded-md border px-2 sm:px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Right Side - Responsive */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 relative flex-shrink-0">
              {/* Notifications */}
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="relative p-1"
                >
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown - Responsive */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 sm:p-4 border-b bg-gray-50 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <ul className="divide-y">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <li
                            key={notification.id}
                            className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                                <div className="flex-shrink-0 mt-1">
                                  {notification.type === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {notification.type === "info" && <Info className="h-4 w-4 text-blue-500" />}
                                  {notification.type === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                                  {notification.type === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="flex-shrink-0 ml-1 sm:ml-2 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="p-6 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p>No notifications yet</p>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {/* User - Responsive */}
              <span className="text-xs sm:text-sm text-black hidden sm:block">Finance</span>
              <Avatar />
            </div>
          </div>
        </header>

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
