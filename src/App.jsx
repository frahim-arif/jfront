
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
  ShieldCheck,
  Clock3,
  X,
} from "lucide-react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HealthcareJobs from "./HealthcareJobs";

// ======================================================
// API
// ======================================================

const API_BASE = "https://jbackend-h963.onrender.com";

// ======================================================
// BRAND COLORS
// ======================================================

const BRAND = {
  dark: "#071c19",
  green: "#0b302a",
  greenLight: "#12483d",
  gold: "#c8ae6a",
  cream: "#faf8ef",
};

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
  String(value || "").trim().toLowerCase();

const getJobState = (job) =>
  job?.state || job?.location?.state || "";

const getJobDistrict = (job) =>
  job?.district || job?.location?.district || "";

const getJobAddress = (job) =>
  job?.location?.address ||
  job?.address ||
  "Location provided by employer";

// ======================================================
// CATEGORY STYLES
// ======================================================

const getWorkTypeIconData = (workType) => {
  const type = normalizeWorkType(workType);

  const icons = {
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

  const colors = {
    mason: ["#fff7ed", "#c2410c"],
    carpenter: ["#fffbeb", "#b45309"],
    painter: ["#fdf2f8", "#be185d"],
    electrician: ["#fefce8", "#a16207"],
    plumber: ["#eff6ff", "#1d4ed8"],
    gardener: ["#f0fdf4", "#15803d"],
    cleaner: ["#ecfeff", "#0e7490"],
    welder: ["#fef2f2", "#b91c1c"],
    driver: ["#f5f3ff", "#6d28d9"],
    "construction worker": ["#fff7ed", "#c2410c"],
    helper: ["#f0fdfa", "#0f766e"],
    "ac technician": ["#f0f9ff", "#0369a1"],
    mechanic: ["#f8fafc", "#475569"],
    "tiles worker": ["#eef2ff", "#4338ca"],
    "furniture worker": ["#fff7ed", "#c2410c"],
    "home care": ["#fff1f2", "#be123c"],
    "graphic designer": ["#fdf4ff", "#a21caf"],
    other: ["#faf8ef", BRAND.green],
  };

  const [bg, color] = colors[type] || [
    BRAND.cream,
    BRAND.green,
  ];

  return {
    icon: icons[type] || BriefcaseBusiness,
    bg,
    color,
  };
};

// ======================================================
// LEAFLET ICON
// ======================================================

const locationIcon = new L.DivIcon({
  className: "jobhir-location-marker",
  html: `
    <div style="
      width:34px;
      height:34px;
      background:linear-gradient(135deg,#0b302a,#c8ae6a);
      border:3px solid #ffffff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 14px rgba(7,28,25,.35);
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
    if (position && map) {
      map.setView(position, 16);
    }
  }, [map, position]);

  return null;
}

// ======================================================
// REUSABLE STYLES
// ======================================================

const inputClass =
  "w-full border border-[#d9dfd8] bg-[#fafbf8] p-3 text-sm text-[#071c19] outline-none transition focus:border-[#0b6652] focus:bg-white focus:ring-4 focus:ring-[#0b302a]/10";

const labelClass =
  "mb-1.5 block text-xs font-bold text-[#334740]";

const smallLabelClass =
  "text-[10px] font-bold uppercase tracking-wider text-[#78877f]";

// ======================================================
// APP
// ======================================================

export default function App() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [stateList, setStateList] = useState(INDIA_STATES);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedWorkType, setSelectedWorkType] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amountInRupees, setAmountInRupees] = useState(10);
  const [note, setNote] = useState("Order for job");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // ====================================================
  // CUSTOM CSS
  // ====================================================

  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-jobhir-style", "true");

    style.innerHTML = `
      @keyframes jobhirMarquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }

      .jobhir-marquee {
        display: inline-block;
        white-space: nowrap;
        animation: jobhirMarquee 22s linear infinite;
      }

      .jobhir-marquee:hover {
        animation-play-state: paused;
      }

      .jobhir-location-marker {
        background: transparent !important;
        border: none !important;
      }

      .jobhir-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .jobhir-scrollbar::-webkit-scrollbar-track {
        background: #faf8ef;
      }

      .jobhir-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(#0b302a, #c8ae6a);
        border-radius: 10px;
      }

      .jobhir-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #0b302a #faf8ef;
      }

      .jobhir-card {
        transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
      }

      .jobhir-card:hover {
        transform: translateY(-3px);
        border-color: #c8ae6a;
        box-shadow: 0 12px 28px rgba(7,28,25,.09);
      }

      @media (prefers-reduced-motion: reduce) {
        .jobhir-marquee {
          animation: none;
        }

        .jobhir-card {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  // ====================================================
  // LIVE TIME
  // ====================================================

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleString("en-IN", {
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
          .map(getJobState)
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
  // FILTER JOBS
  // ====================================================

  const filteredJobs = useMemo(() => {
    if (selectedState === "All") return jobs;

    const selected = String(selectedState).trim().toLowerCase();

    return jobs.filter(
      (job) =>
        String(getJobState(job)).trim().toLowerCase() === selected
    );
  }, [jobs, selectedState]);

  const availableJobs = useMemo(
    () =>
      filteredJobs.filter(
        (job) => !appliedJobs.includes(job?._id)
      ),
    [filteredJobs, appliedJobs]
  );

  const availableWorkTypes = useMemo(
    () =>
      Array.from(
        new Set([
          ...WORK_TYPES,
          ...jobs.map((job) => job?.workType).filter(Boolean),
        ])
      ),
    [jobs]
  );

  const workTypeCategories = useMemo(
    () =>
      availableWorkTypes
        .map((workType) => ({
          workType,
          count: availableJobs.filter(
            (job) =>
              normalizeWorkType(job?.workType) ===
              normalizeWorkType(workType)
          ).length,
        }))
        .filter((item) => item.count > 0),
    [availableWorkTypes, availableJobs]
  );

  const categoryJobs = useMemo(() => {
    if (!selectedWorkType) return [];

    return availableJobs.filter(
      (job) =>
        normalizeWorkType(job?.workType) ===
        normalizeWorkType(selectedWorkType)
    );
  }, [availableJobs, selectedWorkType]);

  // ====================================================
  // APPLICATION MODAL
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

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#faf8ef] text-[#071c19]">
      <Header onOfferJobClick={() => navigate("/offer-job")} />

      {/* TOP MARQUEE */}
      <div className="w-full overflow-hidden border-b border-[#c8ae6a]/50 bg-[#071c19] py-2.5 text-white shadow-sm">
        <div className="jobhir-marquee text-[11px] font-semibold tracking-wide sm:text-xs">
          <span className="text-[#d9dfd8]">{currentTime}</span>
          <span className="mx-5 text-[#c8ae6a]">•</span>
          <span>Find genuine job opportunities near you</span>
          <span className="mx-5 text-[#c8ae6a]">•</span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#c8ae6a]" />
            100% Secure &amp; Safe
          </span>
          <span className="mx-5 text-[#c8ae6a]">•</span>
          <span>JobHir — Jobs for Everyone</span>
        </div>
      </div>

      {/* TOP ACTION AREA */}
      <section className="w-full px-3 pt-4 sm:px-5 lg:px-8 xl:px-10">
        <div className="w-full border border-[#c8ae6a]/45 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 text-center lg:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0b6652] sm:text-xs">
                Job Search
              </p>

              <h1 className="mt-1 text-2xl font-black tracking-tight text-[#071c19] sm:text-3xl">
                Find Your Next Job
              </h1>

              <p className="mt-2 text-xs text-[#64736b] sm:text-sm">
                Search genuine job opportunities across India.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <div className="grid w-full grid-cols-2 gap-2 sm:contents">
                <button
                  type="button"
                  onClick={() => navigate("/offer-job")}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden border border-[#c8ae6a] bg-[#0b302a] px-3 py-3 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#12483d] hover:shadow-lg sm:w-auto sm:px-5"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center gap-1.5">
                    <span className="text-lg leading-none">+</span>
                    <span className="whitespace-nowrap">Post a Job</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/worker-register")}
                  className="w-full border border-[#c8ae6a]/70 bg-[#faf8ef] px-3 py-3 text-sm font-bold text-[#0b302a] transition hover:bg-[#f3ecd8] sm:w-auto sm:px-5"
                >
                  Register
                </button>
              </div>

              <div className="relative w-full sm:w-52">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-lg">
                  🇮🇳
                </div>

                <select
                  value={selectedState}
                  onChange={(event) => {
                    setSelectedState(event.target.value);
                    setSelectedWorkType(null);
                    setTimeout(scrollToJobs, 50);
                  }}
                  className="h-11 w-full cursor-pointer appearance-none border border-[#c8ae6a]/60 bg-gradient-to-r from-[#faf8ef] via-white to-[#edf5ef] pl-10 pr-9 text-sm font-bold text-[#0b302a] outline-none transition hover:border-[#c8ae6a] focus:border-[#0b6652] focus:ring-4 focus:ring-[#0b302a]/10"
                >
                  <option value="All">All India</option>
                  {stateList.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#0b302a]">
                  <svg
                    className="h-4 w-4"
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

      {/* MAIN JOB AREA */}
      <main
        id="jobs"
        className="w-full scroll-mt-24 px-3 py-6 sm:px-5 sm:py-8 lg:px-8 xl:px-10"
      >
        {/* SECTION INTRO */}
        <div className="mb-5 flex flex-col gap-2 border-l-4 border-[#c8ae6a] bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0b6652]">
              Explore Opportunities
            </p>
            <h2 className="mt-1 text-lg font-black text-[#071c19] sm:text-xl">
              Jobs by Category
            </h2>
            <p className="mt-1 text-xs text-[#64736b]">
              {selectedState === "All" ? "Across India" : selectedState}
              {" · "}
              {availableJobs.length}{" "}
              {availableJobs.length === 1 ? "job available" : "jobs available"}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start border border-[#dce5dc] bg-[#faf8ef] px-3 py-2 sm:self-center">
            <ShieldCheck className="h-4 w-4 text-[#0b6652]" />
            <span className="text-xs font-bold text-[#0b302a]">
              JobHir Opportunities
            </span>
          </div>
        </div>

        {/* LOADING */}
        {loadingJobs && (
          <div className="flex min-h-[300px] flex-col items-center justify-center border border-[#e0e5dd] bg-white">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-4 border-[#e5eee6]" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#0b302a] border-r-[#c8ae6a] border-t-transparent" />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#52645a]">
              Loading available jobs...
            </p>
          </div>
        )}

        {/* NO JOBS */}
        {!loadingJobs && availableJobs.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center border border-[#e0e5dd] bg-white px-5 py-12 text-center">
            <div className="max-w-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-[#dce5dc] bg-[#faf8ef] text-[#0b302a]">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-extrabold text-[#071c19]">
                No jobs found
              </h3>
              <p className="mt-2 text-sm text-[#64736b]">
                Try selecting another state to explore available jobs.
              </p>
              {selectedState !== "All" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedState("All");
                    setSelectedWorkType(null);
                  }}
                  className="mt-5 border border-[#c8ae6a] bg-[#0b302a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#12483d]"
                >
                  Show All India Jobs
                </button>
              )}
            </div>
          </div>
        )}

        {/* CATEGORY GRID */}
        {!loadingJobs && availableJobs.length > 0 && !selectedWorkType && (
          <section>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {workTypeCategories.map(({ workType, count }) => {
                const { icon: Icon, bg, color } =
                  getWorkTypeIconData(workType);

                return (
                  <button
                    key={workType}
                    type="button"
                    onClick={() => setSelectedWorkType(workType)}
                    className="jobhir-card group relative flex min-h-[174px] flex-col border border-[#e0e5dd] bg-white p-3.5 text-left sm:p-4"
                  >
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#e0e5dd]"
                        style={{ backgroundColor: bg, color }}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2.1} />
                      </div>

                      <span className="flex h-8 w-8 items-center justify-center border border-[#e6e9e1] bg-[#faf8ef] text-[#0b302a] transition group-hover:border-[#c8ae6a]">
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>

                    <h3 className="min-h-[38px] text-sm font-extrabold leading-5 text-[#071c19]">
                      {workType}
                    </h3>

                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-[#0b302a]">
                        {count}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#78877f]">
                        {count === 1 ? "Job" : "Jobs"}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-[#edf0e9] pt-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#78877f]">
                        Explore
                      </span>
                      <span className="text-[10px] font-extrabold text-[#0b6652]">
                        View Jobs
                      </span>
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
            <div className="mb-5 border border-[#e0e5dd] bg-white">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                {(() => {
                  const { icon: Icon, bg, color } =
                    getWorkTypeIconData(selectedWorkType);

                  return (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#e0e5dd] sm:h-14 sm:w-14"
                        style={{ backgroundColor: bg, color }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0b6652]">
                          Job Category
                        </span>
                        <h2 className="text-xl font-extrabold text-[#071c19] sm:text-2xl">
                          {selectedWorkType}
                        </h2>
                        <p className="mt-0.5 text-xs text-[#64736b]">
                          {categoryJobs.length}{" "}
                          {categoryJobs.length === 1 ? "job" : "jobs"} available
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <button
                  type="button"
                  onClick={() => setSelectedWorkType(null)}
                  className="inline-flex w-full items-center justify-center gap-2 border border-[#c8ae6a]/70 bg-[#faf8ef] px-4 py-2.5 text-sm font-bold text-[#0b302a] transition hover:bg-[#f3ecd8] sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Categories
                </button>
              </div>
            </div>

            {/* NO CATEGORY JOBS */}
            {categoryJobs.length === 0 && (
              <div className="border border-[#e0e5dd] bg-white px-6 py-12 text-center">
                <Search className="mx-auto h-8 w-8 text-[#78877f]" />
                <h3 className="mt-3 text-base font-extrabold text-[#071c19]">
                  No jobs found
                </h3>
                <p className="mt-1 text-sm text-[#64736b]">
                  There are currently no jobs in this category.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedWorkType(null)}
                  className="mt-5 inline-flex items-center gap-2 border border-[#c8ae6a] bg-[#0b302a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#12483d]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Browse Categories
                </button>
              </div>
            )}

            {/* JOB CARDS */}
            {categoryJobs.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryJobs.map((job) => {
                  const { icon: Icon, bg, color } =
                    getWorkTypeIconData(job?.workType || selectedWorkType);

                  const state = getJobState(job);
                  const district = getJobDistrict(job);
                  const address = getJobAddress(job);

                  return (
                    <article
                      key={job?._id || job?.id}
                      className="jobhir-card flex h-full flex-col overflow-hidden border border-[#e0e5dd] bg-white"
                    >
                      <div className="h-1 w-full bg-gradient-to-r from-[#0b302a] via-[#0b6652] to-[#c8ae6a]" />

                      <div className="flex flex-1 flex-col p-4">
                        {/* TITLE */}
                        <div className="mb-4 flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#e0e5dd]"
                              style={{ backgroundColor: bg, color }}
                            >
                              <Icon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-[#071c19]">
                                {job?.title || job?.workType || "Job Opportunity"}
                              </h3>
                              <p className="mt-0.5 text-[11px] font-bold text-[#0b6652]">
                                {job?.workType || selectedWorkType}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 border border-[#d8e8d9] bg-[#f0f8f0] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#23663b]">
                            Available
                          </span>
                        </div>

                        {/* DESCRIPTION */}
                        {job?.description && (
                          <p className="mb-4 line-clamp-3 text-xs leading-5 text-[#64736b]">
                            {job.description}
                          </p>
                        )}

                        {/* PAYMENT */}
                        <div className="mb-4 border border-[#e0e5dd] bg-gradient-to-br from-[#faf8ef] to-white p-3.5">
                          <div className="mb-1 flex items-center gap-1.5 text-[#0b6652]">
                            <IndianRupee className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Job Payment
                            </span>
                          </div>

                          <div className="text-xl font-black text-[#071c19]">
                            ₹{Number(job?.amount || 0).toLocaleString("en-IN")}
                          </div>
                        </div>

                        {/* DETAILS */}
                        <div className="space-y-3">
                          {job?.workType && (
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#f4f6f0] text-[#0b302a]">
                                <BriefcaseBusiness className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className={smallLabelClass}>Work</p>
                                <p className="truncate text-xs font-semibold text-[#334740]">
                                  {job.workType}
                                </p>
                              </div>
                            </div>
                          )}

                          {(state || district) && (
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#f4f6f0] text-[#0b302a]">
                                <MapPinned className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className={smallLabelClass}>Location</p>
                                <p className="truncate text-xs font-semibold text-[#334740]">
                                  {[district, state].filter(Boolean).join(", ")}
                                </p>
                              </div>
                            </div>
                          )}

                          {address && (
                            <div className="flex items-start gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#f4f6f0] text-[#0b302a]">
                                <MapPin className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className={smallLabelClass}>Address</p>
                                <p className="line-clamp-2 text-xs font-medium leading-4 text-[#52645a]">
                                  {address}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* APPLY */}
                        <div className="mt-auto pt-5">
                          <button
                            type="button"
                            onClick={() => handleApply(job)}
                            className="group flex w-full items-center justify-center gap-2 border border-[#c8ae6a] bg-[#0b302a] px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#12483d] hover:shadow-md active:scale-[0.98]"
                          >
                            Apply Now
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

      {/* QUICK ACTION BUTTONS */}
      <div className="flex w-full flex-wrap justify-center gap-2 px-3 pb-6 sm:px-5">
        <button
          type="button"
          onClick={() => navigate("/working-workers")}
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 border border-[#c8ae6a] bg-[#0b302a] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#12483d] sm:flex-none sm:px-5"
        >
          <BriefcaseBusiness size={18} />
          <span className="whitespace-nowrap">Now Workers</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/payment")}
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 border border-[#c8ae6a] bg-[#faf8ef] px-3 py-3 text-sm font-semibold text-[#0b302a] transition hover:bg-[#f3ecd8] sm:flex-none sm:px-5"
        >
          <CreditCard size={18} />
          <span className="whitespace-nowrap">Pay JobHir</span>
        </button>
      </div>

      {/* HEALTHCARE JOBS */}
      <section id="healthcare-jobs" className="scroll-mt-24">
        <HealthcareJobs />
      </section>

      {/* APPLICATION MODAL */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#071c19]/75 px-3 py-5 backdrop-blur-sm sm:px-5"
          onClick={handleCloseModal}
        >
          <div
            className="jobhir-scrollbar relative max-h-[94vh] w-full max-w-2xl overflow-y-auto border border-[#c8ae6a]/60 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 border-b border-[#c8ae6a]/60 bg-gradient-to-r from-[#071c19] via-[#0b302a] to-[#12483d] px-5 py-5 text-white shadow-md sm:px-6">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                aria-label="Close application form"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="text-[10px] font-bold uppercase tracking-widest text-[#e6d7a8]">
                Job Application
              </p>

              <h2 className="mt-1 pr-10 text-xl font-extrabold sm:text-2xl">
                Apply for {selectedJob?.title || "Job"}
              </h2>

              <div className="mt-3 inline-flex items-center gap-2 border border-[#c8ae6a]/50 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                <IndianRupee className="h-3.5 w-3.5 text-[#e6d7a8]" />
                Application Fee: ₹{amountInRupees || 0}
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="p-4 sm:p-6">
              <div className="grid gap-4">
                {/* NAME */}
                <div>
                  <label className={labelClass}>Your Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                {/* MOBILE */}
                <div>
                  <label className={labelClass}>Mobile Number</label>
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
                    autoComplete="tel-national"
                    className={inputClass}
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className={labelClass}>
                    Email{" "}
                    <span className="ml-1 font-normal text-[#78877f]">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>

                {/* JOB LOCATION */}
                <div className="overflow-hidden border border-[#dce5dc] bg-[#fafbf8]">
                  <div className="flex items-start gap-3 border-b border-[#e0e5dd] bg-[#f3f6ef] px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0b302a] text-[#e6d7a8]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[#071c19]">
                        Job Location
                      </p>
                      <p className="mt-0.5 text-xs text-[#64736b]">
                        Location provided by the job poster
                      </p>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="border border-[#e0e5dd] bg-white p-3">
                      <p className={smallLabelClass}>Address</p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-[#334740]">
                        {getJobAddress(selectedJob)}
                      </p>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {selectedJob?.location?.village && (
                        <div className="border border-[#e0e5dd] bg-white p-3">
                          <p className={smallLabelClass}>Village</p>
                          <p className="mt-1 truncate text-xs font-semibold text-[#334740]">
                            {selectedJob.location.village}
                          </p>
                        </div>
                      )}

                      {selectedJob?.location?.locality && (
                        <div className="border border-[#e0e5dd] bg-white p-3">
                          <p className={smallLabelClass}>Locality / Mohalla</p>
                          <p className="mt-1 truncate text-xs font-semibold text-[#334740]">
                            {selectedJob.location.locality}
                          </p>
                        </div>
                      )}

                      {getJobState(selectedJob) && (
                        <div className="border border-[#e0e5dd] bg-white p-3">
                          <p className={smallLabelClass}>State</p>
                          <p className="mt-1 truncate text-xs font-semibold text-[#334740]">
                            {getJobState(selectedJob)}
                          </p>
                        </div>
                      )}

                      {getJobDistrict(selectedJob) && (
                        <div className="border border-[#e0e5dd] bg-white p-3">
                          <p className={smallLabelClass}>District</p>
                          <p className="mt-1 truncate text-xs font-semibold text-[#334740]">
                            {getJobDistrict(selectedJob)}
                          </p>
                        </div>
                      )}

                      {selectedJob?.location?.postcode && (
                        <div className="border border-[#e0e5dd] bg-white p-3">
                          <p className={smallLabelClass}>PIN</p>
                          <p className="mt-1 text-xs font-semibold text-[#334740]">
                            {selectedJob.location.postcode}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* MAP */}
                    {selectedJob?.location?.latitude != null &&
                      selectedJob?.location?.longitude != null &&
                      Number.isFinite(Number(selectedJob.location.latitude)) &&
                      Number.isFinite(Number(selectedJob.location.longitude)) && (
                        <div className="mt-3 overflow-hidden border border-[#dce5dc] bg-white p-1">
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
                  <label className={labelClass}>Application Fee</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#52645a]">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amountInRupees}
                      onChange={(event) =>
                        setAmountInRupees(event.target.value)
                      }
                      min="1"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>

                {/* NOTE */}
                <div>
                  <label className={labelClass}>Note</label>
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
                  className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {error}
                </div>
              )}

              {/* PAYMENT INFO */}
              <div className="mt-5 border border-[#c8ae6a]/60 bg-[#faf8ef] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0b6652]" />
                    <div>
                      <p className="text-xs font-bold text-[#0b302a]">
                        Secure Application
                      </p>
                      <p className="mt-0.5 text-[11px] leading-4 text-[#64736b]">
                        You will be redirected to the secure payment page.
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 border border-[#e0e5dd] bg-white px-2.5 py-1.5 text-sm font-extrabold text-[#0b302a]">
                    ₹{amountInRupees || 0}
                  </span>
                </div>
              </div>

              {/* PAY */}
              <button
                type="button"
                onClick={createOrder}
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 border border-[#c8ae6a] bg-gradient-to-r from-[#071c19] via-[#0b302a] to-[#12483d] py-3.5 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay ₹{amountInRupees || 0} &amp; Apply
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[10px] leading-4 text-[#78877f]">
                By continuing, you agree to proceed with this job application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
