
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
        setNotifications(
          Array.isArray(result.notifications)
            ? result.notifications
            : []
        );
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
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
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
  // MARK ONE NOTIFICATION AS READ
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
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  // =========================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =========================================================

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
  // MOBILE MENU
  // =========================================================

  const handleMobileLinkClick = () => {
    setIsOpen(false);
    setShowNotifications(false);
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
        group relative flex h-10 w-10 shrink-0
        items-center justify-center
        border border-white/15
        bg-white/[0.07] text-white
        transition-all duration-200
        hover:border-emerald-300/50
        hover:bg-white/[0.13]
        active:scale-95
        sm:h-11 sm:w-11
      "
    >
      <Bell
        size={20}
        strokeWidth={2}
        className={`
          transition-transform duration-200
          group-hover:scale-110
          ${
            unreadCount > 0
              ? "fill-amber-300 text-amber-300"
              : "text-white"
          }
        `}
      />

      {unreadCount > 0 && (
        <>
          <span
            className="
              absolute -right-1 -top-1
              h-2.5 w-2.5 animate-ping
              bg-amber-300 opacity-70
            "
          />

          <span
            className="
              absolute -right-2 -top-2
              flex min-h-[19px] min-w-[19px]
              items-center justify-center
              border-2 border-[#0b302a]
              bg-red-500 px-1
              text-[9px] font-black leading-none text-white
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
    <div className="w-full bg-white text-slate-800">
      {/* Notification Header */}
      <div
        className="
          relative overflow-hidden
          border-b border-emerald-900/10
          bg-gradient-to-r
          from-[#071c19] via-[#0b302a] to-[#145044]
          px-4 py-4
        "
      >
        <div
          className="
            pointer-events-none absolute
            -right-10 -top-10 h-24 w-24
            bg-amber-300/10 blur-2xl
          "
        />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                border border-amber-300/25 bg-white/10
              "
            >
              <Bell size={17} className="text-amber-300" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-black text-white">
                Job Notifications
              </h3>

              {unreadCount > 0 ? (
                <p className="mt-0.5 text-[11px] font-medium text-emerald-100">
                  {unreadCount} unread notification
                  {unreadCount > 1 ? "s" : ""}
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] text-emerald-100/75">
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
                inline-flex shrink-0 items-center gap-1.5
                border border-white/20
                bg-white/10 px-2.5 py-2
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
      <div className="max-h-[min(420px,65vh)] overflow-y-auto">
        {loadingNotifications && notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div
              className="
                mx-auto mb-4 flex h-12 w-12 items-center justify-center
                border border-emerald-100 bg-emerald-50
              "
            >
              <Bell
                size={22}
                className="animate-pulse text-emerald-700"
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
                mx-auto mb-4 flex h-12 w-12 items-center justify-center
                border border-slate-200 bg-slate-50
              "
            >
              <Sparkles size={21} className="text-emerald-600" />
            </div>

            <p className="text-sm font-bold text-slate-700">
              No job notifications
            </p>

            <p className="mx-auto mt-1 max-w-[260px] text-xs leading-5 text-slate-400">
              New jobs matching your work type and district will appear here.
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
                p-4 text-left transition-colors duration-200
                ${
                  !notification.isRead
                    ? "bg-emerald-50/80 hover:bg-emerald-100/70"
                    : "bg-white hover:bg-slate-50"
                }
              `}
            >
              <div className="flex gap-3">
                <div
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center border
                    ${
                      !notification.isRead
                        ? "border-emerald-200 bg-emerald-100"
                        : "border-slate-200 bg-slate-100"
                    }
                  `}
                >
                  <BriefcaseBusiness
                    size={18}
                    className={
                      !notification.isRead
                        ? "text-emerald-700"
                        : "text-slate-400"
                    }
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800">
                      {notification.title || "New Job Available"}
                    </h4>

                    {!notification.isRead && (
                      <span
                        className="
                          mt-1 h-2.5 w-2.5 shrink-0
                          bg-emerald-600
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
                    mt-1 shrink-0 text-slate-300
                    transition group-hover:translate-x-0.5
                    group-hover:text-emerald-700
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
  // HEADER
  // =========================================================

  return (
    <header
      className="
        relative z-50 w-full
        border-b border-emerald-900/20
        bg-gradient-to-r
        from-[#071c19] via-[#0b302a] to-[#104438]
        shadow-[0_8px_28px_rgba(7,28,25,0.22)]
      "
    >
      {/* Decorative Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -left-24 -top-24
            h-48 w-48 bg-emerald-300/[0.08] blur-3xl
          "
        />

        <div
          className="
            absolute -bottom-28 right-10
            h-52 w-52 bg-amber-300/[0.07] blur-3xl
          "
        />

        <div
          className="
            absolute inset-x-0 bottom-0 h-px
            bg-gradient-to-r
            from-transparent via-amber-300/50 to-transparent
          "
        />
      </div>

      {/* Main Header */}
      <div className="relative mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8">
        <div className="flex min-h-[68px] items-center justify-between gap-3 sm:min-h-[78px]">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            aria-label="JobHir home"
            className="group relative flex shrink-0 items-center"
          >
            <span
              className="
                pointer-events-none absolute -inset-3
                bg-emerald-300/10 opacity-0 blur-xl
                transition-opacity duration-300
                group-hover:opacity-100
              "
            />

            <span
              className="
                relative flex items-center justify-center
                border border-white/80
                bg-white px-2.5 py-1.5
                shadow-[0_4px_16px_rgba(0,0,0,0.12)]
                transition-all duration-300
                group-hover:-translate-y-0.5
                group-hover:border-amber-300
                sm:px-3 sm:py-2
              "
            >
              <img
                src="/images/logo.png"
                alt="JobHir"
                className="
                  h-9 w-auto max-w-[145px] object-contain
                  transition-transform duration-300
                  group-hover:scale-[1.03]
                  sm:h-11 sm:max-w-[170px]
                "
              />
            </span>

            <span
              className="
                absolute -bottom-2 left-1/2 z-10
                flex -translate-x-1/2 items-center gap-1
                whitespace-nowrap border border-emerald-200
                bg-white px-2 py-0.5
                text-[7px] font-extrabold uppercase
                tracking-[0.12em] text-emerald-800
                shadow-sm sm:text-[8px]
              "
            >
              <ShieldCheck size={9} strokeWidth={2.5} />
              Secure
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 md:flex lg:gap-5">
            {/* Notifications */}
            {workerId && (
              <div ref={notificationRef} className="relative">
                <NotificationButton />

                {showNotifications && (
                  <div
                    className="
                      absolute right-0 top-[calc(100%+12px)]
                      z-[100] w-[min(370px,calc(100vw-32px))]
                      overflow-hidden border border-slate-200
                      bg-white shadow-[0_20px_55px_rgba(7,28,25,0.25)]
                    "
                  >
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* Navigation Links */}
            <nav
              aria-label="Main navigation"
              className="
                flex items-center gap-0.5
                border-l border-white/15 pl-2
                lg:pl-4
              "
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="
                    group relative px-2 py-2.5
                    text-xs font-semibold text-white/80
                    transition-colors duration-200
                    hover:text-amber-200
                    lg:px-3 lg:text-sm
                  "
                >
                  {item.label}

                  <span
                    className="
                      absolute bottom-1 left-1/2 h-px w-0
                      -translate-x-1/2 bg-amber-300
                      transition-all duration-300
                      group-hover:w-1/2
                    "
                  />
                </Link>
              ))}
            </nav>

            {/* Post a Job */}
            <Link
              to="/offer-job"
              className="
                group relative flex shrink-0 items-center gap-2
                overflow-hidden border border-amber-200/70
                bg-gradient-to-r from-[#d8b96c] to-[#f1d995]
                px-3.5 py-2.5
                text-xs font-black text-[#172b20]
                shadow-[0_5px_16px_rgba(0,0,0,0.12)]
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-[0_8px_22px_rgba(216,185,108,0.22)]
                active:translate-y-0
                lg:px-5 lg:text-sm
              "
            >
              <span
                className="
                  absolute inset-y-0 -left-full w-1/2
                  skew-x-[-20deg] bg-white/35
                  transition-all duration-700
                  group-hover:left-[130%]
                "
              />

              <Plus size={16} strokeWidth={3} className="relative z-10" />
              <span className="relative z-10">Post a Job</span>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex shrink-0 items-center gap-1.5 md:hidden">
            {/* Mobile Notifications */}
            {workerId && (
              <div ref={notificationRef} className="relative">
                <NotificationButton />

                {showNotifications && (
                  <div
                    className="
                      fixed left-3 right-3 top-[76px] z-[100]
                      mx-auto max-w-[440px] overflow-hidden
                      border border-slate-200 bg-white
                      shadow-[0_20px_55px_rgba(7,28,25,0.25)]
                    "
                  >
                    <NotificationList />
                  </div>
                )}
              </div>
            )}

            {/* Mobile Post a Job */}
            <Link
              to="/offer-job"
              onClick={handleMobileLinkClick}
              className="
                flex shrink-0 items-center gap-1.5
                border border-amber-200/70
                bg-gradient-to-r from-[#d8b96c] to-[#f1d995]
                px-2.5 py-2.5
                text-[11px] font-black text-[#172b20]
                transition active:scale-95
                min-[380px]:px-3
              "
            >
              <Plus size={15} strokeWidth={3} />
              <span>Post Job</span>
            </Link>

            {/* Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen((previous) => !previous)}
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                border border-white/20 bg-white/[0.07]
                text-white transition-all duration-200
                hover:border-amber-300/50 hover:bg-white/[0.12]
                active:scale-95
              "
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="
            relative border-t border-white/10
            bg-[#09251f] px-4 py-4
            shadow-[inset_0_8px_20px_rgba(0,0,0,0.12)]
            md:hidden
          "
        >
          <nav aria-label="Mobile navigation" className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMobileLinkClick}
                className="
                  group flex items-center justify-between
                  border-b border-white/[0.08]
                  px-2 py-3.5
                  text-sm font-semibold text-white/80
                  transition-colors duration-200
                  hover:bg-white/[0.04] hover:text-amber-200
                "
              >
                <span>{item.label}</span>

                <ChevronRight
                  size={17}
                  className="
                    text-white/35 transition-all
                    group-hover:translate-x-1
                    group-hover:text-amber-300
                  "
                />
              </Link>
            ))}

            {/* Mobile Offer Job */}
            <Link
              to="/offer-job"
              onClick={handleMobileLinkClick}
              className="
                group relative mt-4 flex items-center
                justify-center gap-2 overflow-hidden
                border border-amber-200/70
                bg-gradient-to-r from-[#d8b96c] to-[#f1d995]
                px-4 py-3.5
                text-sm font-black text-[#172b20]
                shadow-[0_8px_20px_rgba(0,0,0,0.12)]
              "
            >
              <span
                className="
                  absolute inset-y-0 -left-full w-1/2
                  skew-x-[-20deg] bg-white/35
                  transition-all duration-700
                  group-hover:left-[130%]
                "
              />

              <BriefcaseBusiness
                size={17}
                className="relative z-10"
              />

              <span className="relative z-10">Offer a Job</span>

              <ChevronRight
                size={16}
                className="relative z-10"
              />
            </Link>

            <p className="px-2 pt-4 text-center text-[10px] font-medium tracking-wide text-emerald-100/50">
              JobHir · Connecting Workers with Opportunities
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
