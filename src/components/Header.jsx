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
   JOBHIR HEADER — geometric star pattern style
   Save as: src/components/Header.jsx

   THEME: "green" (JobHir brand) ya "blue" (aapke screenshot jaisa).
   Sirf neeche ACTIVE_THEME badlo.
   ====================================================== */

const THEMES = {
  green: {
    from: "#071c19",
    via: "#0b302a",
    to: "#123d32",
    line: "rgba(200,174,106,0.30)", // star lines
    solid: "#071c19", // dropdown / mobile menu base
  },
  blue: {
    from: "#17406a",
    via: "#1d4d7c",
    to: "#17406a",
    line: "rgba(255,255,255,0.18)",
    solid: "#17406a",
  },
};

const ACTIVE_THEME = "green";
const T = THEMES[ACTIVE_THEME];

const GOLD = "#c8ae6a";
const GOLD_LIGHT = "#e2c77e";

// 8-pointed star tile (two squares, one rotated 45deg) + corner dots
const STAR_TILE = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='${T.line}' stroke-width='1'><rect x='17' y='17' width='26' height='26'/><rect x='17' y='17' width='26' height='26' transform='rotate(45 30 30)'/><circle cx='30' cy='30' r='3'/></g><g fill='${T.line}'><circle cx='0' cy='0' r='1.6'/><circle cx='60' cy='0' r='1.6'/><circle cx='0' cy='60' r='1.6'/><circle cx='60' cy='60' r='1.6'/></g></svg>`;
const STAR_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(STAR_TILE)}")`;

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

  // Alag-alag refs (pehle dono jagah ek hi ref tha, desktop par click band ho jata tha)
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

  // CLOSE NOTIFICATION WHEN CLICKING OUTSIDE
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
  // NOTIFICATION BUTTON  (function, component nahi: har render par remount nahi hoga)
  // =========================================================

  const renderNotificationButton = () => (
    <button
      type="button"
      onClick={toggleNotifications}
      aria-label="Notifications"
      aria-expanded={showNotifications}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white transition-all duration-200 hover:border-[#c8ae6a]/60 hover:bg-white/[0.14] active:scale-95 sm:h-11 sm:w-11"
    >
      <Bell
        size={20}
        strokeWidth={2}
        className={`transition-all duration-200 group-hover:scale-110 ${
          unreadCount > 0 ? "fill-yellow-300 text-yellow-300" : "text-white/90"
        }`}
      />

      {unreadCount > 0 && (
        <>
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping rounded-full bg-yellow-300 opacity-70" />
          <span
            className="absolute -right-2 -top-2 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 bg-red-500 px-1 text-[9px] font-black leading-none text-white shadow-lg"
            style={{ borderColor: T.solid }}
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

  const renderNotificationList = () => (
    <div className="w-full bg-white">
      <div
        className="relative overflow-hidden border-b border-slate-200 px-4 py-3.5"
        style={{ background: `linear-gradient(90deg, ${T.from}, ${T.via}, ${T.to})` }}
      >
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10">
              <Bell size={16} style={{ color: GOLD_LIGHT }} />
            </div>

            <div>
              <h3 className="text-sm font-black text-white">Job Notifications</h3>
              {unreadCount > 0 ? (
                <p className="mt-0.5 text-[11px] font-medium text-white/80">
                  {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] text-white/60">You're all caught up</p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-white/20"
            >
              <CheckCheck size={13} />
              Mark all
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loadingNotifications && notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
              <Bell size={22} className="animate-pulse text-emerald-700" />
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
                  ? "bg-amber-50/80 hover:bg-amber-100/70"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border ${
                    !notification.isRead
                      ? "border-amber-200 bg-amber-100"
                      : "border-slate-200 bg-slate-100"
                  }`}
                >
                  <BriefcaseBusiness
                    size={18}
                    className={!notification.isRead ? "text-amber-700" : "text-slate-400"}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-800">
                      {notification.title || "New Job Available"}
                    </h4>
                    {!notification.isRead && (
                      <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-amber-600" />
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
                  className="mt-1 flex-shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-amber-600"
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

  // Gold button style (dark text, kyunki gold par safed text padhna mushkil tha)
  const goldButtonStyle = {
    background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
    color: "#071c19",
  };

  // =========================================================
  // HEADER
  // =========================================================

  return (
    <header
      className="relative z-50 w-full border-b shadow-[0_10px_35px_rgba(2,6,23,0.28)]"
      style={{
        borderColor: `${GOLD}66`,
        backgroundColor: T.via,
        backgroundImage: `${STAR_PATTERN}, linear-gradient(90deg, ${T.from}, ${T.via}, ${T.to})`,
        backgroundSize: "60px 60px, 100% 100%",
      }}
    >
      {/* Gold hairline at the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />

      <div className="relative w-full px-3 sm:px-5 lg:px-8">
        <div className="flex min-h-[72px] items-center justify-between gap-3 sm:min-h-[80px]">
          {/* ================= LOGO (round badge) ================= */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="group relative flex flex-shrink-0 items-center"
            aria-label="JobHir home"
          >
            <span
              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white p-1 transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
              style={{
                border: `2px solid ${GOLD}`,
                boxShadow: "0 6px 18px rgba(0,0,0,.28)",
              }}
            >
              <img
                src="/images/logo.png"
                alt="JobHir"
                className="h-full w-full object-contain"
              />
            </span>

            <span className="absolute -bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-white px-2.5 py-0.5 text-[8px] font-extrabold tracking-wide text-emerald-700 shadow-[0_3px_10px_rgba(15,23,42,0.18)]">
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
                  <div className="absolute right-0 top-[56px] z-[100] w-[370px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
                    {renderNotificationList()}
                  </div>
                )}
              </div>
            )}

            <nav className="flex items-center border-l border-white/15 pl-3 lg:pl-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative px-2.5 py-2 text-xs font-bold transition-colors duration-200 lg:px-3 lg:text-sm"
                  // Inline colour: index.css ka default `a { color }` Tailwind class ko override kar deta tha
                  style={{ color: "rgba(255,255,255,0.92)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = GOLD_LIGHT)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.92)")}
                >
                  {item.label}
                  <span
                    className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-2/3"
                    style={{ background: GOLD }}
                  />
                </Link>
              ))}
            </nav>

            <Link
              to="/offer-job"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black shadow-[0_8px_22px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 lg:px-5 lg:text-sm"
              style={goldButtonStyle}
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
                  <div className="fixed left-3 right-3 top-[82px] z-[100] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
                    {renderNotificationList()}
                  </div>
                )}
              </div>
            )}

            <Link
              to="/offer-job"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-black shadow-md transition-all active:scale-95"
              style={goldButtonStyle}
            >
              <Plus size={14} strokeWidth={3} />
              Job Post
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] text-white transition-all duration-200 hover:bg-white/[0.14] active:scale-95"
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
        <div
          className="relative border-t px-4 py-4 md:hidden"
          style={{ background: T.solid, borderColor: `${GOLD}40` }}
        >
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMobileLinkClick}
                className="group flex items-center justify-between border-b border-white/[0.08] px-2 py-3 text-sm font-semibold transition-all duration-200 hover:bg-white/[0.05]"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                <span>{item.label}</span>
                <ChevronRight
                  size={16}
                  className="text-white/30 transition-all group-hover:translate-x-1 group-hover:text-[#e2c77e]"
                />
              </Link>
            ))}

            <Link
              to="/offer-job"
              onClick={handleMobileLinkClick}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black shadow-lg"
              style={goldButtonStyle}
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