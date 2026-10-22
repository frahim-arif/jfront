import { ArrowRight, BriefcaseBusiness } from "lucide-react";

/* ======================================================
   JOBHIR — COMPACT OFFER BANNER (coupon style)
   Save as: src/components/OfferBanner.jsx

   Use in App.jsx:
     import OfferBanner from "./components/OfferBanner.jsx";
     <OfferBanner onRegister={() => navigate("/worker-register")} />
   ====================================================== */

const DEEP = "#071c19";
const BROWN = "#8c3500";
const PAGE_BG = "#faf8ef"; // notch colour = page background

// same 8-point star as the header, very faint
const TILE = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 60 60'><g fill='none' stroke='rgba(113,52,0,0.10)' stroke-width='1'><rect x='17' y='17' width='26' height='26'/><rect x='17' y='17' width='26' height='26' transform='rotate(45 30 30)'/></g></svg>`;
const PATTERN = `url("data:image/svg+xml,${encodeURIComponent(TILE)}")`;

export default function OfferBanner({
  onRegister,
  price = 100,
  oldPrice = 250,
  days = 15,
}) {
  const off = Math.round(((oldPrice - price) / oldPrice) * 100);

  return (
    <section className="px-3 pt-2 sm:px-5 lg:px-8 xl:px-10">
      <style>{`
        .jobhir-offer-btn { position: relative; overflow: hidden; }
        .jobhir-offer-btn::after {
          content: "";
          position: absolute; inset: 0 auto 0 -60%;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
          transform: skewX(-20deg);
          animation: jobhirOfferShine 4.5s ease-in-out infinite;
        }
        @keyframes jobhirOfferShine {
          0%, 55% { left: -60%; }
          100% { left: 140%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .jobhir-offer-btn::after { animation: none; display: none; }
        }
      `}</style>

      <div
        className="relative flex items-stretch overflow-hidden rounded-2xl border shadow-[0_8px_22px_rgba(140,53,0,0.14)]"
        style={{
          borderColor: "rgba(180,120,30,.45)",
          backgroundImage: `${PATTERN}, linear-gradient(100deg,#fff3cf 0%,#f7d684 55%,#eab34f 100%)`,
          backgroundSize: "48px 48px, 100% 100%",
        }}
      >
        {/* ---------- LEFT: offer text ---------- */}
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 sm:px-5">
          <span
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full sm:flex"
            style={{ background: DEEP, color: "#e2c77e" }}
          >
            <BriefcaseBusiness className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className="hidden items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-flex"
                style={{ background: DEEP, color: "#e2c77e" }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Limited offer
              </span>

              <h2
                className="truncate text-[15px] font-extrabold leading-tight sm:text-lg"
                style={{ color: DEEP }}
              >
                Worker registration
                <span className="ml-1.5 font-bold" style={{ color: BROWN }}>
                  · {days} days
                </span>
              </h2>
            </div>

            <p
              className="mt-0.5 truncate text-[11px] font-medium sm:text-xs"
              style={{ color: "#563817" }}
            >
              <span className="sm:hidden">Limited offer · </span>
              Join JobHir and find work near you.
            </p>
          </div>
        </div>

        {/* ---------- RIGHT: ticket stub (dashed divider + notches) ---------- */}
        <div
          className="relative flex shrink-0 items-center gap-3 border-l-2 border-dashed px-3 py-2.5 sm:gap-4 sm:px-5"
          style={{ borderColor: "rgba(113,52,0,.35)" }}
        >
          <span
            aria-hidden="true"
            className="absolute -left-[11px] -top-[10px] h-5 w-5 rounded-full"
            style={{ background: PAGE_BG, boxShadow: "inset 0 -1px 0 rgba(180,120,30,.45)" }}
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-[10px] -left-[11px] h-5 w-5 rounded-full"
            style={{ background: PAGE_BG, boxShadow: "inset 0 1px 0 rgba(180,120,30,.45)" }}
          />

          <div className="leading-none">
            <div className="mb-1 flex items-center gap-1.5">
              <span
                className="text-[11px] font-bold line-through"
                style={{ color: "rgba(121,69,27,.7)" }}
              >
                ₹{oldPrice}
              </span>
              <span
                className="rounded px-1 py-0.5 text-[10px] font-extrabold"
                style={{ background: "rgba(255,255,255,.6)", color: BROWN }}
              >
                {off}% off
              </span>
            </div>
            <div
              className="text-2xl font-black tracking-tight sm:text-[28px]"
              style={{ color: DEEP }}
            >
              ₹{price}
            </div>
          </div>

          <button
            type="button"
            onClick={onRegister}
            className="jobhir-offer-btn group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-white shadow-md transition-all duration-200 hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#071c19] focus-visible:ring-offset-2 active:scale-95 sm:px-5 sm:text-sm"
            style={{ background: DEEP }}
          >
            Register
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}