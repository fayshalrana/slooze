import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLayout } from "../contexts/LayoutContext";
import { useNotifications } from "../contexts/NotificationContext";
import { SearchBar } from "./SearchBar";
import { IconButton } from "./IconButton";
import profileImage from "../assets/images/fayshalrana.webp";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout, hasRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toggleDashboardLayout,
    toggleProductsLayout,
    toggleAddProductLayout,
  } = useLayout();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleLayoutToggle = () => {
    if (location.pathname === "/dashboard") {
      toggleDashboardLayout();
    } else if (location.pathname === "/products") {
      toggleProductsLayout();
    } else if (location.pathname === "/products/add") {
      toggleAddProductLayout();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setUserDrawerOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        userDrawerOpen &&
        !target.closest(".user-drawer") &&
        !target.closest(".user-avatar")
      ) {
        setUserDrawerOpen(false);
      }
      if (
        notificationOpen &&
        !target.closest(".notification-dropdown") &&
        !target.closest(".notification-button")
      ) {
        setNotificationOpen(false);
      }
    };

    if (userDrawerOpen || notificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userDrawerOpen, notificationOpen]);

  return (
    <header
      className={`px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#151515]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
          : "bg-white dark:bg-[#151515] border-b border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Search Bar in Header */}
        <SearchBar />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative"></div>
        <IconButton
          onClick={handleLayoutToggle}
          icon={
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          }
          ariaLabel="Toggle Layout"
        />
        <div className="relative">
          <IconButton
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="notification-button"
            badge={unreadCount > 0}
            icon={
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            }
            ariaLabel="Notifications"
          />
          {notificationOpen && (
            <div className="notification-dropdown fixed sm:absolute right-2 sm:right-0 top-[4.5rem] sm:top-auto sm:mt-2 w-[calc(100vw-1rem)] sm:w-80 max-w-sm bg-white dark:bg-[#151515] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <button
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate("/notifications");
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => {
                  const getIcon = () => {
                    switch (notification.type) {
                      case "success":
                        return (
                          <svg
                            className="w-5 h-5 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        );
                      case "warning":
                        return (
                          <svg
                            className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        );
                      case "error":
                        return (
                          <svg
                            className="w-5 h-5 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        );
                      default:
                        return (
                          <svg
                            className="w-5 h-5 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        );
                    }
                  };
                  const getBgColor = () => {
                    switch (notification.type) {
                      case "success":
                        return "bg-green-100 dark:bg-green-900/30";
                      case "warning":
                        return "bg-yellow-100 dark:bg-yellow-900/30";
                      case "error":
                        return "bg-red-100 dark:bg-red-900/30";
                      default:
                        return "bg-blue-100 dark:bg-blue-900/30";
                    }
                  };
                  const formatTime = (timestamp: string) => {
                    const now = new Date();
                    const time = new Date(timestamp);
                    const diffInSeconds = Math.floor(
                      (now.getTime() - time.getTime()) / 1000
                    );
                    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
                    if (diffInSeconds < 3600)
                      return `${Math.floor(diffInSeconds / 60)}m ago`;
                    if (diffInSeconds < 86400)
                      return `${Math.floor(diffInSeconds / 3600)}h ago`;
                    return `${Math.floor(diffInSeconds / 86400)}d ago`;
                  };
                  return (
                    <div
                      key={notification.id}
                      onClick={() => {
                        if (!notification.read) markAsRead(notification.id);
                        setNotificationOpen(false);
                      }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                        !notification.read
                          ? "bg-blue-50 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${getBgColor()} flex items-center justify-center flex-shrink-0`}
                        >
                          {getIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {notifications.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <IconButton
          onClick={toggleTheme}
          icon={<>{theme === "light" ? "🌙" : "☀️"}</>}
          ariaLabel="Toggle theme"
        />
        <div className="relative">
          <button
            onClick={() => setUserDrawerOpen(!userDrawerOpen)}
            className="user-avatar w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-all ring-2 ring-blue-50/50 dark:ring-transparent backdrop-blur-sm"
          >
            {user ? (
              hasRole("Manager") ? (
                <img
                  src={profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className +=
                        " bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold";
                      parent.textContent = user.name.charAt(0).toUpperCase();
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                ?
              </div>
            )}
          </button>
          {userDrawerOpen && (
            <div className="user-drawer absolute right-0 mt-2 w-56 bg-white dark:bg-[#151515] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {user?.email}
                </p>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    navigate("/settings/profile");
                    setUserDrawerOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-all flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
