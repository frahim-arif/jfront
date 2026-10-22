import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  IndianRupee,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

/* ======================================================
   JOBHIR — STATS SECTION (self-contained)
   Save as: src/components/JobStatsSection.jsx
   Ab JobStatsSection.css ki zarurat nahi (is file me import nahi hai).
   Props pehle jaise hi: totalJobs, availableJobsCount, is24x7
   ====================================================== */

const GOLD = "#c8ae6a";
const GOLD_LIGHT = "#e2c77e";
const DEEP = "#071c19";

const STAR = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='rgba(200,174,106,0.18)' stroke-width='1'><rect x='17' y='17' width='26' height='26'/><rect x='17' y='17' width='26' height='26' transform='rotate(45 30 30)'/><circle cx='30' cy='30' r='3'/></g></svg>`
)}")`;

/* ---------- section screen par aaye tabhi animation shuru ---------- */
function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen];
}

function AnimatedNumber({ value = 0, start = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return undefined;

    const target = Math.max(0, Number(value) || 0);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce || target === 0) {
      setCount(target);
      return undefined;
    }

    const duration = 1400;
    let frameId;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(target * eased));
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, start]);

  return <>{count.toLocaleString("en-IN")}</>;
}

/* ---------- ek row (ledger style) ---------- */
function Row({ icon: Icon, label, description, children, footer }) {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "rgba(200,174,106,0.12)",
              color: GOLD_LIGHT,
              boxShadow: `inset 0 0 0 1px ${GOLD}55`,
            }}
          >
            <Icon size={21} strokeWidth={1.9} />
          </span>

          <div className="min-w-0">
            <h3 className="text-[15px] font-extrabold text-white sm:text-base">{label}</h3>
            <p className="mt-0.5 text-xs leading-snug text-white/65 sm:text-[13px]">
              {description}
            </p>
          </div>
        </div>

        <div
          className="shrink-0 text-right text-4xl font-black leading-none tracking-tight tabular-nums sm:text-5xl"
          style={{ color: GOLD_LIGHT }}
        >
          {children}
        </div>
      </div>

      {footer}
    </div>
  );
}

export default function JobStatsSection({
  totalJobs = 0,
  availableJobsCount = 0,
  is24x7 = true,
}) {
  const [ref, seen] = useInView();

  const total = Math.max(0, Number(totalJobs) || 0);
  const open = Math.max(0, Number(availableJobsCount) || 0);
  const pct = total > 0 ? Math.min(100, Math.round((open / total) * 100)) : 0;

  return (
    <section
      ref={ref}
      aria-label="JobHir job statistics"
      className="relative mt-6 overflow-hidden"
      style={{
        backgroundColor: "#0b302a",
        backgroundImage: `${STAR}, linear-gradient(135deg, ${DEEP}, #0b302a 55%, #123d32)`,
        backgroundSize: "60px 60px, 100% 100%",
      }}
    >
      {/* gold hairlines top and bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}66, transparent)` }}
      />
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#c8ae6a]/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
        {/* ---------------- LEFT: message ---------------- */}
        <div>
          <h2
            className="text-[1.75rem] font-extrabold leading-[1.2] text-white sm:text-4xl"
            style={{ fontFamily: "'Mukta', 'Poppins', system-ui, sans-serif" }}
          >
            आपका अगला काम,
            <br />
            यहीं से शुरू।
          </h2>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Browse open jobs, apply in a minute and take your next step with JobHir.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { icon: ShieldCheck, text: "Safety matters" },
              { icon: CheckCircle2, text: "Opportunities in one place" },
              { icon: UsersRound, text: "For everyone" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold text-white/85"
                style={{ borderColor: `${GOLD}4d`, background: "rgba(255,255,255,0.05)" }}
              >
                <Icon size={15} style={{ color: GOLD_LIGHT }} />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* ---------------- RIGHT: ledger ---------------- */}
        <div
          className="overflow-hidden rounded-2xl border shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
          style={{ borderColor: `${GOLD}59`, background: "rgba(255,255,255,0.04)" }}
        >
          <div className="divide-y divide-dashed divide-[#c8ae6a]/30">
            {/* Open jobs + bar */}
            <Row
              icon={BriefcaseBusiness}
              label={
                <span className="inline-flex items-center gap-2">
                  Open jobs
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>
                </span>
              }
              description={`${open.toLocaleString("en-IN")} of ${total.toLocaleString("en-IN")} listed jobs`}
              footer={
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  aria-label="Share of listed jobs that are open"
                >
                  <span
                    className="block h-full rounded-full transition-[width] duration-[1400ms] ease-out"
                    style={{
                      width: seen ? `${pct}%` : "0%",
                      background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                    }}
                  />
                </div>
              }
            >
              <AnimatedNumber value={open} start={seen} />
            </Row>

            {/* 24/7 */}
            {is24x7 && (
              <Row
                icon={Clock3}
                label="Always open"
                description="Browse jobs whenever you need"
              >
                24/7
              </Row>
            )}

            {/* Free posting */}
            <Row
              icon={IndianRupee}
              label="Post a job"
              description="Employers can list jobs at no cost"
            >
              Free
            </Row>
          </div>
        </div>
      </div>
    </section>
  );
}