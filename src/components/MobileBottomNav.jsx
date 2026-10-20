
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BriefcaseBusiness,
  PlusCircle,
  UserRound,
} from "lucide-react";

const items = [
  {
    key: "home",
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    key: "jobs",
    label: "Jobs",
    href: "/",
    targetId: "jobs",
    icon: BriefcaseBusiness,
  },
  {
    key: "post",
    label: "Post Job",
    href: "/offer-job",
    icon: PlusCircle,
  },
  {
    key: "register",
    label: "Register",
    href: "/worker-register",
    icon: UserRound,
  },
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
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  // Admin pages par bottom navigation hide rahega
  if (pathname.startsWith("/admin")) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setActiveScroll("home");
  };

  const scrollToJobs = () => {
    const element = document.getElementById("jobs");

    if (!element) return false;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActiveScroll("jobs");
    return true;
  };

  // Home page render hone tak Jobs section ko retry karo
  const waitAndScrollToJobs = () => {
    if (scrollTimerRef.current) {
      window.clearTimeout(scrollTimerRef.current);
    }

    let attempts = 0;
    const maxAttempts = 30;

    const tryScroll = () => {
      const element = document.getElementById("jobs");

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setActiveScroll("jobs");
        scrollTimerRef.current = null;
        return;
      }

      attempts += 1;

      if (attempts < maxAttempts) {
        scrollTimerRef.current = window.setTimeout(tryScroll, 150);
      } else {
        scrollTimerRef.current = null;
        console.warn(
          'JobHir: Jobs section nahi mila. App.jsx mein id="jobs" check karein.'
        );
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
      } else {
        const found = scrollToJobs();

        if (!found) {
          waitAndScrollToJobs();
        }
      }

      return;
    }

    if (item.key === "home") {
      setActiveScroll("home");

      if (pathname !== "/") {
        navigate("/");
      } else {
        scrollToTop();
      }

      return;
    }

    setActiveScroll("");

    navigate(item.href);
  };

  const isActive = (item) => {
    if (item.key === "home") {
      return pathname === "/" && activeScroll !== "jobs";
    }

    if (item.key === "jobs") {
      return pathname === "/" && activeScroll === "jobs";
    }

    if (item.key === "post") {
      return pathname === "/offer-job";
    }

    if (item.key === "register") {
      return pathname.startsWith("/worker-register");
    }

    return false;
  };

  // URL hash ke zariye Jobs section khulne par active state update
  useEffect(() => {
    if (pathname === "/" && hash === "#jobs") {
      setActiveScroll("jobs");
    }
  }, [pathname, hash]);

  return (
    <>
      <style>{`
        .jobhir-mobile-nav {
          padding-bottom: env(safe-area-inset-bottom, 0px);
          -webkit-tap-highlight-color: transparent;
        }

        .jobhir-mobile-nav button:active .jobhir-nav-icon {
          transform: scale(0.91);
        }

        .jobhir-nav-icon {
          transition:
            transform 180ms ease,
            background-color 180ms ease,
            color 180ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .jobhir-nav-icon {
            transition: none;
          }
        }
      `}</style>

      {/* Bottom navigation ke liye content spacer */}
      <div
        className="md:hidden"
        style={{ height: "76px" }}
        aria-hidden="true"
      />

      <nav
        className="jobhir-mobile-nav md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white"
        style={{
          borderTop: "2px solid #c8ae6a",
          boxShadow: "0 -6px 24px rgba(7, 28, 25, 0.12)",
          direction: "ltr",
        }}
        aria-label="JobHir mobile navigation"
      >
        <ul className="flex items-stretch">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <li key={item.key} className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleClick(item)}
                  aria-current={active ? "page" : undefined}
                  className="relative flex min-h-[66px] w-full flex-col items-center justify-center gap-1 px-1 pt-2 pb-1.5"
                  style={{
                    color: active ? "#0b302a" : "#7b827d",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {/* Golden active indicator */}
                  <span
                    className="absolute top-0 left-1/2 h-[3px] -translate-x-1/2 transition-all duration-300"
                    style={{
                      width: active ? "30px" : "0px",
                      background: "#c8ae6a",
                    }}
                  />

                  {/* Icon background */}
                  <span
                    className="jobhir-nav-icon flex h-9 w-12 items-center justify-center"
                    style={{
                      background: active ? "#eaf1e9" : "transparent",
                      color: active ? "#0b302a" : "#7b827d",
                    }}
                  >
                    <Icon
                      size={21}
                      strokeWidth={active ? 2.5 : 1.9}
                    />
                  </span>

                  <span
                    className="whitespace-nowrap text-[11px] leading-4"
                    style={{
                      fontWeight: active ? 800 : 600,
                      color: active ? "#0b302a" : "#737b75",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
