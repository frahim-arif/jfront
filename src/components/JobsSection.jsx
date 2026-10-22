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

   Is file me <article> aur <section> tag jaan-bujhkar nahi
   use kiye: App.jsx ki global CSS (".jobhir-app main article",
   ".jobhir-app main section button") unhe indigo rang aur
   !important radius se override kar deti hai.
   ====================================================== */

const DEEP = "#071c19";
const FOREST = "#0b302a";
const GOLD = "#c8ae6a";
const GOLD_LIGHT = "#e2c77e";
const LINE = "#e6e0cd";
const MUTED = "#53665d";

// faint 8-point star (same motif as header / offer banner)
const star = (stroke) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='${stroke}' stroke-width='1'><rect x='17' y='17' width='26' height='26'/><rect x='17' y='17' width='26' height='26' transform='rotate(45 30 30)'/><circle cx='30' cy='30' r='3'/></g></svg>`
  )}")`;

const STAR_GOLD = star("rgba(200,174,106,0.35)");

/* ---------- helpers ---------- */

const normalize = (v) => String(v || "").trim().toLowerCase();

const getJobState = (job) => job?.state || job?.location?.state || "";
const getJobDistrict = (job) => job?.district || job?.location?.district || "";
const getJobAddress = (job) =>
  job?.location?.address || job?.address || "Location provided by employer";

// Sab trades ke liye ek hi rang (green + gold); sirf icon alag
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

const HINDI = {
  mason: "राजमिस्त्री",
  carpenter: "बढ़ई",
  painter: "पेंटर",
  electrician: "इलेक्ट्रीशियन",
  plumber: "प्लंबर",
  gardener: "माली",
  cleaner: "सफाई कर्मी",
  welder: "वेल्डर",
  driver: "ड्राइवर",
  "construction worker": "निर्माण मज़दूर",
  helper: "हेल्पर",
  "ac technician": "एसी टेक्नीशियन",
  mechanic: "मैकेनिक",
  "tiles worker": "टाइल्स मिस्त्री",
  "furniture worker": "फर्नीचर कारीगर",
  "home care": "होम केयर",
  "graphic designer": "ग्राफिक डिज़ाइनर",
  other: "अन्य काम",
};

const iconFor = (type) => ICONS[normalize(type)] || BriefcaseBusiness;
const hindiFor = (type) => HINDI[normalize(type)] || "";

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
          style={{ borderColor: LINE, borderTopColor: GOLD }}
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
            style={{ background: DEEP, color: GOLD_LIGHT }}
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
              className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition hover:brightness-110"
              style={{ background: DEEP, color: GOLD_LIGHT }}
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
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
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
            <MapPin className="h-3.5 w-3.5" style={{ color: "#8d7947" }} />
            {placeLabel}
          </span>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {categories.map(({ workType, count }) => {
            const Icon = iconFor(workType);
            const hindi = hindiFor(workType);

            return (
              <li key={workType}>
                <button
                  type="button"
                  onClick={() => onSelectWorkType?.(workType)}
                  className="group relative flex min-h-[124px] w-full flex-col justify-between overflow-hidden rounded-2xl border bg-white p-3.5 text-left shadow-[0_3px_12px_rgba(7,28,25,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(7,28,25,0.20)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8ae6a] focus-visible:ring-offset-2"
                  style={{ borderColor: LINE }}
                >
                  {/* hover: tile turns deep green */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${DEEP}, ${FOREST})`,
                    }}
                  />
                  {/* star watermark */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-7 -right-7 h-28 w-28 opacity-70"
                    style={{ backgroundImage: STAR_GOLD, backgroundSize: "40px 40px" }}
                  />

                  <span className="relative flex items-start justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 group-hover:!bg-[#c8ae6a] group-hover:!text-[#071c19]"
                      style={{ background: DEEP, color: GOLD_LIGHT }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.1} />
                    </span>

                    <span className="text-right leading-none">
                      <span
                        className="block text-2xl font-black transition-colors duration-300 group-hover:!text-[#e2c77e]"
                        style={{ color: DEEP }}
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
                    {hindi && (
                      <span
                        className="mt-0.5 block text-xs font-semibold transition-colors duration-300 group-hover:!text-[#e2c77e]"
                        style={{ color: MUTED }}
                      >
                        {hindi}
                      </span>
                    )}
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
  const bannerHindi = hindiFor(selectedWorkType);

  return (
    <div>
      {/* Banner */}
      <div
        className="relative mb-5 overflow-hidden rounded-2xl border"
        style={{
          borderColor: `${GOLD}66`,
          backgroundColor: FOREST,
          backgroundImage: `${STAR_GOLD}, linear-gradient(135deg, ${DEEP}, ${FOREST} 60%, #123d32)`,
          backgroundSize: "60px 60px, 100% 100%",
        }}
      >
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                color: DEEP,
              }}
            >
              <BannerIcon className="h-7 w-7" strokeWidth={2.1} />
            </span>

            <div>
              <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                {selectedWorkType}
                {bannerHindi && (
                  <span
                    className="ml-2 text-sm font-semibold"
                    style={{ color: GOLD_LIGHT }}
                  >
                    {bannerHindi}
                  </span>
                )}
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e2c77e] sm:w-auto"
            style={{ borderColor: `${GOLD}99` }}
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
            style={{ background: DEEP, color: GOLD_LIGHT }}
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
            className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition hover:brightness-110"
            style={{ background: DEEP, color: GOLD_LIGHT }}
          >
            <ArrowLeft className="h-4 w-4" />
            Browse all trades
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryJobs.map((job) => {
            const Icon = iconFor(job?.workType || selectedWorkType);
            const state = getJobState(job);
            const district = getJobDistrict(job);
            const address = getJobAddress(job);
            const amount = Number(job?.amount || 0);

            return (
              <li key={job?._id || job?.id} className="h-full">
                <div
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_4px_16px_rgba(7,28,25,0.06)] transition-shadow duration-300 hover:shadow-[0_16px_34px_rgba(7,28,25,0.16)]"
                  style={{ borderColor: LINE }}
                >
                  {/* gold hairline on top */}
                  <div
                    className="h-1 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
                    }}
                  />

                  <div className="flex flex-1 flex-col p-4">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: DEEP, color: GOLD_LIGHT }}
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
                            style={{ color: "#8d7947" }}
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
                      className="mt-4 flex items-center justify-between rounded-xl border px-3.5 py-3"
                      style={{ background: "#faf8ef", borderColor: LINE }}
                    >
                      <span className="text-xs font-bold" style={{ color: MUTED }}>
                        Job payment
                      </span>
                      <span
                        className="text-xl font-black tracking-tight"
                        style={{ color: DEEP }}
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
                            style={{ color: "#8d7947" }}
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
                            style={{ color: "#8d7947" }}
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold" style={{ color: MUTED }}>
                              Address
                            </p>
                            <p
                              className="line-clamp-2 text-[13px] font-medium leading-[18px]"
                              style={{ color: "#2f4a40" }}
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
                        className="group/btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold shadow-sm transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8ae6a] focus-visible:ring-offset-2 active:scale-[0.98]"
                        style={{ background: DEEP, color: GOLD_LIGHT }}
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