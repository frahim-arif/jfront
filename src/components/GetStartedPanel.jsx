/* ======================================================
   JOBHIR — GET STARTED PANEL (same buttons, same colours,
   same heights; sirf style shandaar)
   Save as: src/components/GetStartedPanel.jsx

   App.jsx me:
     import GetStartedPanel from "./components/GetStartedPanel.jsx";

     <GetStartedPanel
       stateList={stateList}
       selectedState={selectedState}
       onStateChange={(state) => {
         setSelectedState(state);
         setSelectedWorkType(null);
         setTimeout(scrollToJobs, 50);
       }}
       onPostJob={() => navigate("/offer-job")}
       onRegister={() => navigate("/worker-register")}
     />
   ====================================================== */

const GOLD = "#c8ae6a";

// same 8-point star motif as header / offer banner / jobs section
const STAR = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='rgba(200,174,106,0.20)' stroke-width='1'><rect x='17' y='17' width='26' height='26'/><rect x='17' y='17' width='26' height='26' transform='rotate(45 30 30)'/><circle cx='30' cy='30' r='3'/></g></svg>`
)}")`;

export default function GetStartedPanel({
  stateList = [],
  selectedState = "All",
  onStateChange,
  onPostJob,
  onRegister,
}) {
  return (
    <section className="w-full px-3 pt-2 sm:px-5 sm:pt-3 lg:px-8 xl:px-10">
      <style>{`
        @keyframes jobhirShimmer {
          0%, 55% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .jobhir-post-shimmer { animation: jobhirShimmer 3.2s ease-in-out infinite; }

        /* App.jsx ki global CSS select:focus ko indigo bana deti hai; ID se gold wapas */
        #jobhir-state-selector:focus {
          border-color: ${GOLD} !important;
          box-shadow: 0 0 0 3px rgba(200, 174, 106, 0.28) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .jobhir-post-shimmer { animation: none; display: none; }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden rounded-2xl border border-[#c8ae6a]/50 shadow-[0_14px_34px_rgba(7,28,25,0.22)]"
        style={{
          background: "linear-gradient(135deg,#071c19,#0b302a 55%,#123d32)",
        }}
      >
        {/* star pattern layer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: STAR, backgroundSize: "60px 60px" }}
        />
        {/* soft gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#c8ae6a]/15 blur-3xl"
        />
        {/* gold hairline on top */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          }}
        />

        <div className="relative z-10 grid grid-cols-1 items-center gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-8 lg:p-6">
          {/* LEFT — tagline (sirf bade screen par; hata do to bhi layout theek rahega) */}
          <div className="hidden lg:block">
            <p
              className="text-3xl font-extrabold leading-tight text-white xl:text-[34px]"
              style={{ fontFamily: "'Mukta', 'Poppins', system-ui, sans-serif" }}
            >
              काम ढूंढिए,
              <br />
              अपने शहर में।
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
              Pick your state, choose your trade and apply in a minute.
            </p>
          </div>

          {/* RIGHT — ACTIONS */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 shrink-0 rotate-45"
                style={{ background: GOLD }}
              />
              <h2 className="whitespace-nowrap text-sm font-extrabold text-white sm:text-base">
                Get started
              </h2>
              <span className="h-px flex-1 bg-gradient-to-r from-[#c8ae6a]/70 to-transparent" />
            </div>

            {/* TWO BUTTONS, SAME HEIGHT */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* POST A JOB */}
              <button
                type="button"
                onClick={onPostJob}
                className="
                  group relative flex h-[54px] min-w-0
                  items-center justify-center gap-2
                  overflow-hidden rounded-xl border border-[#f5b36a]
                  bg-gradient-to-r from-orange-500 to-amber-400
                  px-2.5 text-[#17251c]
                  shadow-[0_8px_20px_rgba(249,115,22,0.35),inset_0_1px_0_rgba(255,255,255,0.45)]
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:brightness-105
                  hover:shadow-[0_12px_26px_rgba(249,115,22,0.45),inset_0_1px_0_rgba(255,255,255,0.45)]
                  active:translate-y-0 active:scale-[0.98]
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-amber-300 focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#071c19]
                "
              >
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/10 text-2xl font-normal leading-none">
                  +
                </span>

                <span className="relative z-10 flex min-w-0 flex-1 flex-col items-start leading-tight">
                  <span className="whitespace-nowrap text-xs font-extrabold sm:text-sm">
                    Post a Job
                  </span>
                  <span className="mt-0.5 whitespace-nowrap text-[10px] font-bold text-[#47321e]">
                    Free posting
                  </span>
                </span>

                {/* Blinking dot */}
                <span className="relative z-10 flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
                </span>

                {/* Shimmer */}
                <span className="jobhir-post-shimmer pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </button>

              {/* REGISTER */}
              <button
                type="button"
                onClick={onRegister}
                className="
                  group flex h-[54px] min-w-0 items-center
                  justify-center gap-2 rounded-xl
                  border border-[#c8ae6a]/55
                  bg-white/[0.05] px-2.5
                  text-xs font-bold text-white
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:border-[#e2c77e] hover:bg-white/[0.1]
                  active:translate-y-0 active:scale-[0.98]
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[#e2c77e] focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#071c19]
                  sm:text-sm
                "
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#c8ae6a]/40 bg-white/[0.05]">
                  <svg
                    className="h-[18px] w-[18px] text-[#e2c77e]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                  </svg>
                </span>

                <span className="whitespace-nowrap">Register</span>

                <svg
                  className="ml-auto hidden h-4 w-4 shrink-0 text-white/55 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#e2c77e] sm:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* LOCATION SELECTOR */}
            <div className="mt-3">
              <label
                htmlFor="jobhir-state-selector"
                className="mb-1.5 block text-xs font-semibold text-white/75"
              >
                Explore jobs by location
              </label>

              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8d7947]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4.5 8-12a8 8 0 0 0-16 0c0 7.5 8 12 8 12Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>

                <select
                  id="jobhir-state-selector"
                  value={selectedState}
                  onChange={(event) => onStateChange?.(event.target.value)}
                  className="
                    h-11 w-full cursor-pointer appearance-none
                    rounded-xl border border-[#d9d5c7]
                    bg-[#faf8ef] pl-10 pr-9
                    text-sm font-semibold text-[#172d27]
                    shadow-[0_4px_12px_rgba(0,0,0,0.18)]
                    outline-none transition-colors duration-200
                    hover:border-[#c8ae6a]
                  "
                >
                  <option value="All">All India — All States</option>

                  {stateList.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                <svg
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#53665d]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}