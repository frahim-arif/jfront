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

/* ======================================================
   JOBHIR HEADER — white, clean
   Save as: src/components/Header.jsx
   ====================================================== */

const API_URL = "https://jbackend-h963.onrender.com";

const NAV_ITEMS = [
  { label: "Disclaimer", path: "/disclaimer" },
  { label: "Contact", path: "/contact" },
  { label: "Terms", path: "/terms" },
  { label: "Privacy", path: "/privacy" },
  { label: "Pricing", path: "/pricing" },
];

// Inline colours: a global `a { color }` rule in index.css would override Tailwind classes
const NAV_COLOR = "#334155"; // slate-700
const NAV_HOVER = "#4f46e5"; // indigo-600

// Sky blue CTA
const ctaStyle = {
  background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
  color: "#082f49",
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [workerId, setWorkerId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Separate refs for desktop and mobile so outside-click works on both
  const desktopNotifRef = useRef(null);
  const mobileNotifRef = useRef(null);

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

      const response = await fetch(`${API_URL}/notifications/${currentWorkerId}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Notification API Error:", response.status, result);
        setNotifications([]);
        return;
      }

      if (result?.success) {
        setNotifications(Array.isArray(result.notifications) ? result.notifications : []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Notification Fetch Error:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    const id = getWorkerId();
    if (id) {
      setWorkerId(id);
      fetchNotifications(id);
    }
  }, []);

  // WORKER EVENTS
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

    window.addEventListener("workerPaymentSuccess", handleWorkerChange);
    window.addEventListener("workerRegistered", handleWorkerChange);

    return () => {
      window.removeEventListener("workerPaymentSuccess", handleWorkerChange);
      window.removeEventListener("workerRegistered", handleWorkerChange);
    };
  }, []);

  // AUTO REFRESH EVERY 10 SEC
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

      if (id) fetchNotifications(id);
    }, 10000);

    return () => clearInterval(interval);
  }, [workerId]);

  // CLOSE NOTIFICATIONS WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const inside = [desktopNotifRef, mobileNotifRef].some((ref) =>
        ref.current?.contains(event.target)
      );
      if (!inside) setShowNotifications(false);
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

  const unreadCount = notifications.filter((n) => n && n.isRead === false).length;

  const toggleNotifications = () => {
    const next = !showNotifications;
    setShowNotifications(next);
    if (next) {
      const id = getWorkerId();
      if (id) fetchNotifications(id);
    }
  };

  // MARK ONE AS READ
  const markAsRead = async (notification) => {
    if (!notification?._id || notification.isRead) return;

    try {
      const response = await fetch(`${API_URL}/notifications/${notification._id}/read`, {
        method: "PUT",
        headers: { Accept: "application/json" },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Mark read failed:", response.status, result);
        return;
      }

      setNotifications((prev) =>
        prev.map((item) => (item._id === notification._id ? { ...item, isRead: true } : item))
      );
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  // MARK ALL AS READ
  const markAllAsRead = async () => {
    const id = getWorkerId();
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read-all`, {
        method: "PUT",
        headers: { Accept: "application/json" },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        console.error("Mark all read failed:", response.status, result);
        return;
      }

      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  // =========================================================
  // NOTIFICATION BUTTON
  // (a render function, not a component, so it doesn't remount on every render)
  // =========================================================

  const renderNotificationButton = () => (
    <button
      type="button"
      onClick={toggleNotifications}
      aria-label="Notifications"
      aria-expanded={showNotifications}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 active:scale-95 sm:h-11 sm:w-11"
    >
      <Bell
        size={20}
        strokeWidth={2}
        className={`transition-all duration-200 group-hover:scale-110 ${
          unreadCount > 0 ? "fill-amber-400 text-amber-500" : "text-slate-600"
        }`}
      />

      {unreadCount > 0 && (
        <>
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping rounded-full bg-red-400 opacity-70" />
          <span className="absolute -right-2 -top-2 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-black leading-none text-white shadow-md">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </>
      )}
    </button>
  );

  // =========================================================
  // NOTIFICATION LIST
  // =========================================================

  const renderNotificationList = () => (
    <div className="w-full bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
            <Bell size={16} className="text-indigo-600" />
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-800">Job Notifications</h3>
            {unreadCount > 0 ? (
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] text-slate-400">You're all caught up</p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <CheckCheck size={13} />
            Mark all
          </button>
        )}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loadingNotifications && notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50">
              <Bell size={22} className="animate-pulse text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
              <Sparkles size={21} className="text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-700">No job notifications</p>
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
              className={`group w-full border-b border-slate-100 p-4 text-left transition-all duration-200 ${
                !notification.isRead
                  ? "bg-indigo-50/70 hover:bg-indigo-100/60"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${
                    !notification.isRead
                      ? "border-indigo-200 bg-indigo-100"
                      : "border-slate-200 bg-slate-100"
                  }`}
                >
                  <BriefcaseBusiness
                    size={18}
                    className={!notification.isRead ? "text-indigo-700" : "text-slate-400"}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800">
                      {notification.title || "New Job Available"}
                    </h4>
                    {!notification.isRead && (
                      <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-indigo-600" />
                    )}
                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    {notification.message || "You have a new job notification."}
                  </p>

                  {notification.createdAt && (
                    <p className="mt-2 text-[10px] font-medium text-slate-400">
                      {new Date(notification.createdAt).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                <ChevronRight
                  size={15}
                  className="mt-1 flex-shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600"
                />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  const handleMobileLinkClick = () => {
    setIsOpen(false);
    setShowNotifications(false);
  };

  // =========================================================
  // HEADER
  // =========================================================

  return (
    <header className="relative z-50 w-full border-b border-slate-200 bg-white shadow-[0_1px_8px_rgba(15,23,42,0.06)]">
      <div className="relative w-full px-3 sm:px-5 lg:px-8">
        <div className="flex min-h-[68px] items-center justify-between gap-3 sm:min-h-[76px]">
          {/* ================= LOGO ================= */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="group relative flex flex-shrink-0 items-center"
            aria-label="JobHir home"
          >
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-1 shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
              <img
                src="/images/logo.png"
                alt="JobHir"
                className="h-full w-full object-contain"
              />
            </span>

            <span className="absolute -bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-white px-2.5 py-0.5 text-[8px] font-extrabold tracking-wide text-emerald-700 shadow-[0_3px_10px_rgba(15,23,42,0.12)]">
              <ShieldCheck size={9} strokeWidth={2.5} />
              Secure
            </span>
          </Link>

          {/* ================= DESKTOP ================= */}
          <div className="hidden items-center gap-3 md:flex lg:gap-5">
            {workerId && (
              <div ref={desktopNotifRef} className="relative">
                {renderNotificationButton()}

                {showNotifications && (
                  <div className="absolute right-0 top-[56px] z-[100] w-[370px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                    {renderNotificationList()}
                  </div>
                )}
              </div>
            )}

            <nav className="flex items-center border-l border-slate-200 pl-3 lg:pl-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative px-2.5 py-2 text-xs font-bold transition-colors duration-200 lg:px-3 lg:text-sm"
                  style={{ color: NAV_COLOR }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = NAV_HOVER)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = NAV_COLOR)}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-indigo-500 transition-all duration-300 group-hover:w-2/3" />
                </Link>
              ))}
            </nav>

            <Link
              to="/offer-job"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black shadow-[0_6px_16px_rgba(14,165,233,0.30)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 lg:px-5 lg:text-sm"
              style={ctaStyle}
            >
              <Plus size={16} strokeWidth={3} />
              Job Post
            </Link>
          </div>

          {/* ================= MOBILE ACTIONS ================= */}
          <div className="flex items-center gap-1.5 md:hidden">
            {workerId && (
              <div ref={mobileNotifRef} className="relative">
                {renderNotificationButton()}

                {showNotifications && (
                  <div className="fixed left-3 right-3 top-[78px] z-[100] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
                    {renderNotificationList()}
                  </div>
                )}
              </div>
            )}

            <Link
              to="/offer-job"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-black shadow-md transition-all active:scale-95"
              style={ctaStyle}
            >
              <Plus size={14} strokeWidth={3} />
              Job Post
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:bg-slate-50 active:scale-95"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="relative border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMobileLinkClick}
                className="group flex items-center justify-between border-b border-slate-100 px-2 py-3 text-sm font-semibold transition-all duration-200 hover:bg-slate-50"
                style={{ color: NAV_COLOR }}
              >
                <span>{item.label}</span>
                <ChevronRight
                  size={16}
                  className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-indigo-500"
                />
              </Link>
            ))}

            <Link
              to="/offer-job"
              onClick={handleMobileLinkClick}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black shadow-lg"
              style={ctaStyle}
            >
              <BriefcaseBusiness size={17} />
              Offer a Job
              <ChevronRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}