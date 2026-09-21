import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

const NAV_ITEMS = [
  { label: "Disclaimer", path: "/disclaimer" },
  { label: "Contact", path: "/contact" },
  { label: "Terms", path: "/terms" },
  { label: "Privacy", path: "/privacy" },
  { label: "Pricing", path: "/pricing" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [workerId, setWorkerId] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef(null);

  // =========================================================
  // GET WORKER ID
  // =========================================================

  const getWorkerId = () => {
    try {
      return localStorage.getItem("workerId");
    } catch (error) {
      console.error("LocalStorage Error:", error);
      return null;
    }
  };

  // =========================================================
  // FETCH NOTIFICATIONS
  // =========================================================

  const fetchNotifications = async (id = null) => {
    const currentWorkerId = id || getWorkerId();

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

      if (!response.ok) {
        console.error(
          "Notification API Error:",
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

        setNotifications(list);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Notification Fetch Error:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // =========================================================
  // INITIAL CHECK
  // =========================================================

  useEffect(() => {
    const id = getWorkerId();

    if (id) {
      setWorkerId(id);
      fetchNotifications(id);
    }
  }, []);

  // =========================================================
  // WORKER / PAYMENT EVENTS
  // =========================================================

  useEffect(() => {
    const handleWorkerChange = () => {
      const id = getWorkerId();

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

  // =========================================================
  // AUTO REFRESH EVERY 10 SECONDS
  // =========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      const id = getWorkerId();

      if (id !== workerId) {
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

    return () => clearInterval(interval);
  }, [workerId]);

  // =========================================================
  // CLOSE NOTIFICATIONS ON OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
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

  // =========================================================
  // UNREAD COUNT
  // =========================================================

  const unreadCount = notifications.filter(
    (notification) =>
      notification && notification.isRead === false
  ).length;

  // =========================================================
  // TOGGLE NOTIFICATIONS
  // =========================================================

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

  // =========================================================
  // MARK ONE AS READ
  // =========================================================

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

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error(
          "Mark read failed:",
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
      console.error("Mark read error:", error);
    }
  };

  // =========================================================
  // MARK ALL AS READ
  // =========================================================

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

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error(
          "Mark all read failed:",
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
      console.error("Mark all read error:", error);
    }
  };

  // =========================================================
  // NOTIFICATION BUTTON
  // =========================================================

  const NotificationButton = () => (
    <button
      type="button"
      onClick={toggleNotifications}
      aria-label="Notifications"
      aria-expanded={showNotifications}
      className="
        group
        relative
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
        shadow-sm
        backdrop-blur-md
        transition-all
        duration-200
        hover:border-white/30
        hover:bg-white/20
        hover:shadow-lg
        active:scale-95
        sm:h-11
        sm:w-11
      "
    >
      <svg
        className={`
          h-5 w-5
          transition-transform
          duration-200
          group-hover:scale-110
          sm:h-6 sm:w-6
          ${
            unreadCount > 0
              ? "text-yellow-300"
              : "text-white"
          }
        `}
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
        <>
          <span
            className="
              absolute
              -right-1
              -top-1
              h-2.5
              w-2.5
              animate-ping
              rounded-full
              bg-yellow-300
              opacity-75
            "
          />

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
              border-[#172554]
              bg-red-500
              px-1
              text-[9px]
              font-black
              text-white
              shadow-lg
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </>
      )}
    </button>
  );

  // =========================================================
  // NOTIFICATION LIST
  // =========================================================

  const NotificationList = () => (
    <div className="w-full bg-white">

      {/* Notification Header */}
      <div
        className="
          relative
          overflow-hidden
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
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
          "
        />

        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black">
              Job Notifications
            </h3>

            {unreadCount > 0 && (
              <p className="mt-0.5 text-xs font-medium text-blue-100">
                {unreadCount} unread
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="
                border
                border-white/20
                bg-white/10
                px-2.5
                py-1.5
                text-xs
                font-bold
                text-white
                backdrop-blur-sm
                transition
                hover:bg-white/20
              "
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[420px] overflow-y-auto">

        {loadingNotifications &&
        notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-blue-100 bg-blue-50">
              <span className="animate-bounce text-2xl">
                🔔
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-slate-200 bg-slate-50">
              <span className="text-2xl">
                🔔
              </span>
            </div>

            <p className="text-sm font-bold text-slate-700">
              No job notifications
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
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
              className={`
                w-full
                border-b
                border-slate-100
                p-4
                text-left
                transition
                ${
                  !notification.isRead
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "bg-white hover:bg-slate-50"
                }
              `}
            >
              <div className="flex gap-3">

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    flex-shrink-0
                    items-center
                    justify-center
                    border
                    ${
                      !notification.isRead
                        ? "border-blue-200 bg-gradient-to-br from-blue-100 to-purple-100"
                        : "border-slate-200 bg-slate-100"
                    }
                  `}
                >
                  🔔
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800">
                      {notification.title ||
                        "New Job Available"}
                    </h4>

                    {!notification.isRead && (
                      <span
                        className="
                          mt-1
                          h-2.5
                          w-2.5
                          flex-shrink-0
                          animate-pulse
                          rounded-full
                          bg-blue-600
                          shadow-[0_0_8px_rgba(37,99,235,0.7)]
                        "
                      />
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    {notification.message ||
                      "You have a new job notification."}
                  </p>

                  {notification.createdAt && (
                    <p className="mt-2 text-[11px] font-medium text-slate-400">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString("en-IN")}
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

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const handleMobileLinkClick = () => {
    setIsOpen(false);
    setShowNotifications(false);
  };

  // =========================================================
  // HEADER
  // =========================================================

  return (
    <header
      className="
        relative
        z-50
        w-full
        border-b
        border-white/10
        bg-gradient-to-r
        from-[#071a3d]
        via-[#172554]
        to-[#3b176d]
        shadow-[0_8px_30px_rgba(15,23,42,0.28)]
      "
    >

      {/* =====================================================
          DECORATIVE GLOW
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-20
            top-0
            h-32
            w-32
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-20
            bottom-0
            h-40
            w-40
            rounded-full
            bg-purple-400/10
            blur-3xl
          "
        />
      </div>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <div className="relative w-full px-3 sm:px-5 lg:px-8">
        <div
          className="
            flex
            min-h-[70px]
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
            onClick={() => setIsOpen(false)}
            className="
              group
              flex
              flex-shrink-0
              flex-col
              items-start
            "
          >

            {/* Logo Outer Frame */}
            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/30
                bg-gradient-to-br
                from-white
                via-slate-50
                to-blue-50
                p-1
                shadow-[0_8px_30px_rgba(0,0,0,0.22)]
                ring-2
                ring-white/10
                transition-all
                duration-300
                group-hover:-translate-y-0.5
                group-hover:scale-[1.02]
                group-hover:border-cyan-200/80
                group-hover:ring-cyan-300/20
                group-hover:shadow-[0_12px_38px_rgba(34,211,238,0.28)]
              "
            >

              {/* Logo Shine */}
              <span
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  -left-full
                  z-20
                  w-1/2
                  rotate-12
                  bg-gradient-to-r
                  from-transparent
                  via-white/80
                  to-transparent
                  transition-all
                  duration-700
                  group-hover:left-[120%]
                "
              />

              {/* Inner Frame */}
              <div
                className="
                  relative
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-100
                  bg-white
                  px-2
                  py-1.5
                  sm:px-2.5
                  sm:py-2
                "
              >
                <img
                  src="/images/logo.png"
                  alt="JobHir"
                  className="
                    h-8
                    w-auto
                    object-contain
                    sm:h-10
                  "
                />
              </div>
            </div>

            {/* Secure Badge */}
            <span
              className="
                mt-1.5
                ml-1
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-emerald-300/30
                bg-emerald-400/15
                px-2.5
                py-0.5
                text-[8px]
                font-bold
                tracking-wide
                text-emerald-100
                shadow-sm
                backdrop-blur-sm
                sm:text-[9px]
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  animate-pulse
                  rounded-full
                  bg-emerald-300
                  shadow-[0_0_7px_rgba(110,231,183,0.9)]
                "
              />

              100% Secure
            </span>

          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-3
              md:flex
              lg:gap-5
            "
          >

            {/* Notifications */}

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
                      top-[54px]
                      z-[100]
                      w-[360px]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-[0_20px_50px_rgba(15,23,42,0.25)]
                    "
                  >
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}

            <nav className="flex items-center gap-1 lg:gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="
                    rounded-xl
                    border
                    border-transparent
                    px-2.5
                    py-2
                    text-xs
                    font-semibold
                    text-white/85
                    transition-all
                    duration-200
                    hover:border-white/10
                    hover:bg-white/10
                    hover:text-white
                    lg:px-3
                    lg:text-sm
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Post Job */}

            <Link
              to="/offer-job"
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                border
                border-cyan-200/30
                bg-gradient-to-r
                from-cyan-400
                via-blue-500
                to-indigo-500
                px-4
                py-2.5
                text-xs
                font-extrabold
                text-white
                shadow-lg
                shadow-blue-900/20
                ring-1
                ring-white/10
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-cyan-500/20
                lg:px-5
                lg:text-sm
              "
            >
              <span
                className="
                  absolute
                  inset-y-0
                  -left-full
                  w-1/2
                  skew-x-[-20deg]
                  bg-white/20
                  transition-all
                  duration-700
                  group-hover:left-[120%]
                "
              />

              <span className="relative z-10 flex items-center gap-1.5">
                <span className="text-base leading-none">
                  +
                </span>
                Job Post
              </span>
            </Link>

          </div>

          {/* =================================================
              MOBILE ACTIONS
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-1.5
              md:hidden
            "
          >

            {/* Notifications */}

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
                      top-[78px]
                      z-[100]
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-[0_20px_50px_rgba(15,23,42,0.28)]
                    "
                  >
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* Job Post */}

            <Link
              to="/offer-job"
              onClick={() => setIsOpen(false)}
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                border
                border-cyan-200/30
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
                ring-white/10
                transition-all
                duration-200
                hover:from-cyan-300
                hover:to-blue-400
              "
            >
              <span className="relative z-10">
                Job Post
              </span>
            </Link>

            {/* Menu Button */}

            <button
              type="button"
              onClick={() =>
                setIsOpen((previous) => !previous)
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
                shadow-sm
                backdrop-blur-sm
                transition-all
                duration-200
                hover:border-white/30
                hover:bg-white/20
                hover:shadow-lg
                active:scale-95
              "
              aria-label={
                isOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={isOpen}
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
            relative
            border-t
            border-white/10
            bg-gradient-to-b
            from-[#172554]
            to-[#3b176d]
            px-4
            py-4
            shadow-[inset_0_8px_20px_rgba(0,0,0,0.12)]
            md:hidden
          "
        >

          <nav className="space-y-1">

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMobileLinkClick}
                className="
                  block
                  rounded-xl
                  border
                  border-transparent
                  px-3
                  py-2.5
                  text-sm
                  font-semibold
                  text-white/90
                  transition-all
                  duration-200
                  hover:border-white/10
                  hover:bg-white/10
                  hover:text-white
                "
              >
                {item.label}
              </Link>
            ))}

            <Link
              to="/offer-job"
              onClick={handleMobileLinkClick}
              className="
                group
                relative
                mt-3
                block
                overflow-hidden
                rounded-xl
                border
                border-cyan-200/30
                bg-gradient-to-r
                from-cyan-400
                via-blue-500
                to-indigo-500
                px-4
                py-3
                text-center
                text-sm
                font-extrabold
                text-white
                shadow-lg
                shadow-blue-950/20
              "
            >
              <span
                className="
                  absolute
                  inset-y-0
                  -left-full
                  w-1/2
                  skew-x-[-20deg]
                  bg-white/20
                  transition-all
                  duration-700
                  group-hover:left-[120%]
                "
              />

              <span className="relative z-10">
                + Offer Job
              </span>
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}