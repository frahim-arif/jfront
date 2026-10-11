import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  BriefcaseBusiness,
  Hammer,
  Paintbrush,
  CreditCard,
  Zap,
  Wrench,
  Sprout,
  Sparkles,
  HeartHandshake,
  HardHat,
  MapPin,
  MapPinned,
  IndianRupee,
  ArrowLeft,
  ArrowRight,
  Search,
  Car,
  Construction,
  HandHelping,
  Snowflake,
  Settings,
  Layers3,
  Sofa,
  Palette,
  Plus,
  UserPlus,
  X,
  ShieldCheck,
  Users,
} from "lucide-react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HealthcareJobs from "./HealthcareJobs";

// ======================================================
// API
// ======================================================

const API_BASE = "https://jbackend-h963.onrender.com";

// ======================================================
// INDIA STATES + UNION TERRITORIES
// ======================================================

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// ======================================================
// WORK TYPES
// ======================================================

const WORK_TYPES = [
  "Mason",
  "Carpenter",
  "Painter",
  "Electrician",
  "Plumber",
  "Gardener",
  "Cleaner",
  "Welder",
  "Driver",
  "Construction Worker",
  "Helper",
  "AC Technician",
  "Mechanic",
  "Tiles Worker",
  "Furniture Worker",
  "Home Care",
  "Graphic Designer",
  "Other",
];

// ======================================================
// HELPERS
// ======================================================

const normalizeWorkType = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getJobState = (job) =>
  job?.state || job?.location?.state || "";

const getJobDistrict = (job) =>
  job?.district || job?.location?.district || "";

const getJobAddress = (job) =>
  job?.location?.address ||
  job?.address ||
  "Location provided by employer";

// ======================================================
// WORK TYPE ICONS / COLORS
// (full class names rakhe hain taaki Tailwind detect kare)
// ======================================================

const style = (icon, color, bg, border, accent) => ({
  icon,
  color,
  bg,
  border,
  accent,
});

const WORK_STYLES = {
  mason: style(Hammer, "text-orange-700", "bg-orange-50", "border-orange-200", "bg-orange-600"),
  carpenter: style(Hammer, "text-amber-700", "bg-amber-50", "border-amber-200", "bg-amber-600"),
  painter: style(Paintbrush, "text-pink-700", "bg-pink-50", "border-pink-200", "bg-pink-600"),
  electrician: style(Zap, "text-yellow-700", "bg-yellow-50", "border-yellow-200", "bg-yellow-600"),
  plumber: style(Wrench, "text-blue-700", "bg-blue-50", "border-blue-200", "bg-blue-600"),
  gardener: style(Sprout, "text-green-700", "bg-green-50", "border-green-200", "bg-green-600"),
  cleaner: style(Sparkles, "text-cyan-700", "bg-cyan-50", "border-cyan-200", "bg-cyan-600"),
  welder: style(Construction, "text-red-700", "bg-red-50", "border-red-200", "bg-red-600"),
  driver: style(Car, "text-violet-700", "bg-violet-50", "border-violet-200", "bg-violet-600"),
  "construction worker": style(HardHat, "text-orange-700", "bg-orange-50", "border-orange-200", "bg-orange-600"),
  helper: style(HandHelping, "text-teal-700", "bg-teal-50", "border-teal-200", "bg-teal-600"),
  "ac technician": style(Snowflake, "text-sky-700", "bg-sky-50", "border-sky-200", "bg-sky-600"),
  mechanic: style(Settings, "text-slate-700", "bg-slate-100", "border-slate-300", "bg-slate-700"),
  "tiles worker": style(Layers3, "text-indigo-700", "bg-indigo-50", "border-indigo-200", "bg-indigo-600"),
  "furniture worker": style(Sofa, "text-rose-700", "bg-rose-50", "border-rose-200", "bg-rose-600"),
  "home care": style(HeartHandshake, "text-rose-700", "bg-rose-50", "border-rose-200", "bg-rose-600"),
  "graphic designer": style(Palette, "text-fuchsia-700", "bg-fuchsia-50", "border-fuchsia-200", "bg-fuchsia-600"),
  other: style(BriefcaseBusiness, "text-indigo-700", "bg-indigo-50", "border-indigo-200", "bg-indigo-600"),
};

const getWorkTypeIconData = (workType) =>
  WORK_STYLES[normalizeWorkType(workType)] || WORK_STYLES.other;

// ======================================================
// LEAFLET ICON
// ======================================================

const locationIcon = new L.DivIcon({
  className: "jobhir-location-marker",

  html: `
    <div style="
      width:34px;
      height:34px;
      background:linear-gradient(135deg,#1d4ed8,#6d28d9);
      border:3px solid #ffffff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 14px rgba(29,78,216,.45);
      position:relative;
    ">
      <div style="
        width:10px;
        height:10px;
        background:#ffffff;
        border-radius:50%;
        position:absolute;
        top:9px;
        left:9px;
      "></div>
    </div>
  `,

  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

// ======================================================
// MAP CENTER
// ======================================================

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position || !map) return;

    map.setView(position, 16);
  }, [map, position]);

  return null;
}

// ======================================================
// SMALL UI PIECES
// ======================================================

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-400">{label}</p>
        <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-700">
          {children}
        </p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-100" />
        </div>
      </div>
      <div className="h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
      <div className="mt-5 h-12 rounded-xl bg-slate-100" />
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100";

// ======================================================
// APP
// ======================================================

export default function App() {
  const navigate = useNavigate();

  // ====================================================
  // JOB DATA
  // ====================================================

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // ====================================================
  // FILTERS
  // ====================================================

  const [stateList, setStateList] = useState(INDIA_STATES);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedWorkType, setSelectedWorkType] = useState(null);

  // ====================================================
  // SELECTED JOB
  // ====================================================

  const [selectedJob, setSelectedJob] = useState(null);

  // ====================================================
  // PAYMENT / APPLICATION
  // ====================================================

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");

  const [amountInRupees, setAmountInRupees] = useState(10);

  const [note, setNote] = useState("Order for job");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ====================================================
  // CURRENT TIME
  // ====================================================

  const [currentTime, setCurrentTime] = useState("");

  // ====================================================
  // CUSTOM CSS (fonts, animations, scrollbar)
  // ====================================================

  useEffect(() => {
    const el = document.createElement("style");

    el.setAttribute("data-jobhir-style", "true");

    el.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

      .jh-body {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
      }

      .jh-display {
        font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', system-ui, sans-serif;
        letter-spacing: -0.02em;
      }

      @keyframes jobhirMarquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }

      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }

      @keyframes jobhirSheetUp {
        from { transform: translateY(24px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .jobhir-marquee {
        display: inline-block;
        white-space: nowrap;
        animation: jobhirMarquee 22s linear infinite;
      }

      .jobhir-sheet {
        animation: jobhirSheetUp .22s ease-out;
      }

      .jobhir-location-marker {
        background: transparent !important;
        border: none !important;
      }

      .jobhir-scrollbar::-webkit-scrollbar { width: 6px; }
      .jobhir-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
      .jobhir-scrollbar::-webkit-scrollbar-thumb {
        background: #94a3b8;
        border-radius: 10px;
      }
      .jobhir-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #94a3b8 #f1f5f9;
      }

      @media (prefers-reduced-motion: reduce) {
        .jobhir-marquee { animation: none; transform: none; }
        .jobhir-sheet { animation: none; }
      }
    `;

    document.head.appendChild(el);

    return () => {
      el.remove();
    };
  }, []);

  // ====================================================
  // LIVE TIME
  // ====================================================

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // ====================================================
  // FETCH JOBS
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);

        const response = await axios.get(`${API_BASE}/jobs`);

        const fetchedJobs = Array.isArray(response.data?.jobs)
          ? response.data.jobs
          : [];

        if (!mounted) return;

        setJobs(fetchedJobs);

        const apiStates = fetchedJobs
          .map((job) => getJobState(job))
          .filter(Boolean);

        const mergedStates = Array.from(
          new Set([...INDIA_STATES, ...apiStates])
        ).sort((a, b) => String(a).localeCompare(String(b)));

        setStateList(mergedStates);
      } catch (err) {
        console.error("Error fetching jobs:", err);

        if (mounted) {
          setJobs([]);
        }
      } finally {
        if (mounted) {
          setLoadingJobs(false);
        }
      }
    };

    fetchJobs();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // FETCH APPLIED JOBS
  // ====================================================

  useEffect(() => {
    const mobile = localStorage.getItem("mobileNumber");

    if (!mobile) return;

    let mounted = true;

    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/applied-jobs/${mobile}`
        );

        if (!mounted) return;

        const ids = Array.isArray(response.data?.appliedJobIds)
          ? response.data.appliedJobIds
          : [];

        setAppliedJobs(ids);
      } catch (err) {
        console.error("Applied jobs fetch error:", err);
      }
    };

    fetchAppliedJobs();

    return () => {
      mounted = false;
    };
  }, []);

  // ====================================================
  // FILTER JOBS BY STATE
  // ====================================================

  const filteredJobs = useMemo(() => {
    if (selectedState === "All") {
      return jobs;
    }

    const selected = String(selectedState).trim().toLowerCase();

    return jobs.filter((job) => {
      return String(getJobState(job)).trim().toLowerCase() === selected;
    });
  }, [jobs, selectedState]);

  // ====================================================
  // AVAILABLE JOBS
  // ====================================================

  const availableJobs = useMemo(() => {
    return filteredJobs.filter((job) => !appliedJobs.includes(job?._id));
  }, [filteredJobs, appliedJobs]);

  // ====================================================
  // AVAILABLE WORK TYPES
  // ====================================================

  const availableWorkTypes = useMemo(() => {
    return Array.from(
      new Set([
        ...WORK_TYPES,
        ...jobs.map((job) => job?.workType).filter(Boolean),
      ])
    );
  }, [jobs]);

  // ====================================================
  // CATEGORY COUNTS
  // ====================================================

  const workTypeCategories = useMemo(() => {
    return availableWorkTypes
      .map((workType) => ({
        workType,
        count: availableJobs.filter(
          (job) =>
            normalizeWorkType(job?.workType) === normalizeWorkType(workType)
        ).length,
      }))
      .filter((item) => item.count > 0);
  }, [availableWorkTypes, availableJobs]);

  // ====================================================
  // CATEGORY JOBS
  // ====================================================

  const categoryJobs = useMemo(() => {
    if (!selectedWorkType) return [];

    return availableJobs.filter(
      (job) =>
        normalizeWorkType(job?.workType) ===
        normalizeWorkType(selectedWorkType)
    );
  }, [availableJobs, selectedWorkType]);

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const handleCloseModal = () => {
    if (loading) return;

    setSelectedJob(null);
    setCustomerName("");
    setMobileNumber("");
    setEmail("");
    setAmountInRupees(10);
    setNote("Order for job");
    setError("");
  };

  // ====================================================
  // OPEN APPLICATION
  // ====================================================

  const handleApply = (job) => {
    setSelectedJob(job);
    setAmountInRupees(10);
    setNote(`Applying for ${job?.title || "job"}`);
    setError("");
  };

  // ====================================================
  // CREATE PAYMENT ORDER
  // ====================================================

  const createOrder = async () => {
    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (!amountInRupees || Number(amountInRupees) <= 0) {
      setError("Please enter a valid application fee.");
      return;
    }

    if (!selectedJob?._id) {
      setError("Please select a job first.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const amount = Math.round(Number(amountInRupees) * 100);

      localStorage.setItem("mobileNumber", mobileNumber);

      const response = await axios.post(`${API_BASE}/create-order`, {
        amount,
        customerName: customerName.trim(),
        mobileNumber,
        email: email.trim(),
        note: note.trim(),
        jobId: selectedJob._id,
        location: selectedJob.location || null,
      });

      const checkoutUrl = response.data?.checkoutPageUrl;

      if (!checkoutUrl) {
        setError("Unable to get checkout URL. Please try again.");
        return;
      }

      window.open(checkoutUrl, "_blank");

      handleCloseModal();
    } catch (err) {
      console.error("Error creating order:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // SCROLL HELPERS
  // ====================================================

  const scrollToJobs = () => {
    document.getElementById("jobs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // eslint-disable-next-line no-unused-vars
  const scrollToHealthcare = () => {
    document.getElementById("healthcare-jobs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="jh-body min-h-screen w-full overflow-x-hidden bg-slate-100 text-slate-900">
      {/* ==================================================
          HEADER
      ================================================== */}

      <Header onOfferJobClick={() => navigate("/offer-job")} />

      {/* ==================================================
          TOP MARQUEE
      ================================================== */}

      <div className="w-full overflow-hidden bg-slate-950 py-2 text-white">
        <div className="jobhir-marquee text-[11px] font-semibold sm:text-xs">
          <span className="text-slate-400">{currentTime}</span>
          <span className="mx-5 text-amber-400">•</span>
          <span>Find genuine job opportunities near you</span>
          <span className="mx-5 text-amber-400">•</span>
          <span>100% Secure &amp; Safe</span>
          <span className="mx-5 text-amber-400">•</span>
          <span>JobHir — Jobs for Everyone</span>
        </div>
      </div>

      {/* ==================================================
          HERO / TOP ACTION AREA
      ================================================== */}

      <section className="w-full px-3 pt-4 sm:px-5 lg:px-8 xl:px-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 p-5 shadow-lg shadow-blue-950/20 sm:p-7">
          {/* soft decorative circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/10" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            {/* LEFT */}
            <div className="min-w-0">
              <h1 className="jh-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Find your next job
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-blue-100">
                Genuine work from verified employers across India. Pick your
                state and start applying.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-100">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                  <BriefcaseBusiness className="h-3.5 w-3.5 text-amber-300" />
                  {loadingJobs ? "Loading jobs…" : `${availableJobs.length} jobs open`}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                  Secure payments
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:w-auto">
              <div className="grid w-full grid-cols-2 gap-2.5 sm:contents">
                <button
                  type="button"
                  onClick={() => navigate("/offer-job")}
                  className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-amber-400 px-4 py-3 text-sm font-extrabold text-slate-900 shadow-md shadow-amber-900/20 transition hover:bg-amber-300 active:scale-[0.98] sm:w-auto sm:px-5"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2.6s_infinite]" />
                  <Plus className="relative h-4 w-4" strokeWidth={3} />
                  <span className="relative whitespace-nowrap">Post a Job</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/worker-register")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 active:scale-[0.98] sm:w-auto sm:px-5"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </button>
              </div>

              {/* State Selector */}
              <div className="relative w-full sm:w-56">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <span className="text-lg leading-none">🇮🇳</span>
                </div>

                <select
                  aria-label="Select state"
                  value={selectedState}
                  onChange={(event) => {
                    setSelectedState(event.target.value);
                    setSelectedWorkType(null);

                    setTimeout(scrollToJobs, 50);
                  }}
                  className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/20 bg-white pl-10 pr-9 text-sm font-bold text-slate-800 shadow-sm outline-none transition focus:ring-4 focus:ring-amber-300/60"
                >
                  <option value="All">All India</option>

                  {stateList.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-slate-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN JOB AREA
      ================================================== */}

      <main
        id="jobs"
        className="w-full scroll-mt-4 px-3 py-6 sm:px-5 sm:py-8 lg:px-8 xl:px-10"
      >
        {/* LOADING (skeleton) */}
        {loadingJobs && (
          <div>
            <p className="mb-4 text-sm font-semibold text-slate-500">
              Loading jobs… pehli baar server start hone me thoda time lag sakta hai.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          </div>
        )}

        {/* NO JOBS */}
        {!loadingJobs && availableJobs.length === 0 && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <Search className="h-7 w-7 text-blue-700" />
              </div>

              <p className="jh-display text-xl font-extrabold text-slate-900">
                No jobs found
              </p>

              <p className="mt-1.5 text-sm text-slate-500">
                Try another state, or post a job yourself.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedState("All");
                    setSelectedWorkType(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Show all India
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/offer-job")}
                  className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  Post a Job
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY VIEW */}
        {!loadingJobs && availableJobs.length > 0 && !selectedWorkType && (
          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="jh-display text-xl font-extrabold text-slate-900 sm:text-2xl">
                  Browse by work type
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  {selectedState === "All" ? "All India" : selectedState} ·{" "}
                  {availableJobs.length}{" "}
                  {availableJobs.length === 1 ? "job" : "jobs"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {workTypeCategories.map(({ workType, count }) => {
                const { icon: Icon, color, bg, border } =
                  getWorkTypeIconData(workType);

                return (
                  <button
                    key={workType}
                    type="button"
                    onClick={() => setSelectedWorkType(workType)}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.98]"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border ${border} ${bg} ${color}`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.1} />
                    </div>

                    <h3 className="mt-4 min-h-[40px] text-sm font-extrabold leading-5 text-slate-900">
                      {workType}
                    </h3>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        <span className={`text-base font-extrabold ${color}`}>
                          {count}
                        </span>{" "}
                        {count === 1 ? "job" : "jobs"}
                      </span>

                      <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* SELECTED CATEGORY */}
        {!loadingJobs && selectedWorkType && (
          <section>
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {(() => {
                  const { icon: Icon, color, bg, border } =
                    getWorkTypeIconData(selectedWorkType);

                  return (
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${border} ${bg} ${color}`}
                      >
                        <Icon className="h-7 w-7" strokeWidth={2} />
                      </div>

                      <div>
                        <h2 className="jh-display text-2xl font-extrabold text-slate-900">
                          {selectedWorkType}
                        </h2>

                        <p className="mt-0.5 text-sm text-slate-500">
                          {categoryJobs.length}{" "}
                          {categoryJobs.length === 1 ? "job" : "jobs"} available
                          {selectedState !== "All" ? ` in ${selectedState}` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setSelectedWorkType(null)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All categories
                </button>
              </div>
            </div>

            {/* NO CATEGORY JOBS */}
            {categoryJobs.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>

                <h3 className="text-base font-extrabold text-slate-800">
                  No jobs found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  There are currently no jobs available in this category.
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedWorkType(null)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Browse categories
                </button>
              </div>
            )}

            {/* JOB GRID */}
            {categoryJobs.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryJobs.map((job) => {
                  const { icon: Icon, color, bg, border, accent } =
                    getWorkTypeIconData(job?.workType || selectedWorkType);

                  const state = getJobState(job);
                  const district = getJobDistrict(job);
                  const address = getJobAddress(job);

                  return (
                    <article
                      key={job?._id || job?.id}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="flex flex-1 flex-col p-4">
                        {/* TITLE */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${border} ${bg} ${color}`}
                            >
                              <Icon className="h-5 w-5" strokeWidth={2} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-[15px] font-extrabold leading-5 text-slate-900">
                                {job?.title || job?.workType || "Job Opportunity"}
                              </h3>

                              <p className={`mt-0.5 text-xs font-bold ${color}`}>
                                {job?.workType || selectedWorkType}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                            Open
                          </span>
                        </div>

                        {/* DESCRIPTION */}
                        {job?.description && (
                          <p className="mt-3 line-clamp-3 text-[13px] leading-5 text-slate-500">
                            {job.description}
                          </p>
                        )}

                        {/* PAYMENT */}
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <IndianRupee className="h-3.5 w-3.5" />
                            Job payment
                          </div>

                          <div className="text-xl font-extrabold text-slate-900">
                            ₹{Number(job?.amount || 0).toLocaleString("en-IN")}
                          </div>
                        </div>

                        {/* DETAILS */}
                        <div className="mt-4 space-y-3">
                          {(state || district) && (
                            <InfoRow icon={MapPinned} label="Location">
                              {[district, state].filter(Boolean).join(", ")}
                            </InfoRow>
                          )}

                          {address && (
                            <InfoRow icon={MapPin} label="Address">
                              {address}
                            </InfoRow>
                          )}
                        </div>

                        {/* APPLY */}
                        <div className="mt-auto pt-5">
                          <button
                            type="button"
                            onClick={() => handleApply(job)}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl ${accent} px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:brightness-95 active:scale-[0.98]`}
                          >
                            Apply now
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ==================================================
          QUICK LINKS
      ================================================== */}

      <div className="flex w-full justify-center gap-3 px-3 pb-6 sm:px-5">
        <button
          type="button"
          onClick={() => navigate("/working-workers")}
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800 active:scale-[0.98] sm:max-w-[220px] sm:flex-none sm:px-6"
        >
          <Users size={18} />
          <span className="whitespace-nowrap">Now Workers</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/payment")}
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] sm:max-w-[220px] sm:flex-none sm:px-6"
        >
          <CreditCard size={18} />
          <span className="whitespace-nowrap">Pay JobHir</span>
        </button>
      </div>

      {/* ==================================================
          HEALTHCARE JOBS
      ================================================== */}

      <section id="healthcare-jobs" className="scroll-mt-24">
        <HealthcareJobs />
      </section>

      {/* ==================================================
          APPLICATION MODAL (bottom sheet on mobile)
      ================================================== */}

      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm sm:items-center sm:px-5 sm:py-5"
          onClick={handleCloseModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Job application"
            className="jobhir-sheet relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <div className="relative shrink-0 bg-gradient-to-br from-blue-900 to-indigo-800 px-5 py-5 text-white sm:px-6">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="text-xs font-semibold text-blue-200">
                Job application
              </p>

              <h2 className="jh-display mt-1 pr-12 text-xl font-extrabold leading-snug sm:text-2xl">
                Apply for {selectedJob?.title || "Job"}
              </h2>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
                Application fee: ₹{amountInRupees || 0}
              </div>
            </div>

            {/* BODY */}
            <div className="jobhir-scrollbar flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-4">
                {/* NAME */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Your name
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Enter your name"
                    className={inputClass}
                  />
                </div>

                {/* MOBILE */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Mobile number
                  </label>

                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(event) =>
                      setMobileNumber(
                        event.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    className={inputClass}
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Email
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>

                {/* LOCATION */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        Job location
                      </p>

                      <p className="text-xs text-slate-500">
                        Added by the job poster
                      </p>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[11px] font-semibold text-slate-400">
                        Address
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-700">
                        {getJobAddress(selectedJob)}
                      </p>
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2">
                      {selectedJob?.location?.village && (
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[11px] font-semibold text-slate-400">
                            Village
                          </p>
                          <p className="mt-0.5 truncate text-xs font-bold text-slate-700">
                            {selectedJob.location.village}
                          </p>
                        </div>
                      )}

                      {selectedJob?.location?.locality && (
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[11px] font-semibold text-slate-400">
                            Locality / Mohalla
                          </p>
                          <p className="mt-0.5 truncate text-xs font-bold text-slate-700">
                            {selectedJob.location.locality}
                          </p>
                        </div>
                      )}

                      {getJobState(selectedJob) && (
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[11px] font-semibold text-slate-400">
                            State
                          </p>
                          <p className="mt-0.5 truncate text-xs font-bold text-slate-700">
                            {getJobState(selectedJob)}
                          </p>
                        </div>
                      )}

                      {getJobDistrict(selectedJob) && (
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[11px] font-semibold text-slate-400">
                            District
                          </p>
                          <p className="mt-0.5 truncate text-xs font-bold text-slate-700">
                            {getJobDistrict(selectedJob)}
                          </p>
                        </div>
                      )}

                      {selectedJob?.location?.postcode && (
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <p className="text-[11px] font-semibold text-slate-400">
                            PIN
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-slate-700">
                            {selectedJob.location.postcode}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* MAP */}
                    {selectedJob?.location?.latitude != null &&
                      selectedJob?.location?.longitude != null && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                          <div className="h-56 w-full overflow-hidden sm:h-64">
                            <MapContainer
                              center={[
                                Number(selectedJob.location.latitude),
                                Number(selectedJob.location.longitude),
                              ]}
                              zoom={16}
                              scrollWheelZoom={false}
                              className="h-full w-full"
                            >
                              <TileLayer
                                attribution="&copy; OpenStreetMap contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />

                              <MapCenter
                                position={[
                                  Number(selectedJob.location.latitude),
                                  Number(selectedJob.location.longitude),
                                ]}
                              />

                              <Marker
                                position={[
                                  Number(selectedJob.location.latitude),
                                  Number(selectedJob.location.longitude),
                                ]}
                                icon={locationIcon}
                              >
                                <Popup>
                                  <strong>Job Location</strong>
                                  <br />
                                  {getJobAddress(selectedJob)}
                                </Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* APPLICATION FEE */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Application fee
                  </label>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      value={amountInRupees}
                      onChange={(event) => setAmountInRupees(event.target.value)}
                      min="1"
                      className={`${inputClass} pl-8 font-bold`}
                    />
                  </div>
                </div>

                {/* NOTE */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Note
                  </label>

                  <input
                    type="text"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Note"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                >
                  {error}
                </div>
              )}

              {/* PAYMENT INFO */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <ShieldCheck className="h-5 w-5 shrink-0 text-amber-700" />

                <p className="text-xs leading-5 text-amber-800">
                  <span className="font-bold">Secure application.</span> You
                  will be taken to the secure payment page to pay ₹
                  {amountInRupees || 0}.
                </p>
              </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="shrink-0 border-t border-slate-200 bg-white p-4 sm:px-6">
              <button
                type="button"
                onClick={createOrder}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3.5 text-sm font-extrabold text-white shadow-md shadow-blue-900/20 transition hover:bg-blue-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing…
                  </>
                ) : (
                  <>Pay ₹{amountInRupees || 0} &amp; apply</>
                )}
              </button>

              <p className="mt-2.5 text-center text-[11px] text-slate-400">
                By continuing, you agree to proceed with this job application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          FOOTER
      ================================================== */}
      <Footer />
    </div>
  );
}