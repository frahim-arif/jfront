
import { useEffect, useRef, useState } from "react";
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

  const notificationRef = useRef(null);

  // =====================================================
  // GET WORKER ID
  // =====================================================

  const getWorkerId = () => {
    return localStorage.getItem("workerId");
  };

  // =====================================================
  // LOAD WORKER
  // =====================================================

  const loadWorker = () => {
    const id = getWorkerId();

    console.log("🔑 Header Worker ID:", id);

    setWorkerId(id);

    if (!id) {
      setNotifications([]);
      setShowNotifications(false);
    }

    return id;
  };

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    const id = getWorkerId();

    console.log("🔔 Fetching notifications for:", id);

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
          cache: "no-store",
        }
      );

      const result = await response.json();

      console.log("🔔 Notification Response:", result);

      if (!response.ok) {
        console.error(
          "❌ Notification API Error:",
          response.status,
          result
        );

        return;
      }

      if (result.success) {
        const list = Array.isArray(result.notifications)
          ? result.notifications
          : [];

        console.log(
          "✅ Notifications received:",
          list.length
        );

        setNotifications(list);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error(
        "❌ Notification Fetch Error:",
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
    const id = loadWorker();

    if (id) {
      fetchNotifications();
    }

    const interval = setInterval(() => {
      const currentId = getWorkerId();

      // Detect worker login/register/payment success
      if (currentId !== workerId) {
        console.log(
          "🔄 Worker ID changed:",
          currentId
        );

        setWorkerId(currentId);
      }

      if (currentId) {
        fetchNotifications();
      } else {
        setNotifications([]);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [workerId]);

  // =====================================================
  // WORKER LOGIN / REGISTER EVENT
  // =====================================================

  useEffect(() => {
    const handleWorkerChange = () => {
      console.log(
        "👤 Worker login/register event received"
      );

      const id = loadWorker();

      if (id) {
        fetchNotifications();
      }
    };

    window.addEventListener(
      "workerRegistered",
      handleWorkerChange
    );

    window.addEventListener(
      "workerLoggedIn",
      handleWorkerChange
    );

    return () => {
      window.removeEventListener(
        "workerRegistered",
        handleWorkerChange
      );

      window.removeEventListener(
        "workerLoggedIn",
        handleWorkerChange
      );
    };
  }, []);

  // =====================================================
  // STORAGE EVENT
  // =====================================================

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "workerId") {
        const id = event.newValue;

        console.log(
          "💾 Worker ID changed in storage:",
          id
        );

        setWorkerId(id);

        if (id) {
          fetchNotifications();
        } else {
          setNotifications([]);
          setShowNotifications(false);
        }
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  // =====================================================
  // CLOSE NOTIFICATION WHEN CLICK OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [showNotifications]);

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) =>
      notification &&
      notification.isRead === false
  ).length;

  // =====================================================
  // TOGGLE NOTIFICATIONS
  // =====================================================

  const toggleNotifications = () => {
    const newState = !showNotifications;

    setShowNotifications(newState);

    if (newState) {
      fetchNotifications();
    }
  };

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const markAsRead = async (notification) => {
    if (!notification?._id) {
      return;
    }

    if (notification.isRead) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/${notification._id}/read`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result =
        await response.json().catch(() => null);

      if (!response.ok) {
        console.error(
          "❌ Mark Notification Failed:",
          response.status,
          result
        );

        return;
      }

      setNotifications((previous) =>
        previous.map((item) =>
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
        "❌ Mark Notification Error:",
        error
      );
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const markAllAsRead = async () => {
    const id = getWorkerId();

    if (!id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/worker/${id}/read-all`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result =
        await response.json().catch(() => null);

      if (!response.ok) {
        console.error(
          "❌ Mark All Read Failed:",
          response.status,
          result
        );

        return;
      }

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "❌ Mark All Notification Error:",
        error
      );
    }
  };

  // =====================================================
  // NOTIFICATION BUTTON
  // =====================================================

  const NotificationButton = () => {
    return (
      <button
        type="button"
        onClick={toggleNotifications}
        aria-label="Notifications"
        aria-expanded={showNotifications}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50 active:scale-95"
      >
        {/* Bell */}
        <svg
          className={`h-6 w-6 ${
            unreadCount > 0
              ? "text-sky-600"
              : "text-gray-700"
          }`}
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
          <span className="absolute -right-1 -top-1 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white shadow">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>
    );
  };

  // =====================================================
  // NOTIFICATION LIST
  // =====================================================

  const NotificationList = () => {
    return (
      <div className="w-full bg-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <p className="mt-0.5 text-xs text-gray-500">
                {unreadCount} unread
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification Body */}
        <div className="max-h-[420px] overflow-y-auto">
          {loadingNotifications &&
          notifications.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mb-2 text-3xl">
                🔔
              </div>

              <p className="text-sm text-gray-500">
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mb-2 text-3xl">
                🔔
              </div>

              <p className="text-sm font-semibold text-gray-700">
                No notifications
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                New job opportunities matching
                your work type and location will
                appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() =>
                  markAsRead(notification)
                }
                className={`w-full border-b p-4 text-left transition ${
                  !notification.isRead
                    ? "bg-sky-50 hover:bg-sky-100"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                      !notification.isRead
                        ? "bg-sky-100"
                        : "bg-gray-100"
                    }`}
                  >
                    🔔
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {notification.title ||
                          "New Notification"}
                      </h4>

                      {!notification.isRead && (
                        <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-sky-500" />
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-5 text-gray-600">
                      {notification.message ||
                        "You have a new notification."}
                    </p>

                    {notification.createdAt && (
                      <p className="mt-2 text-[11px] text-gray-400">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <header className="relative z-50 border-b border-gray-100 bg-white shadow-sm">

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
            className="flex flex-shrink-0 flex-col items-start"
          >
            <img
              src="/images/logo.png"
              alt="Jobhir"
              className="h-10 w-auto object-contain sm:h-12"
            />

            <span className="mt-0.5 inline-flex whitespace-nowrap rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[9px] font-semibold leading-tight text-green-700 sm:text-[10px]">
              100% Secure
            </span>
          </Link>

          {/* =================================================
              DESKTOP
          ================================================= */}

          <div className="hidden items-center gap-5 md:flex">

            {/* Notification */}
            {workerId && (
              <div
                ref={notificationRef}
                className="relative"
              >
                <NotificationButton />

                {showNotifications && (
                  <div className="absolute right-0 top-14 z-[100] w-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* Worker Login */}
            {!workerId && (
              <Link
                to="/worker-login"
                className="font-semibold text-gray-700 transition hover:text-sky-600"
              >
                Worker Login
              </Link>
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
                  className="font-medium text-gray-700 transition hover:text-sky-600"
                >
                  {page
                    .replace("-", " ")
                    .toUpperCase()}
                </Link>
              ))}

              <Link
                to="/offer-job"
                className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-600"
              >
                Offer Job
              </Link>
            </nav>
          </div>

          {/* =================================================
              MOBILE
          ================================================= */}

          <div className="flex items-center gap-1 md:hidden">

            {/* Notification */}
            {workerId && (
              <div
                ref={notificationRef}
                className="relative"
              >
                <NotificationButton />

                {/* Mobile Notification Panel */}
                {showNotifications && (
                  <div className="fixed left-3 right-3 top-[68px] z-[100] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* Login */}
            {!workerId && (
              <Link
                to="/worker-login"
                className="rounded-lg px-2 py-2 text-xs font-semibold text-sky-600"
              >
                Login
              </Link>
            )}

            {/* Offer Job */}
            <Link
              to="/offer-job"
              className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-600"
            >
              Offer Job
            </Link>

            {/* Menu */}
            <button
              type="button"
              onClick={() =>
                setIsOpen((previous) => !previous)
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
          MOBILE MENU
      ================================================= */}

      {isOpen && (
        <div className="space-y-3 border-t border-white/10 bg-sky-500 px-4 py-4 md:hidden">

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

          {!workerId && (
            <Link
              to="/worker-login"
              onClick={() =>
                setIsOpen(false)
              }
              className="block font-semibold text-white"
            >
              WORKER LOGIN
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

