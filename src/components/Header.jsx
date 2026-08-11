import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const [workerId, setWorkerId] = useState(
    localStorage.getItem("workerId")
  );

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // =========================
  // Fetch Notifications
  // =========================
  const fetchNotifications = async () => {
    const id = localStorage.getItem("workerId");

    if (!id) {
      setWorkerId(null);
      setNotifications([]);
      return;
    }

    setWorkerId(id);

    try {
      const response = await fetch(
        `${API_URL}/notifications/${id}`
      );

      const result = await response.json();

      console.log("Notification Response:", result);

      if (result.success) {
        setNotifications(result.notifications || []);
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

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // Unread Count
  // =========================
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // =========================
  // Mark One Read
  // =========================
  const markAsRead = async (notification) => {
    try {
      if (notification.isRead) return;

      await fetch(
        `${API_URL}/notifications/${notification._id}/read`,
        {
          method: "PATCH",
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );
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
    const id = localStorage.getItem("workerId");

    if (!id) return;

    try {
      await fetch(
        `${API_URL}/notifications/worker/${id}/read-all`,
        {
          method: "PATCH",
        }
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark All Notification Error:",
        error
      );
    }
  };

  // =========================
  // Notification Button
  // =========================
  const NotificationButton = () => (
    <button
      type="button"
      onClick={() =>
        setShowNotifications((prev) => !prev)
      }
      className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
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
        <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}
    </button>
  );

  // =========================
  // Notification List
  // =========================
  const NotificationList = () => (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-bold text-gray-800">
          Notifications
        </h3>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-sm text-sky-600 hover:text-sky-700"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <div className="text-3xl mb-2">
              🔔
            </div>

            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification._id}
              type="button"
              onClick={() =>
                markAsRead(notification)
              }
              className={`w-full text-left p-4 border-b hover:bg-gray-50 transition ${
                !notification.isRead
                  ? "bg-sky-50"
                  : "bg-white"
              }`}
            >
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  🔔
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {notification.title}
                    </h4>

                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );

  return (
    <header className="bg-white shadow-md relative z-50">

      {/* =========================
          MAIN HEADER
      ========================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4">

        <div className="h-16 sm:h-20 flex items-center justify-between">

          {/* =========================
              LOGO
          ========================= */}
          <Link
  to="/"
  className="flex items-center gap-2 flex-shrink-0"
>
  <img
    src="/logo.png"
    alt="Jobhir"
    className="h-10 sm:h-12 w-auto object-contain"
  />

  <span className="hidden sm:inline-flex items-center rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
    100% Secure
  </span>
</Link>

          {/* =========================
              DESKTOP
          ========================= */}
          <div className="hidden md:flex items-center gap-6">

            {/* Notification */}
            {workerId && (
              <div className="relative">

                <NotificationButton />

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-[340px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    <NotificationList />
                  </div>
                )}

              </div>
            )}

            {/* Menu */}
            <nav className="flex items-center gap-5">

              {[
                "disclaimer",
                "contact",
                "terms",
                "privacy",
                "pricing",
              ].map((page) => (
                <Link
                  key={page}
                  to={`/${page}`}
                  className="text-gray-700 font-medium hover:text-sky-600 transition"
                >
                  {page
                    .replace("-", " ")
                    .toUpperCase()}
                </Link>
              ))}

              <Link
                to="/offer-job"
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow transition"
              >
                Offer Job
              </Link>

            </nav>

          </div>

          {/* =========================
              MOBILE
          ========================= */}
          <div className="flex md:hidden items-center gap-1">

            {/* Notification */}
            {workerId && (
              <div className="relative">
                <NotificationButton />
              </div>
            )}

            {/* Offer Job */}
            <Link
              to="/offer-job"
              className="px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm"
            >
              Offer Job
            </Link>

            {/* Menu */}
            <button
              type="button"
              onClick={() =>
                setIsOpen((prev) => !prev)
              }
              className="w-10 h-10 flex items-center justify-center"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
          MOBILE NOTIFICATION
      ========================= */}
      {showNotifications && workerId && (
        <div className="md:hidden fixed top-16 left-3 right-3 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-[100]">
          <NotificationList />
        </div>
      )}

      {/* =========================
          MOBILE MENU
      ========================= */}
      {isOpen && (
        <div className="md:hidden bg-sky-500 px-4 py-4 space-y-3">

          {[
            "disclaimer",
            "contact",
            "terms",
            "privacy",
            "pricing",
          ].map((page) => (
            <Link
              key={page}
              to={`/${page}`}
              onClick={() => setIsOpen(false)}
              className="block text-white font-medium"
            >
              {page
                .replace("-", " ")
                .toUpperCase()}
            </Link>
          ))}

        </div>
      )}

    </header>
  );
}