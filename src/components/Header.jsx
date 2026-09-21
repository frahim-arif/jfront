import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CheckCheck,
  ChevronRight,
  Menu,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

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
  // WORKER ID
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
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    const id = getWorkerId();

    if (id) {
      setWorkerId(id);
      fetchNotifications(id);
    }
  }, []);

  // =========================================================
  // WORKER EVENTS
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
  // AUTO REFRESH EVERY 10 SEC
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
  // CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
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
    if (!notification?._id || notification.isRead) {
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
        group relative flex h-10 w-10 items-center justify-center
        border border-white/15 bg-white/[0.06] text-white
        transition-all duration-200
        hover:border-cyan-300/30
        hover:bg-white/[0.12]
        active:scale-95
        sm:h-11 sm:w-11
      "
    >
      <Bell
        size={20}
        strokeWidth={2}
        className={`
          transition-all duration-200
          group-hover:scale-110
          ${
            unreadCount > 0
              ? "fill-yellow-300 text-yellow-300"
              : "text-white/90"
          }
        `}
      />

      {unreadCount > 0 && (
        <>
          <span
            className="
              absolute -right-1 -top-1 h-2.5 w-2.5
              animate-ping bg-yellow-300 opacity-70
            "
          />

          <span
            className="
              absolute -right-2 -top-2 flex min-h-[19px]
              min-w-[19px] items-center justify-center
              border-2 border-[#101d43]
              bg-red-500 px-1 text-[9px] font-black
              leading-none text-white shadow-lg
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
          relative overflow-hidden
          border-b border-slate-200
          bg-gradient-to-r
          from-[#0f2b63]
          via-[#193d87]
          to-[#402080]
          px-4 py-3.5
        "
      >
        <div
          className="
            pointer-events-none absolute
            -right-10 -top-10 h-24 w-24
            bg-cyan-400/10 blur-2xl
          "
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-8 w-8 items-center justify-center
                border border-white/15 bg-white/10
              "
            >
              <Bell size={16} className="text-cyan-200" />
            </div>

            <div>
              <h3 className="text-sm font-black text-white">
                Job Notifications
              </h3>

              {unreadCount > 0 ? (
                <p className="mt-0.5 text-[11px] font-medium text-blue-100">
                  {unreadCount} unread notification
                  {unreadCount > 1 ? "s" : ""}
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] text-blue-100/70">
                  You're all caught up
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="
                inline-flex items-center gap-1.5
                border border-white/15
                bg-white/10 px-2.5 py-1.5
                text-[10px] font-bold text-white
                transition hover:bg-white/20
              "
            >
              <CheckCheck size={13} />
              Mark all
            </button>
          )}
        </div>
      </div>

      {/* Notification Body */}
      <div className="max-h-[420px] overflow-y-auto">
        {loadingNotifications && notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div
              className="
                mx-auto mb-4 flex h-12 w-12
                items-center justify-center
                border border-blue-100 bg-blue-50
              "
            >
              <Bell
                size={22}
                className="animate-pulse text-blue-600"
              />
            </div>

            <p className="text-sm font-semibold text-slate-600">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div
              className="
                mx-auto mb-4 flex h-12 w-12
                items-center justify-center
                border border-slate-200
                bg-slate-50
              "
            >
              <Sparkles
                size={21}
                className="text-slate-400"
              />
            </div>

            <p className="text-sm font-bold text-slate-700">
              No job notifications
            </p>

            <p className="mx-auto mt-1 max-w-[260px] text-xs leading-5 text-slate-400">
              New jobs matching your work type and district
              will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <button
              key={notification._id}
              type="button"
              onClick={() => markAsRead(notification)}
              className={`
                group w-full border-b border-slate-100
                p-4 text-left transition-all duration-200
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
                    flex h-10 w-10 flex-shrink-0
                    items-center justify-center border
                    ${
                      !notification.isRead
                        ? "border-blue-200 bg-blue-100"
                        : "border-slate-200 bg-slate-100"
                    }
                  `}
                >
                  <BriefcaseBusiness
                    size={18}
                    className={
                      !notification.isRead
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  />
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
                          mt-1 h-2.5 w-2.5 flex-shrink-0
                          animate-pulse bg-blue-600
                        "
                      />
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
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

                <ChevronRight
                  size={15}
                  className="
                    mt-1 flex-shrink-0 text-slate-300
                    transition group-hover:translate-x-0.5
                    group-hover:text-blue-500
                  "
                />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  // =========================================================
  // MOBILE LINK
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
        relative z-50 w-full
        border-b border-white/10
        bg-gradient-to-r
        from-[#071631]
        via-[#101f4a]
        to-[#25104f]
        shadow-[0_10px_35px_rgba(2,6,23,0.28)]
      "
    >
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -left-24 -top-24
            h-48 w-48 bg-cyan-400/10
            blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-28 right-10
            h-52 w-52 bg-purple-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute inset-x-0 bottom-0 h-px
            bg-gradient-to-r
            from-transparent via-cyan-300/30 to-transparent
          "
        />
      </div>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <div className="relative w-full px-3 sm:px-5 lg:px-8">
        <div
          className="
            flex min-h-[70px] items-center
            justify-between gap-3
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
    group relative flex flex-shrink-0
    items-center
  "
>
  {/* Outer Glow */}
  <span
    className="
      pointer-events-none absolute
      -inset-2 rounded-2xl
      bg-cyan-400/10
      opacity-0 blur-xl
      transition-all duration-500
      group-hover:opacity-100
      group-hover:bg-cyan-300/20
    "
  />

  {/* Logo Frame */}
  <div
    className="
      relative z-10
      flex items-center justify-center
      rounded-2xl
      border border-white/20
      bg-white/[0.06]
      px-2.5 py-1.5
      shadow-[0_8px_25px_rgba(0,0,0,0.22)]
      backdrop-blur-md
      transition-all duration-300

      group-hover:-translate-y-0.5
      group-hover:border-cyan-300/40
      group-hover:bg-white/[0.09]
      group-hover:shadow-[0_12px_35px_rgba(34,211,238,0.20)]

      sm:px-3 sm:py-2
    "
  >
    {/* Shine */}
    <span
      className="
        pointer-events-none
        absolute inset-y-0
        -left-full z-20
        w-1/2
        skew-x-[-20deg]
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        transition-all duration-700
        group-hover:left-[125%]
      "
    />

    {/* Logo */}
    <img
      src="/images/logo.png"
      alt="JobHir"
      className="
        relative z-10
        h-9 w-auto
        object-contain
        drop-shadow-[0_5px_12px_rgba(0,0,0,0.35)]
        transition-all duration-300
        group-hover:scale-[1.04]
        group-hover:drop-shadow-[0_6px_18px_rgba(34,211,238,0.30)]
        sm:h-11
      "
    />
  </div>

  {/* Secure Badge */}
  <span
    className="
      absolute
      -bottom-2
      left-1/2
      z-30
      flex
      -translate-x-1/2
      items-center
      gap-1

      whitespace-nowrap
      rounded-full

      border border-emerald-300/30
      bg-[#0b2440]/95

      px-2.5 py-0.5

      text-[7px]
      font-extrabold
      uppercase
      tracking-[0.1em]
      text-emerald-200

      shadow-[0_4px_12px_rgba(0,0,0,0.25)]
      backdrop-blur-md

      transition-all duration-300

      group-hover:border-emerald-200/50
      group-hover:bg-emerald-500/15
      group-hover:text-emerald-100

      sm:text-[8px]
    "
  >
    <ShieldCheck
      size={9}
      strokeWidth={2.5}
    />

    Secure
  </span>
</Link>
          {/* =================================================
              DESKTOP
          ================================================= */}

          <div className="hidden items-center gap-3 md:flex lg:gap-5">
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
                      absolute right-0 top-[56px]
                      z-[100] w-[370px]
                      overflow-hidden
                      border border-slate-200
                      bg-white
                      shadow-[0_24px_60px_rgba(15,23,42,0.28)]
                    "
                  >
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <nav
              className="
                flex items-center
                border-l border-white/10
                pl-3 lg:pl-4
              "
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="
                    relative px-2.5 py-2
                    text-xs font-semibold
                    text-white/75
                    transition-all duration-200
                    hover:text-white
                    lg:px-3 lg:text-sm
                  "
                >
                  {item.label}

                  <span
                    className="
                      absolute bottom-0 left-1/2
                      h-px w-0 -translate-x-1/2
                      bg-cyan-300
                      transition-all duration-300
                      group-hover:w-1/2
                    "
                  />
                </Link>
              ))}
            </nav>

            {/* Job Post */}
            <Link
              to="/offer-job"
              className="
                group relative overflow-hidden
                border border-cyan-200/25
                bg-gradient-to-r
                from-cyan-400
                via-blue-500
                to-indigo-500
                px-4 py-2.5
                text-xs font-black
                text-white
                shadow-[0_8px_22px_rgba(37,99,235,0.28)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_12px_30px_rgba(34,211,238,0.28)]
                lg:px-5 lg:text-sm
              "
            >
              <span
                className="
                  absolute inset-y-0
                  -left-full w-1/2
                  skew-x-[-20deg]
                  bg-white/25
                  transition-all duration-700
                  group-hover:left-[125%]
                "
              />

              <span
                className="
                  relative z-10
                  flex items-center gap-1.5
                "
              >
                <Plus size={16} strokeWidth={3} />
                Job Post
              </span>
            </Link>
          </div>

          {/* =================================================
              MOBILE ACTIONS
          ================================================= */}

          <div
            className="
              flex items-center gap-1.5
              md:hidden
            "
          >
            {/* Mobile Notifications */}
            {workerId && (
              <div
                ref={notificationRef}
                className="relative"
              >
                <NotificationButton />

                {showNotifications && (
                  <div
                    className="
                      fixed left-3 right-3 top-[78px]
                      z-[100]
                      overflow-hidden
                      border border-slate-200
                      bg-white
                      shadow-[0_24px_60px_rgba(15,23,42,0.3)]
                    "
                  >
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* Mobile Job Post */}
            <Link
              to="/offer-job"
              onClick={() => setIsOpen(false)}
              className="
                flex items-center gap-1
                border border-cyan-200/25
                bg-gradient-to-r
                from-cyan-400 to-blue-500
                px-3 py-2
                text-[11px] font-black
                text-white
                shadow-md
                transition-all
                active:scale-95
              "
            >
              <Plus size={14} strokeWidth={3} />
              Job Post
            </Link>

            {/* Menu */}
            <button
              type="button"
              onClick={() =>
                setIsOpen((previous) => !previous)
              }
              className="
                flex h-10 w-10
                items-center justify-center
                border border-white/15
                bg-white/[0.06]
                text-white
                transition-all duration-200
                hover:border-white/25
                hover:bg-white/[0.12]
                active:scale-95
              "
              aria-label={
                isOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
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
            relative border-t border-white/10
            bg-[#0d1d42]/98
            px-4 py-4
            shadow-[inset_0_8px_20px_rgba(0,0,0,0.12)]
            md:hidden
          "
        >
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMobileLinkClick}
                className="
                  group flex items-center
                  justify-between
                  border-b border-white/[0.06]
                  px-2 py-3
                  text-sm font-semibold
                  text-white/80
                  transition-all duration-200
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <span>{item.label}</span>

                <ChevronRight
                  size={16}
                  className="
                    text-white/25
                    transition-all
                    group-hover:translate-x-1
                    group-hover:text-cyan-300
                  "
                />
              </Link>
            ))}

            {/* Mobile Offer Job */}
            <Link
              to="/offer-job"
              onClick={handleMobileLinkClick}
              className="
                group relative mt-4
                flex items-center
                justify-center gap-2
                overflow-hidden
                border border-cyan-200/25
                bg-gradient-to-r
                from-cyan-400
                via-blue-500
                to-indigo-500
                px-4 py-3
                text-sm font-black
                text-white
                shadow-[0_10px_25px_rgba(37,99,235,0.25)]
              "
            >
              <span
                className="
                  absolute inset-y-0
                  -left-full w-1/2
                  skew-x-[-20deg]
                  bg-white/20
                  transition-all duration-700
                  group-hover:left-[125%]
                "
              />

              <BriefcaseBusiness
                size={17}
                className="relative z-10"
              />

              <span className="relative z-10">
                Offer a Job
              </span>

              <ChevronRight
                size={16}
                className="relative z-10"
              />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}