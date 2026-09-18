import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_URL = "https://jbackend-h963.onrender.com";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Disclaimer", path: "/disclaimer" },
  { label: "Contact", path: "/contact" },
  { label: "Terms", path: "/terms" },
  { label: "Privacy", path: "/privacy" },
  { label: "Pricing", path: "/pricing" },
];

export default function Header() {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [workerId, setWorkerId] = useState(null);

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

  const fetchNotifications = async (id) => {
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

      const result = await response
        .json()
        .catch(() => null);

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
  // INITIAL WORKER CHECK
  // =====================================================

  useEffect(() => {
    const id = getWorkerId();

    if (id) {
      setWorkerId(id);
      fetchNotifications(id);
    } else {
      setWorkerId(null);
      setNotifications([]);
    }
  }, []);

  // =====================================================
  // PAYMENT / REGISTRATION EVENT
  // =====================================================

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

  // =====================================================
  // AUTO REFRESH NOTIFICATIONS
  // =====================================================

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

  // =====================================================
  // CLOSE NOTIFICATION OUTSIDE
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
  // CLOSE MOBILE MENU ON ROUTE CHANGE
  // =====================================================

  useEffect(() => {
    setIsOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

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
          method: "PUT",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response
        .json()
        .catch(() => null);

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
      console.error(
        "Mark read error:",
        error
      );
    }
  };

  // =====================================================
  // MARK ALL READ
  // =====================================================

  const markAllAsRead = async () => {
    const id = getWorkerId();

    if (!id) return;

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

      const result = await response
        .json()
        .catch(() => null);

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
      console.error(
        "Mark all read error:",
        error
      );
    }
  };

  // =====================================================
  // ACTIVE LINK
  // =====================================================

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path;
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
        items-center
        justify-center
        rounded-xl
        border
        border-white/15
        bg-white/10
        text-white
        backdrop-blur-md
        transition
        duration-200
        hover:border-white/25
        hover:bg-white/20
        active:scale-95
        sm:h-11
        sm:w-11
      "
    >
      <svg
        className={`h-5 w-5 ${
          unreadCount > 0
            ? "text-yellow-300"
            : "text-white"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
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
            min-h-[18px]
            min-w-[18px]
            items-center
            justify-center
            rounded-full
            border-2
            border-indigo-800
            bg-red-500
            px-1
            text-[8px]
            font-black
            text-white
            shadow-md
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
          py-3.5
          text-white
        "
      >
        <div>
          <h3 className="text-sm font-black">
            Job Notifications
          </h3>

          <p className="mt-0.5 text-[10px] text-blue-100">
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount > 1
                    ? "s"
                    : ""
                }`
              : "Stay updated with new jobs"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="
              rounded-lg
              border
              border-white/15
              bg-white/10
              px-3
              py-1.5
              text-[10px]
              font-bold
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
          <div className="px-5 py-12 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
              🔔
            </div>

            <p className="text-sm font-semibold text-slate-600">
              Loading notifications...
            </p>

          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
              🔔
            </div>

            <p className="text-sm font-black text-slate-700">
              No job notifications
            </p>

            <p className="mx-auto mt-1 max-w-[260px] text-xs leading-5 text-slate-400">
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
                    ? "bg-blue-50/80 hover:bg-blue-100"
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
                    rounded-xl
                    text-base
                    ${
                      !notification.isRead
                        ? "bg-gradient-to-br from-blue-100 to-purple-100"
                        : "bg-slate-100"
                    }
                  `}
                >
                  🔔
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-2">

                    <h4 className="line-clamp-1 text-sm font-black text-slate-800">
                      {notification.title ||
                        "New Job Available"}
                    </h4>

                    {!notification.isRead && (
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                    )}

                  </div>

                  <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-600">
                    {notification.message ||
                      "You have a new job notification."}
                  </p>

                  {notification.createdAt && (
                    <p className="mt-2 text-[10px] font-medium text-slate-400">
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

  // =====================================================
  // HEADER
  // =====================================================

  return (
    <header
      className="
        relative
        z-[100]
        w-full
        border-b
        border-white/10
        bg-gradient-to-r
        from-[#0f3f91]
        via-[#263bb0]
        to-[#5b21b6]
        shadow-lg
      "
    >

      {/* =================================================
          FULL WIDTH HEADER INNER
      ================================================= */}

      <div className="w-full">

        <div
          className="
            flex
            min-h-[72px]
            w-full
            items-center
            justify-between
            gap-3
            px-3
            sm:min-h-[76px]
            sm:px-5
            lg:px-8
            xl:px-10
            2xl:px-12
          "
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="
              group
              flex
              flex-shrink-0
              items-center
              gap-2.5
            "
          >

            <div
              className="
                flex
                h-[44px]
                items-center
                justify-center
                rounded-xl
                bg-white
                px-2.5
                shadow-lg
                ring-1
                ring-white/20
                transition
                duration-200
                group-hover:shadow-xl
                sm:h-[50px]
                sm:px-3
              "
            >
              <img
                src="/images/logo.png"
                alt="JobHir"
                className="
                  h-7
                  w-auto
                  object-contain
                  sm:h-9
                "
              />
            </div>

            <div className="hidden sm:block">

              <p className="text-base font-black tracking-tight text-white">
                JOBHIR
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-100">
                  100% Secure
                </span>

              </div>

            </div>

          </Link>

          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <div className="hidden items-center gap-3 md:flex">

            {/* NAVIGATION */}

            <nav className="flex items-center gap-0.5 lg:gap-1">

              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative
                    rounded-lg
                    px-2.5
                    py-2
                    text-xs
                    font-bold
                    transition
                    duration-200
                    lg:px-3
                    lg:text-[13px]
                    ${
                      isActive(item.path)
                        ? "bg-white/15 text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {item.label}

                  {isActive(item.path) && (
                    <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-cyan-300" />
                  )}
                </Link>
              ))}

            </nav>

            {/* DIVIDER */}

            <div className="mx-1 h-8 w-px bg-white/15" />

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
                      top-[calc(100%+12px)]
                      z-[200]
                      w-[370px]
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

            {/* POST JOB */}

            <Link
              to="/offer-job"
              className="
                ml-1
                inline-flex
                items-center
                gap-1.5
                rounded-xl
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                px-4
                py-2.5
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-blue-950/20
                ring-1
                ring-white/20
                transition
                duration-200
                hover:-translate-y-0.5
                hover:from-cyan-300
                hover:to-blue-400
                hover:shadow-xl
                lg:px-5
                lg:text-sm
              "
            >
              <span className="text-base leading-none">
                +
              </span>
              Post Job
            </Link>

          </div>

          {/* =================================================
              MOBILE ACTIONS
          ================================================= */}

          <div className="flex items-center gap-1.5 md:hidden">

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
                      top-[80px]
                      z-[200]
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

            {/* POST JOB */}

            <Link
              to="/offer-job"
              className="
                inline-flex
                h-10
                items-center
                rounded-xl
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                px-3
                text-[10px]
                font-black
                text-white
                shadow-md
                ring-1
                ring-white/20
              "
            >
              + Job
            </Link>

            {/* MENU */}

            <button
              type="button"
              onClick={() =>
                setIsOpen(
                  (previous) =>
                    !previous
                )
              }
              aria-label="Open menu"
              aria-expanded={isOpen}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/15
                bg-white/10
                text-white
                backdrop-blur
                transition
                hover:bg-white/20
                active:scale-95
              "
            >
              {isOpen ? (
                <svg
                  className="h-5 w-5"
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
                  className="h-5 w-5"
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
            from-[#172f91]
            to-[#4c1d95]
            px-3
            py-3
            shadow-2xl
            md:hidden
          "
        >

          <div className="grid gap-1">

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() =>
                  setIsOpen(false)
                }
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-bold
                  transition
                  ${
                    isActive(item.path)
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span>{item.label}</span>

                <span className="text-white/40">
                  →
                </span>
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
                flex
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                px-4
                py-3
                text-sm
                font-black
                text-white
                shadow-lg
              "
            >
              + Post a Job
            </Link>

          </div>

        </div>
      )}

    </header>
  );
}