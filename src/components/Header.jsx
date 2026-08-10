import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // =========================
  // Get Worker Notifications
  // =========================
  const fetchNotifications = async () => {
    try {
      const workerId = localStorage.getItem("workerId");

      if (!workerId) {
        return;
      }

      const response = await fetch(
        `https://jbackend-h963.onrender.com/notifications/${workerId}`
      );

      const result = await response.json();

      if (result.success) {
        setNotifications(result.notifications || []);
        setUnreadCount(result.unreadCount || 0);
      }
    } catch (error) {
      console.error(
        "Notification Error:",
        error
      );
    }
  };

  // =========================
  // Load Notifications
  // =========================
  useEffect(() => {
    fetchNotifications();

    // Check every 10 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // Mark Notification Read
  // =========================
  const markAsRead = async (notification) => {
    try {
      if (!notification.isRead) {
        await fetch(
          `https://jbackend-h963.onrender.com/notifications/${notification._id}/read`,
          {
            method: "PATCH",
          }
        );
      }

      // Refresh notifications
      fetchNotifications();
    } catch (error) {
      console.error(
        "Mark Notification Error:",
        error
      );
    }
  };

  // =========================
  // Mark All Read
  // =========================
  const markAllAsRead = async () => {
    try {
      const workerId =
        localStorage.getItem("workerId");

      if (!workerId) return;

      await fetch(
        `https://jbackend-h963.onrender.com/notifications/worker/${workerId}/read-all`,
        {
          method: "PATCH",
        }
      );

      fetchNotifications();
    } catch (error) {
      console.error(
        "Mark All Notification Error:",
        error
      );
    }
  };

  return (
    <header className="bg-white shadow-md relative z-50">

      {/* =========================
          MAIN HEADER
      ========================= */}

      <div className="max-w-7xl mx-auto px-4">
        <div className="h-20 flex items-center justify-between">

          {/* ========== LOGO ========== */}

          <Link
            to="/"
            className="text-3xl font-bold text-sky-600"
          >
            Jobhir
          </Link>


          {/* =========================
              DESKTOP RIGHT
          ========================= */}

          <div className="hidden md:flex items-center gap-5">

            {/* =========================
                Notification Bell
            ========================= */}

            {localStorage.getItem("workerId") && (
              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(
                      !showNotifications
                    )
                  }
                  className="relative w-11 h-11 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                >

                  {/* Bell SVG */}

                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 21h4"
                    />
                  </svg>


                  {/* Unread Badge */}

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}

                </button>


                {/* =========================
                    Notification Dropdown
                ========================= */}

                {showNotifications && (
                  <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">

                    {/* Header */}

                    <div className="flex items-center justify-between px-4 py-3 border-b">

                      <h3 className="font-bold text-gray-800">
                        Notifications
                      </h3>

                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-sky-600 hover:text-sky-700"
                        >
                          Mark all read
                        </button>
                      )}

                    </div>


                    {/* Notification List */}

                    <div className="max-h-96 overflow-y-auto">

                      {notifications.length === 0 ? (

                        <div className="px-4 py-10 text-center text-gray-500">
                          <div className="text-3xl mb-2">
                            🔔
                          </div>

                          <p>
                            No notifications
                          </p>
                        </div>

                      ) : (

                        notifications.map(
                          (notification) => (
                            <div
                              key={
                                notification._id
                              }
                              onClick={() =>
                                markAsRead(
                                  notification
                                )
                              }
                              className={`px-4 py-4 border-b cursor-pointer hover:bg-gray-50 ${
                                !notification.isRead
                                  ? "bg-sky-50"
                                  : "bg-white"
                              }`}
                            >

                              <div className="flex gap-3">

                                {/* Icon */}

                                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                                  🔔
                                </div>


                                {/* Content */}

                                <div className="flex-1">

                                  <div className="flex items-start justify-between gap-2">

                                    <h4 className="font-semibold text-gray-800 text-sm">
                                      {
                                        notification.title
                                      }
                                    </h4>

                                    {!notification.isRead && (
                                      <span className="w-2 h-2 bg-sky-500 rounded-full mt-1 flex-shrink-0" />
                                    )}

                                  </div>

                                  <p className="text-sm text-gray-600 mt-1">
                                    {
                                      notification.message
                                    }
                                  </p>

                                  <p className="text-xs text-gray-400 mt-2">
                                    {new Date(
                                      notification.createdAt
                                    ).toLocaleString()}
                                  </p>

                                </div>

                              </div>

                            </div>
                          )
                        )

                      )}

                    </div>

                  </div>
                )}

              </div>
            )}


            {/* =========================
                DESKTOP MENU
            ========================= */}

            <nav className="flex items-center space-x-6">

              {[
                "disclaimer",
                "contact",
                "terms",
                "privacy",
                "pricing",
              ].map((page, index) => (
                <Link
                  key={index}
                  to={`/${page}`}
                  className="text-gray-700 font-medium hover:text-sky-600 transition-all"
                >
                  {page
                    .replace("-", " ")
                    .toUpperCase()}
                </Link>
              ))}


              {/* Offer Job */}

              <Link
                to="/offer-job"
                className="px-6 py-3 font-semibold rounded-xl shadow-lg text-white relative overflow-hidden text-lg transition-all"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 animate-gradient-x -z-10"></span>

                <span className="relative z-10">
                  Offer Job
                </span>
              </Link>

            </nav>

          </div>


          {/* =========================
              MOBILE
          ========================= */}

          <div className="flex items-center gap-2 md:hidden">

            {/* Notification Bell */}

            {localStorage.getItem("workerId") && (
              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(
                      !showNotifications
                    )
                  }
                  className="relative w-10 h-10 flex items-center justify-center"
                >

                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 21h4"
                    />
                  </svg>

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 right-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}

                </button>


                {/* Mobile Notification */}

                {showNotifications && (
                  <div className="fixed top-20 left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">

                    <div className="flex items-center justify-between px-4 py-3 border-b">

                      <h3 className="font-bold">
                        Notifications
                      </h3>

                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-sky-600"
                        >
                          Mark all read
                        </button>
                      )}

                    </div>

                    <div className="max-h-80 overflow-y-auto">

                      {notifications.length === 0 ? (

                        <div className="p-8 text-center text-gray-500">
                          🔔
                          <p className="mt-2">
                            No notifications
                          </p>
                        </div>

                      ) : (

                        notifications.map(
                          (notification) => (
                            <div
                              key={
                                notification._id
                              }
                              onClick={() =>
                                markAsRead(
                                  notification
                                )
                              }
                              className={`p-4 border-b ${
                                !notification.isRead
                                  ? "bg-sky-50"
                                  : ""
                              }`}
                            >

                              <h4 className="font-semibold text-sm">
                                {
                                  notification.title
                                }
                              </h4>

                              <p className="text-sm text-gray-600 mt-1">
                                {
                                  notification.message
                                }
                              </p>

                            </div>
                          )
                        )

                      )}

                    </div>

                  </div>
                )}

              </div>
            )}


            {/* Offer Job */}

            <Link
              to="/offer-job"
              className="px-4 py-2 font-semibold rounded-xl shadow-lg text-white relative overflow-hidden text-sm"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 animate-gradient-x -z-10"></span>

              <span className="relative z-10">
                Offer Job
              </span>
            </Link>


            {/* Hamburger */}

            <button
              className="focus:outline-none"
              onClick={() =>
                setIsOpen(!isOpen)
              }
            >

              {isOpen ? (

                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>

              ) : (

                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>

              )}

            </button>

          </div>

        </div>
      </div>


      {/* =========================
          MOBILE MENU
      ========================= */}

      {isOpen && (
        <div className="md:hidden bg-sky-400/95 backdrop-blur-md border-t border-sky-300 px-4 pt-2 pb-4 space-y-2 shadow-lg">

          {[
            "disclaimer",
            "contact",
            "terms",
            "privacy",
            "pricing",
          ].map((page, index) => (
            <Link
              key={index}
              to={`/${page}`}
              className="block text-white/90 hover:text-white text-lg"
              onClick={() =>
                setIsOpen(false)
              }
            >
              {page
                .replace("-", " ")
                .toUpperCase()}
            </Link>
          ))}

        </div>
      )}


      {/* =========================
          Tailwind Animation
      ========================= */}

      <style>
        {`
          @keyframes gradient-x {
            0% {
              background-position: 100% 0;
            }

            50% {
              background-position: 0 0;
            }

            100% {
              background-position: 100% 0;
            }
          }

          .animate-gradient-x {
            background-size: 200% 100%;
            animation: gradient-x 3s linear infinite;
          }
        `}
      </style>

    </header>
  );
}