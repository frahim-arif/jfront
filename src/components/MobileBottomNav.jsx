import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BriefcaseBusiness,
  Plus,
  Users,
  UserRound,
} from "lucide-react";

/* ======================================================
   JOBHIR — FLOATING MOBILE NAV
   Dark green bar, gold active state, raised centre
   "Post Job" button (the one memorable element).
   Same routes and scroll logic as before.
   Save as: src/components/MobileBottomNav.jsx
   ====================================================== */

const GOLD = "#c8ae6a";
const GOLD_LIGHT = "#e2c77e";
const DEEP = "#071c19";

const items = [
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "jobs", label: "Jobs", href: "/", icon: BriefcaseBusiness },
  { key: "post", label: "Post job", href: "/offer-job", icon: Plus, primary: true },
  { key: "workers", label: "Workers", href: "/working-workers", icon: Users },
  { key: "register", label: "Register", href: "/worker-register", icon: UserRound },
];

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, hash } = location;

  const [activeScroll, setActiveScroll] = useState("home");
  const scrollTimerRef = useRef(null);

  // Pending timers cleanup
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // URL hash (#jobs) se Jobs active karo.
  // NOTE: ye hook early return se PEHLE hona chahiye (Rules of Hooks).
  useEffect(() => {
    if (pathname === "/" && hash === "#jobs") setActiveScroll("jobs");
  }, [pathname, hash]);

  // Admin pages par bottom navigation hide rahega
  if (pathname.startsWith("/admin")) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveScroll("home");
  };

  const scrollToJobs = () => {
    const element = document.getElementById("jobs");
    if (!element) return false;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveScroll("jobs");
    return true;
  };

  // Home page render hone tak Jobs section ko retry karo
  const waitAndScrollToJobs = () => {
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);

    let attempts = 0;
    const maxAttempts = 30;

    const tryScroll = () => {
      const element = document.getElementById("jobs");

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveScroll("jobs");
        scrollTimerRef.current = null;
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        scrollTimerRef.current = window.setTimeout(tryScroll, 150);
      } else {
        scrollTimerRef.current = null;
        console.warn('JobHir: Jobs section nahi mila. App.jsx mein id="jobs" check karein.');
      }
    };

    tryScroll();
  };

  const handleClick = (item) => {
    if (item.key === "jobs") {
      setActiveScroll("jobs");
      if (pathname !== "/") {
        navigate("/");
        waitAndScrollToJobs();
      } else if (!scrollToJobs()) {
        waitAndScrollToJobs();
      }
      return;
    }

    if (item.key === "home") {
      setActiveScroll("home");
      if (pathname !== "/") navigate("/");
      else scrollToTop();
      return;
    }

    setActiveScroll("");
    navigate(item.href);
  };

  const isActive = (item) => {
    switch (item.key) {
      case "home":
        return pathname === "/" && activeScroll !== "jobs";
      case "jobs":
        return pathname === "/" && activeScroll === "jobs";
      case "post":
        return pathname === "/offer-job";
      case "workers":
        return pathname.startsWith("/working-workers");
      case "register":
        return pathname.startsWith("/worker-register");
      default:
        return false;
    }
  };

  return (
    <>
      <style>{`
        .jobhir-nav-btn { -webkit-tap-highlight-color: transparent; }
        .jobhir-nav-btn:focus-visible { outline: 2px solid ${GOLD_LIGHT}; outline-offset: 2px; border-radius: 14px; }
        .jobhir-nav-btn:active .jobhir-nav-ico { transform: scale(.9); }
        .jobhir-nav-ico, .jobhir-nav-dot { transition: transform .18s ease, background-color .18s ease, color .18s ease, width .25s ease, opacity .25s ease; }
        @media (prefers-reduced-motion: reduce) {
          .jobhir-nav-ico, .jobhir-nav-dot { transition: none; }
        }
      `}</style>

      {/* Content ko nav ke peeche chhupne se rokne ke liye spacer */}
      <div className="md:hidden" style={{ height: "88px" }} aria-hidden="true" />

      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] px-3"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
          pointerEvents: "none",
          direction: "ltr",
        }}
      >
        <nav
          aria-label="JobHir mobile navigation"
          className="relative mx-auto max-w-md"
          style={{
            pointerEvents: "auto",
            background: `linear-gradient(135deg, ${DEEP}, #0b302a 60%, #123d32)`,
            border: `1px solid ${GOLD}66`,
            borderRadius: "22px",
            boxShadow: "0 14px 34px rgba(7,28,25,.38), 0 2px 0 rgba(255,255,255,.04) inset",
          }}
        >
          <ul className="flex items-end px-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              /* ---------- Raised centre button ---------- */
              if (item.primary) {
                return (
                  <li key={item.key} className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleClick(item)}
                      aria-current={active ? "page" : undefined}
                      className="jobhir-nav-btn flex w-full flex-col items-center pb-2"
                      style={{ background: "transparent", border: "none", cursor: "pointer" }}
                    >
                      <span
                        className="jobhir-nav-ico flex items-center justify-center rounded-full"
                        style={{
                          width: 58,
                          height: 58,
                          marginTop: -26,
                          background: `linear-gradient(145deg, ${GOLD_LIGHT}, ${GOLD})`,
                          color: DEEP,
                          border: "4px solid #faf8ef",
                          boxShadow: active
                            ? `0 0 0 3px ${GOLD}88, 0 10px 22px rgba(7,28,25,.35)`
                            : "0 10px 22px rgba(7,28,25,.35)",
                        }}
                      >
                        <Icon size={28} strokeWidth={2.8} />
                      </span>
                      <span
                        className="mt-1 whitespace-nowrap text-[11px] font-extrabold leading-4"
                        style={{ color: GOLD_LIGHT }}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              }

              /* ---------- Normal items ---------- */
              return (
                <li key={item.key} className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleClick(item)}
                    aria-current={active ? "page" : undefined}
                    className="jobhir-nav-btn relative flex min-h-[64px] w-full flex-col items-center justify-center gap-0.5 pt-1.5 pb-1.5"
                    style={{ background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    <span
                      className="jobhir-nav-ico flex h-8 w-11 items-center justify-center rounded-xl"
                      style={{
                        background: active ? `${GOLD}26` : "transparent",
                        color: active ? GOLD_LIGHT : "rgba(255,255,255,.6)",
                      }}
                    >
                      <Icon size={20} strokeWidth={active ? 2.5 : 1.9} />
                    </span>

                    <span
                      className="whitespace-nowrap text-[11px] leading-4"
                      style={{
                        fontWeight: active ? 800 : 600,
                        color: active ? "#ffffff" : "rgba(255,255,255,.6)",
                      }}
                    >
                      {item.label}
                    </span>

                    {/* active dot */}
                    <span
                      className="jobhir-nav-dot absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full"
                      style={{
                        width: active ? 18 : 0,
                        opacity: active ? 1 : 0,
                        background: GOLD,
                      }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}