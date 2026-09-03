
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [workerId, setWorkerId] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef(null);

  // =====================================================
  // GET WORKER ID
  // =====================================================

  const getWorkerId = () => {
    try {
      return localStorage.getItem("workerId");
    } catch (error) {
      console.error("❌ LocalStorage Error:", error);
      return null;
    }
  };

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async (id) => {
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

      const result = await response.json().catch(() => null);

      console.log(
        "🔔 Notification Response:",
        response.status,
        result
      );

      if (!response.ok) {
        console.error(
          "❌ Notification API Error:",
          response.status,
          result
        );

        setNotifications([]);
        return;
      }

      if (result?.success) {
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
  // INITIAL WORKER CHECK
  // =====================================================

  useEffect(() => {
    const id = getWorkerId();

    console.log(
      "🔑 Initial Header Worker ID:",
      id
    );

    if (id) {
      setWorkerId(id);
      fetchNotifications(id);
    } else {
      setWorkerId(null);
      setNotifications([]);
    }
  }, []);

  // =====================================================
  // WORKER / PAYMENT CHANGE
  // =====================================================

  useEffect(() => {
    const handleWorkerChange = () => {
      const id = getWorkerId();

      console.log(
        "👷 Worker/payment change:",
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
  // CHECK WORKER ID + REFRESH EVERY 10 SECONDS
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      const id = getWorkerId();

      console.log(
        "⏱️ Worker ID check:",
        id
      );

      if (id !== workerId) {
        console.log(
          "🔄 Worker ID changed:",
          workerId,
          "→",
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

        return;
      }

      if (id) {
        fetchNotifications(id);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [workerId]);

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
    const nextState = !showNotifications;

    setShowNotifications(nextState);

    if (nextState) {
      const id = getWorkerId();

      if (id) {
        fetchNotifications(id);
      }
    }
  };

  // =====================================================
  // MARK ONE AS READ
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
          method: "PUT",
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
        `${API_URL}/notifications/${id}/read-all`,
        {
          method: "PUT",
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
      className="
        relative
        flex
        h-10
        w-10
        sm:h-11
        sm:w-11
        items-center
        justify-center
        rounded-xl
        border
        border-white/20
        bg-white/10
        text-white
        shadow-sm
        backdrop-blur-sm
        transition-all
        duration-200
        hover:bg-white/20
        hover:shadow-md
        active:scale-95
      "
    >
      <svg
        className={`h-5 w-5 sm:h-6 sm:w-6 ${
          unreadCount > 0
            ? "text-yellow-300"
            : "text-white"
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
        <span
          className="
            absolute
            -right-1
            -top-1
            flex
            min-h-[19px]
            min-w-[19px]
            items-center
            justify-center
            rounded-full
            border-2
            border-indigo-700
            bg-red-500
            px-1
            text-[9px]
            font-bold
            text-white
            shadow
          "
        >
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

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-slate-100
          bg-gradient-to-r
          from-blue-700
          via-indigo-700
          to-purple-700
          px-4
          py-3
          text-white
        "
      >
        <div>
          <h3 className="text-sm font-bold">
            Job Notifications
          </h3>

          {unreadCount > 0 && (
            <p className="mt-0.5 text-xs text-blue-100">
              {unreadCount} unread
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="
              rounded-lg
              bg-white/10
              px-2.5
              py-1.5
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-white/20
            "
          >
            Mark all read
          </button>
        )}
      </div>

      {/* LIST */}

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
              className={`w-full border-b border-slate-100 p-4 text-left transition ${
                !notification.isRead
                  ? "bg-blue-50 hover:bg-blue-100"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                    !notification.isRead
                      ? "bg-gradient-to-br from-blue-100 to-purple-100"
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
                      <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-blue-600" />
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
    <header
      className="
        relative
        z-50
        w-full
        border-b
        border-indigo-900/30
        bg-gradient-to-r
        from-blue-800
        via-indigo-800
        to-purple-800
        shadow-lg
      "
    >
      <div className="w-full px-3 sm:px-5 lg:px-8">
        <div
          className="
            flex
            min-h-[68px]
            items-center
            justify-between
            gap-3
            sm:min-h-[76px]
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="
              flex
              flex-shrink-0
              flex-col
              items-start
            "
          >
            <div
              className="
                rounded-xl
                bg-white/95
                px-2
                py-1
                shadow-md
                ring-1
                ring-white/20
              "
            >
              <img
                src="/images/logo.png"
                alt="Jobhir"
                className="
                  h-8
                  w-auto
                  object-contain
                  sm:h-10
                "
              />
            </div>

            <span
              className="
                mt-1
                inline-flex
                whitespace-nowrap
                rounded-full
                border
                border-emerald-300/30
                bg-emerald-400/15
                px-2
                py-0.5
                text-[8px]
                font-semibold
                leading-tight
                text-emerald-100
                sm:text-[9px]
              "
            >
              100% Secure
            </span>
          </Link>

          {/* =================================================
              DESKTOP
          ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-4
              md:flex
              lg:gap-6
            "
          >
            {/* NOTIFICATION */}

            {workerId && (
              <div
                ref={notificationRef}
                className="relative"
              >
                <NotificationButton />

                {showNotifications && (
                  <div
                    className="
                      absolute
                      right-0
                      top-14
                      z-[100]
                      w-[360px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-2xl
                    "
                  >
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* NAVIGATION */}

            <nav
              className="
                flex
                items-center
                gap-3
                lg:gap-5
              "
            >
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
                  className="
                    rounded-lg
                    px-2
                    py-2
                    text-xs
                    font-semibold
                    text-white/90
                    transition-all
                    duration-200
                    hover:bg-white/10
                    hover:text-white
                    lg:text-sm
                  "
                >
                  {page
                    .replace("-", " ")
                    .toUpperCase()}
                </Link>
              ))}

              {/* OFFER JOB */}

              <Link
                to="/offer-job"
                className="
                  rounded-xl
                  bg-gradient-to-r
                  from-cyan-400
                  to-blue-500
                  px-4
                  py-2.5
                  text-xs
                  font-extrabold
                  text-white
                  shadow-md
                  shadow-blue-950/20
                  ring-1
                  ring-white/20
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:from-cyan-300
                  hover:to-blue-400
                  hover:shadow-lg
                  lg:px-5
                  lg:text-sm
                "
              >
                Job Post
              </Link>
            </nav>
          </div>

          {/* =================================================
              MOBILE
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-1.5
              md:hidden
            "
          >
            {/* NOTIFICATION */}

            {workerId && (
              <div
                ref={notificationRef}
                className="relative"
              >
                <NotificationButton />

                {showNotifications && (
                  <div
                    className="
                      fixed
                      left-3
                      right-3
                      top-[72px]
                      z-[100]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-2xl
                    "
                  >
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* OFFER JOB */}

            <Link
              to="/offer-job"
              className="
                rounded-xl
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                px-3
                py-2
                text-[11px]
                font-extrabold
                text-white
                shadow-md
                ring-1
                ring-white/20
                transition
                hover:from-cyan-300
                hover:to-blue-400
              "
            >
              Offer Job
            </Link>

            {/* MENU BUTTON */}

            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  (previous) =>
                    !previous
                )
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/20
                bg-white/10
                text-white
                backdrop-blur-sm
                transition
                hover:bg-white/20
              "
              aria-label="Menu"
            >
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
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
                  stroke="currentColor"
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

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {isOpen && (
        <div
          className="
            border-t
            border-white/10
            bg-gradient-to-b
            from-indigo-800
            to-purple-900
            px-4
            py-4
            shadow-inner
            md:hidden
          "
        >
          <div className="space-y-1">
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
                className="
                  block
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-semibold
                  text-white/90
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                {page
                  .replace("-", " ")
                  .toUpperCase()}
              </Link>
            ))}

            {/* MOBILE POST JOB */}

            <Link
              to="/offer-job"
              onClick={() =>
                setIsOpen(false)
              }
              className="
                mt-2
                block
                rounded-xl
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                px-4
                py-3
                text-center
                text-sm
                font-extrabold
                text-white
                shadow-lg
              "
            >
              + Offer Job
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
