import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [workerId, setWorkerId] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] =
    useState(false);

  const notificationRef = useRef(null);

  // =====================================================
  // GET WORKER ID
  // =====================================================

  const getWorkerId = () => {
    try {
      return localStorage.getItem("workerId");
    } catch (error) {
      console.error("LocalStorage Error:", error);
      return null;
    }
  };

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async (id = null) => {
    const currentWorkerId = id || getWorkerId();

    console.log(
      "🔔 Fetching notifications for:",
      currentWorkerId
    );

    if (!currentWorkerId) {
      setWorkerId(null);
      setNotifications([]);
      return;
    }

    setWorkerId(currentWorkerId);

    try {
      setLoadingNotifications(true);

      const response = await fetch(
        `${API_URL}/notifications/${currentWorkerId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      const result =
        await response.json().catch(() => null);

      console.log(
        "🔔 Notification Response:",
        result
      );

      if (!response.ok) {
        console.error(
          "❌ Notification API Error:",
          response.status,
          result
        );

        if (
          response.status === 403 ||
          response.status === 404
        ) {
          setNotifications([]);
        }

        return;
      }

      if (result?.success) {
        const list = Array.isArray(
          result.notifications
        )
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
  // INITIAL WORKER CHECK
  // =====================================================

  useEffect(() => {
    const id = getWorkerId();

    console.log(
      "🔑 Header Worker ID:",
      id
    );

    if (id) {
      setWorkerId(id);
      fetchNotifications(id);
    }
  }, []);

  // =====================================================
  // PAYMENT SUCCESS / WORKER CHANGE
  // =====================================================

  useEffect(() => {
    const handleWorkerChange = () => {
      const id = getWorkerId();

      console.log(
        "👷 Worker change event:",
        id
      );

      if (id) {
        setWorkerId(id);
        fetchNotifications(id);
      } else {
        setWorkerId(null);
        setNotifications([]);
        setShowNotifications(false);
      }
    };

    window.addEventListener(
      "workerPaymentSuccess",
      handleWorkerChange
    );

    window.addEventListener(
      "workerRegistered",
      handleWorkerChange
    );

    return () => {
      window.removeEventListener(
        "workerPaymentSuccess",
        handleWorkerChange
      );

      window.removeEventListener(
        "workerRegistered",
        handleWorkerChange
      );
    };
  }, []);

  // =====================================================
  // POLLING
  // EVERY 10 SECONDS
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      const id = getWorkerId();

      console.log(
        "⏱️ Notification refresh:",
        id
      );

      if (!id) {
        setWorkerId(null);
        setNotifications([]);
        return;
      }

      if (id !== workerId) {
        setWorkerId(id);
      }

      fetchNotifications(id);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [workerId]);

  // =====================================================
  // CLOSE WHEN CLICK OUTSIDE
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
    const nextState =
      !showNotifications;

    setShowNotifications(nextState);

    if (nextState) {
      fetchNotifications();
    }
  };

  // =====================================================
  // MARK ONE READ
  // =====================================================

  const markAsRead = async (notification) => {
    if (
      !notification?._id ||
      notification.isRead
    ) {
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
          "❌ Mark read failed:",
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
        "❌ Mark read error:",
        error
      );
    }
  };

  // =====================================================
  // MARK ALL READ
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
          "❌ Mark all read failed:",
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
        "❌ Mark all read error:",
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
      onClick={toggleNotifications}
      aria-label="Notifications"
      aria-expanded={showNotifications}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50 active:scale-95"
    >
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

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white shadow">
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

      <div className="flex items-center justify-between border-b px-4 py-3">

        <div>
          <h3 className="text-sm font-bold text-gray-800">
            Job Notifications
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
            className="text-xs font-semibold text-sky-600"
          >
            Mark all read
          </button>
        )}

      </div>

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
              No job notifications
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-400">
              New jobs matching your work type
              and district will appear here.
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

                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    !notification.isRead
                      ? "bg-sky-100"
                      : "bg-gray-100"
                  }`}
                >
                  🔔
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">

                    <h4 className="text-sm font-semibold text-gray-800">
                      {notification.title ||
                        "New Job Available"}
                    </h4>

                    {!notification.isRead && (
                      <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-sky-500" />
                    )}

                  </div>

                  <p className="mt-1 text-sm leading-5 text-gray-600">
                    {notification.message ||
                      "You have a new job notification."}
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

  // =====================================================
  // HEADER
  // =====================================================

  return (
    <header className="relative z-50 border-b border-gray-100 bg-white shadow-sm">

      <div className="mx-auto max-w-7xl px-3 sm:px-4">

        <div className="flex h-16 items-center justify-between sm:h-20">

          {/* LOGO */}

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

          {/* DESKTOP */}

          <div className="hidden items-center gap-5 md:flex">

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
                  className="font-medium text-gray-700 hover:text-sky-600"
                >
                  {page
                    .replace("-", " ")
                    .toUpperCase()}
                </Link>
              ))}

              <Link
                to="/offer-job"
                className="rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-white shadow-sm hover:bg-sky-600"
              >
                Offer Job
              </Link>

            </nav>
          </div>

          {/* MOBILE */}

          <div className="flex items-center gap-1 md:hidden">

            {workerId && (
              <div
                ref={notificationRef}
                className="relative"
              >
                <NotificationButton />

                {showNotifications && (
                  <div className="fixed left-3 right-3 top-[68px] z-[100] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            <Link
              to="/offer-job"
              className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-600"
            >
              Offer Job
            </Link>

            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  (previous) => !previous
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

      {/* MOBILE MENU */}

      {isOpen && (
        <div className="space-y-3 border-t bg-sky-500 px-4 py-4 md:hidden">

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