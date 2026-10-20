"use client";

import React from "react";
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
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Admin pages par bottom navigation hide rahega
  if (pathname.startsWith("/admin")) return null;

  const scrollToJobs = () => {
    const element = document.getElementById("jobs");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleClick = (item) => {
    if (item.targetId) {
      if (pathname !== "/") {
        navigate("/");
        window.setTimeout(scrollToJobs, 350);
      } else {
        scrollToJobs();
      }
      return;
    }

    navigate(item.href);

    if (item.key === "home" && pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const isActive = (item) => {
    if (item.key === "home") return pathname === "/";
    if (item.key === "post") return pathname === "/offer-job";
    if (item.key === "register") {
      return pathname.startsWith("/worker-register");
    }
    return false;
  };

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
