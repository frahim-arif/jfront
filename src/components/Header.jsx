import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const [workerId, setWorkerId] = useState(() =>
    localStorage.getItem("workerId")
  );

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  // =====================================================
  // GET WORKER ID
  // =====================================================

  const getWorkerId = () => {
    return localStorage.getItem("workerId");
  };

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    const id = getWorkerId();

    if (!id) {
      setWorkerId(null);
      setNotifications([]);
      return;
    }

    setWorkerId(id);

    try {
      setLoadingNotifications(true);

      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      console.log(
        "Notification Response:",
        result
      );

      if (!response.ok) {
        console.error(
          "Notification API Error:",
          response.status,
          result
        );

        return;
      }

      if (result.success) {
        setNotifications(
          Array.isArray(result.notifications)
            ? result.notifications
            : []
        );
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error(
        "Notification Fetch Error:",
        error
      );
    } finally {
      setLoadingNotifications(false);
    }
  };

  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // DETECT LOCAL STORAGE WORKER ID
  // =====================================================

  useEffect(() => {
    const checkWorker = () => {
      const id = localStorage.getItem("workerId");

      setWorkerId(id);

      if (id) {
        fetchNotifications();
      }
    };

    window.addEventListener(
      "storage",
      checkWorker
    );

    window.addEventListener(
      "workerRegistered",
      checkWorker
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkWorker
      );

      window.removeEventListener(
        "workerRegistered",
        checkWorker
      );
    };
  }, []);

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.isRead
  ).length;

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const markAsRead = async (notification) => {
    if (!notification?._id) return;

    if (notification.isRead) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/${notification._id}/read`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        console.error(
          "Mark as read failed:",
          response.status
        );

        return;
      }

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

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const markAllAsRead = async () => {
    const id = getWorkerId();

    if (!id) return;

    try {
      const response = await fetch(
        `${API_URL}/notifications/worker/${id}/read-all`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        console.error(
          "Mark all read failed:",
          response.status
        );

        return;
      }

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

  // =====================================================
  // NOTIFICATION BUTTON
  // =====================================================

  const NotificationButton = () => (
    <button
      type="button"
      aria-label="Notifications"
      onClick={() =>
        setShowNotifications(
          (prev) => !prev
        )
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
    >
      {/* Bell */}
      <svg
        className="h-6 w-6 text-gray-700"
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

      {/* UNREAD BADGE */}
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}
    </button>
  );

  // =====================================================
  // NOTIFICATION LIST
  // =====================================================

  const NotificationList = () => (
    <div className="w-full bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="font-bold text-gray-800">
            Notifications
          </h3>

          {unreadCount > 0 && (
            <p className="mt-0.5 text-xs text-gray-500">
              {unreadCount} unread notification
              {unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs font-medium text-sky-600 hover:text-sky-700"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="max-h-[400px] overflow-y-auto">
        {loadingNotifications &&
        notifications.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <div className="mb-2 animate-pulse text-3xl">
              🔔
            </div>

            <p className="text-sm">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            <div className="mb-2 text-3xl">
              🔔
            </div>

            <p className="text-sm font-medium">
              No notifications
            </p>

            <p className="mt-1 px-5 text-xs text-gray-400">
              New job opportunities will appear
              here.
            </p>
          </div>
        ) : (
          notifications.map(
            (notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() =>
                  markAsRead(notification)
                }
                className={`w-full border-b p-4 text-left transition hover:bg-gray-50 ${
                  !notification.isRead
                    ? "bg-sky-50"
                    : "bg-white"
                }`}
              >
                <div className="flex gap-3">
                  {/* ICON */}
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                      !notification.isRead
                        ? "bg-sky-100"
                        : "bg-gray-100"
                    }`}
                  >
                    🔔
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {notification.title ||
                          "New Notification"}
                      </h4>

                      {!notification.isRead && (
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-sky-500" />
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-5 text-gray-600">
                      {notification.message ||
                        "You have a new notification."}
                    </p>

                    {notification.createdAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          )
        )}
      </div>
    </div>
  );

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <header className="relative z-50 bg-white shadow-md">
      {/* =================================================
          MAIN HEADER
      ================================================= */}

      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex h-16 items-center justify-between sm:h-20">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="flex flex-shrink-0 items-center gap-2"
          >
            <img
              src="/images/logo.png"
              alt="Jobhir"
              className="h-10 w-auto object-contain sm:h-12"
            />

            <span className="inline-flex whitespace-nowrap rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700 sm:text-xs">
              100% Secure
            </span>
          </Link>

          {/* =================================================
              DESKTOP
          ================================================= */}

          <div className="hidden items-center gap-6 md:flex">

            {/* NOTIFICATION */}

            {workerId && (
              <div className="relative">
                <NotificationButton />

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-[350px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* MENU */}

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
                  className="font-medium text-gray-700 transition hover:text-sky-600"
                >
                  {page
                    .replace("-", " ")
                    .toUpperCase()}
                </Link>
              ))}

              <Link
                to="/offer-job"
                className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-white shadow transition hover:bg-sky-600"
              >
                Offer Job
              </Link>
            </nav>
          </div>

          {/* =================================================
              MOBILE
          ================================================= */}

          <div className="flex items-center gap-1 md:hidden">

            {/* NOTIFICATION */}

            {workerId && (
              <div className="relative">
                <NotificationButton />
              </div>
            )}

            {/* OFFER JOB */}

            <Link
              to="/offer-job"
              className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              Offer Job
            </Link>

            {/* MENU BUTTON */}

            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  (prev) => !prev
                )
              }
              className="flex h-10 w-10 items-center justify-center"
              aria-label="Menu"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
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
                  className="h-6 w-6"
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

      {/* =================================================
          MOBILE NOTIFICATION PANEL
      ================================================= */}

      {showNotifications &&
        workerId && (
          <div className="fixed left-3 right-3 top-16 z-[100] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl md:hidden">
            <NotificationList />
          </div>
        )}

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {isOpen && (
        <div className="space-y-3 bg-sky-500 px-4 py-4 md:hidden">
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
              onClick={() =>
                setIsOpen(false)
              }
              className="block font-medium text-white"
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