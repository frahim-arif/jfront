import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Car,
  Construction,
  Hammer,
  HandHelping,
  HardHat,
  HeartHandshake,
  Layers3,
  MapPin,
  MapPinned,
  Paintbrush,
  Palette,
  Search,
  Settings,
  Snowflake,
  Sofa,
  Sparkles,
  Sprout,
  Wrench,
  Zap,
} from "lucide-react";

/* ======================================================
   JOBHIR — JOBS AREA (trade tiles + category banner + job cards)
   Save as: src/components/JobsSection.jsx

   Note: <article> and <section> tags are intentionally not used
   here. The global CSS in App.jsx (".jobhir-app main article",
   ".jobhir-app main section button") would override their styles.
   ====================================================== */

const DEEP = "#0f172a"; // slate-900
const NAVY = "#1e1b4b"; // indigo-950
const ACCENT = "#818cf8"; // indigo-400
const ACCENT_LIGHT = "#a5b4fc"; // indigo-300
const ACCENT_DARK = "#6366f1"; // indigo-500
const LINE = "#e2e8f0"; // slate-200
const MUTED = "#64748b"; // slate-500

// subtle dot grid (replaces the old star pattern)
const DOTS = "radial-gradient(rgba(165,180,252,0.28) 1px, transparent 1px)";

/* ---------- helpers ---------- */

const normalize = (v) => String(v || "").trim().toLowerCase();

const getJobState = (job) => job?.state || job?.location?.state || "";
const getJobDistrict = (job) => job?.district || job?.location?.district || "";
const getJobAddress = (job) =>
  job?.location?.address || job?.address || "Location provided by employer";

const ICONS = {
  mason: Hammer,
  carpenter: Hammer,
  painter: Paintbrush,
  electrician: Zap,
  plumber: Wrench,
  gardener: Sprout,
  cleaner: Sparkles,
  welder: Construction,
  driver: Car,
  "construction worker": HardHat,
  helper: HandHelping,
  "ac technician": Snowflake,
  mechanic: Settings,
  "tiles worker": Layers3,
  "furniture worker": Sofa,
  "home care": HeartHandshake,
  "graphic designer": Palette,
  other: BriefcaseBusiness,
};

const iconFor = (type) => ICONS[normalize(type)] || BriefcaseBusiness;

// Soft tones: light tint for the icon chip + darker icon colour
const TONES = {
  warm: { bg: "#ffedd5", fg: "#c2410c" },
  ochre: { bg: "#fef3c7", fg: "#a16207" },
  teal: { bg: "#ccfbf1", fg: "#0f766e" },
  leaf: { bg: "#dcfce7", fg: "#15803d" },
  plum: { bg: "#f3e8ff", fg: "#7e22ce" },
  indigo: { bg: "#e0e7ff", fg: "#4338ca" },
  rose: { bg: "#ffe4e6", fg: "#be123c" },
  slate: { bg: "#e2e8f0", fg: "#475569" },
};

const TONE_OF = {
  mason: "warm",
  carpenter: "warm",
  "furniture worker": "warm",
  "construction worker": "warm",
  electrician: "ochre",
  welder: "ochre",
  plumber: "teal",
  "ac technician": "teal",
  cleaner: "teal",
  gardener: "leaf",
  helper: "leaf",
  painter: "plum",
  "graphic designer": "plum",
  driver: "indigo",
  mechanic: "indigo",
  "tiles worker": "indigo",
  "home care": "rose",
  other: "slate",
};

const toneFor = (type) => TONES[TONE_OF[normalize(type)]] || TONES.slate;

/* ======================================================
   COMPONENT
   ====================================================== */

export default function JobsSection({
  loading = false,
  selectedState = "All",
  availableJobs = [],
  categories = [], // [{ workType, count }]
  selectedWorkType = null,
  categoryJobs = [],
  onSelectWorkType,
  onApply,
  onShowAll,
}) {
  const placeLabel = selectedState === "All" ? "All India" : selectedState;

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4"
          style={{ borderColor: LINE, borderTopColor: ACCENT_DARK }}
        />
        <p className="text-sm font-semibold" style={{ color: MUTED }}>
          Loading jobs...
        </p>
      </div>
    );
  }

  /* ---------------- NO JOBS AT ALL ---------------- */
  if (availableJobs.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div
          className="w-full max-w-md rounded-2xl border bg-white px-6 py-10 text-center"
          style={{ borderColor: LINE }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: DEEP, color: ACCENT_LIGHT }}
          >
            <Search className="h-6 w-6" />
          </div>

          <p className="text-lg font-extrabold" style={{ color: DEEP }}>
            No jobs in {placeLabel} yet
          </p>
          <p className="mt-1 text-sm" style={{ color: MUTED }}>
            New jobs are added every day. Check another state or come back soon.
          </p>

          {selectedState !== "All" && onShowAll && (
            <button
              type="button"
              onClick={onShowAll}
              className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition hover:brightness-125"
              style={{ background: DEEP, color: ACCENT_LIGHT }}
            >
              Show all India
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- CATEGORY (TRADE) VIEW ---------------- */
  if (!selectedWorkType) {
    return (
      <div>
        {/* <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              className="text-xl font-extrabold sm:text-2xl"
              style={{ color: DEEP }}
            >
              Find work by trade
            </h2>
            <p className="text-sm" style={{ color: MUTED }}>
              {availableJobs.length} open{" "}
              {availableJobs.length === 1 ? "job" : "jobs"} in {placeLabel}
            </p>
          </div>

          <span
            className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-bold"
            style={{ borderColor: LINE, color: DEEP }}
          >
            <MapPin className="h-3.5 w-3.5" style={{ color: ACCENT_DARK }} />
            {placeLabel}
          </span>
        </div> */}

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map(({ workType, count }) => {
            const Icon = iconFor(workType);
            const tone = toneFor(workType);

            return (
              <li key={workType}>
                <button
                  type="button"
                  onClick={() => onSelectWorkType?.(workType)}
                  className="group relative flex min-h-[124px] w-full flex-col justify-between overflow-hidden rounded-2xl border bg-white p-3.5 text-left shadow-[0_3px_12px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                  style={{ borderColor: LINE }}
                >
                  {/* soft tinted corner glow */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(130px 100px at 0% 0%, ${tone.bg}, transparent 70%)`,
                    }}
                  />
                  {/* hover: tile turns navy */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${DEEP}, ${NAVY})`,
                    }}
                  />
                  {/* dot watermark */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-7 -right-7 h-28 w-28 opacity-70"
                    style={{ backgroundImage: DOTS, backgroundSize: "14px 14px" }}
                  />

                  <span className="relative flex items-start justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 group-hover:!bg-indigo-400 group-hover:!text-slate-900"
                      style={{
                        background: tone.bg,
                        color: tone.fg,
                        boxShadow: `inset 0 0 0 1px ${tone.fg}26`,
                      }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.1} />
                    </span>

                    <span className="text-right leading-none">
                      <span
                        className="block text-2xl font-black transition-colors duration-300 group-hover:!text-indigo-300"
                        style={{ color: tone.fg }}
                      >
                        {count}
                      </span>
                      <span
                        className="mt-1 block text-[11px] font-semibold transition-colors duration-300 group-hover:!text-white/70"
                        style={{ color: MUTED }}
                      >
                        {count === 1 ? "job" : "jobs"}
                      </span>
                    </span>
                  </span>

                  <span className="relative mt-3 block">
                    <span
                      className="block text-sm font-extrabold leading-tight transition-colors duration-300 group-hover:!text-white"
                      style={{ color: DEEP }}
                    >
                      {workType}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  /* ---------------- SELECTED CATEGORY ---------------- */
  const BannerIcon = iconFor(selectedWorkType);

  return (
    <div>
      {/* Banner */}
      <div
        className="relative mb-5 overflow-hidden rounded-2xl border"
        style={{
          borderColor: "rgba(165,180,252,0.3)",
          backgroundColor: NAVY,
          backgroundImage: `${DOTS}, linear-gradient(135deg, ${DEEP}, ${NAVY} 55%, #312e81)`,
          backgroundSize: "22px 22px, 100% 100%",
        }}
      >
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `linear-gradient(135deg, ${ACCENT_LIGHT}, ${ACCENT})`,
                color: DEEP,
              }}
            >
              <BannerIcon className="h-7 w-7" strokeWidth={2.1} />
            </span>

            <div>
              <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                {selectedWorkType}
              </h2>
              <p className="mt-0.5 text-sm text-white/75">
                {categoryJobs.length} {categoryJobs.length === 1 ? "job" : "jobs"} in{" "}
                {placeLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectWorkType?.(null)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-300/50 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            All trades
          </button>
        </div>
      </div>

      {/* Empty category */}
      {categoryJobs.length === 0 ? (
        <div
          className="rounded-2xl border bg-white px-6 py-12 text-center"
          style={{ borderColor: LINE }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: DEEP, color: ACCENT_LIGHT }}
          >
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-extrabold" style={{ color: DEEP }}>
            No {selectedWorkType} jobs right now
          </h3>
          <p className="mt-1 text-sm" style={{ color: MUTED }}>
            Try another trade. New jobs are added every day.
          </p>
          <button
            type="button"
            onClick={() => onSelectWorkType?.(null)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition hover:brightness-125"
            style={{ background: DEEP, color: ACCENT_LIGHT }}
          >
            <ArrowLeft className="h-4 w-4" />
            Browse all trades
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryJobs.map((job) => {
            const Icon = iconFor(job?.workType || selectedWorkType);
            const tone = toneFor(job?.workType || selectedWorkType);
            const state = getJobState(job);
            const district = getJobDistrict(job);
            const address = getJobAddress(job);
            const amount = Number(job?.amount || 0);

            return (
              <li key={job?._id || job?.id} className="h-full">
                <div
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(15,23,42,0.16)]"
                  style={{ borderColor: LINE }}
                >
                  {/* top accent line */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${ACCENT_DARK}, ${ACCENT_LIGHT}, ${ACCENT_DARK})`,
                    }}
                  />

                  <div className="flex flex-1 flex-col p-4">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            background: tone.bg,
                            color: tone.fg,
                            boxShadow: `inset 0 0 0 1px ${tone.fg}26`,
                          }}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2.1} />
                        </span>

                        <div className="min-w-0">
                          <h3
                            className="line-clamp-2 text-[15px] font-extrabold leading-5"
                            style={{ color: DEEP }}
                          >
                            {job?.title || job?.workType || "Job opportunity"}
                          </h3>
                          <p
                            className="mt-0.5 text-xs font-semibold"
                            style={{ color: ACCENT_DARK }}
                          >
                            {job?.workType || selectedWorkType}
                          </p>
                        </div>
                      </div>

                      <span className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Open
                      </span>
                    </div>

                    {/* Description */}
                    {job?.description && (
                      <p
                        className="mt-3 line-clamp-3 text-[13px] leading-5"
                        style={{ color: MUTED }}
                      >
                        {job.description}
                      </p>
                    )}

                    {/* Pay */}
                    <div
                      className="relative mt-4 flex items-center justify-between overflow-hidden rounded-xl px-3.5 py-3"
                      style={{
                        backgroundColor: NAVY,
                        backgroundImage: `${DOTS}, linear-gradient(135deg, ${DEEP}, ${NAVY})`,
                        backgroundSize: "18px 18px, 100% 100%",
                        boxShadow: "inset 0 0 0 1px rgba(165,180,252,0.25)",
                      }}
                    >
                      <span className="text-xs font-bold text-white/75">Job payment</span>
                      <span
                        className={`font-black tracking-tight ${amount > 0 ? "text-2xl" : "text-sm"}`}
                        style={{ color: ACCENT_LIGHT }}
                      >
                        {amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "Not specified"}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="mt-4 space-y-2.5">
                      {(state || district) && (
                        <div className="flex items-start gap-2.5">
                          <MapPinned
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: ACCENT_DARK }}
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold" style={{ color: MUTED }}>
                              Location
                            </p>
                            <p
                              className="truncate text-[13px] font-bold"
                              style={{ color: DEEP }}
                            >
                              {[district, state].filter(Boolean).join(", ")}
                            </p>
                          </div>
                        </div>
                      )}

                      {address && (
                        <div className="flex items-start gap-2.5">
                          <MapPin
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: ACCENT_DARK }}
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold" style={{ color: MUTED }}>
                              Address
                            </p>
                            <p
                              className="line-clamp-2 text-[13px] font-medium leading-[18px]"
                              style={{ color: "#334155" }}
                            >
                              {address}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Apply */}
                    <div className="mt-auto pt-5">
                      <button
                        type="button"
                        onClick={() => onApply?.(job)}
                        className="group/btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-[0.98]"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT_DARK}, #4f46e5)`,
                        }}
                      >
                        Apply now
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}