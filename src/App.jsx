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
// ======================================================

const getWorkTypeIconData = (workType) => {
  const type = normalizeWorkType(workType);

  const icons = {
    mason: {
      icon: Hammer,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      accent: "bg-orange-500",
      soft: "from-orange-50 to-white",
      hover: "group-hover:bg-orange-600",
      hoverText: "group-hover:text-white",
    },

    carpenter: {
      icon: Hammer,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      accent: "bg-amber-500",
      soft: "from-amber-50 to-white",
      hover: "group-hover:bg-amber-600",
      hoverText: "group-hover:text-white",
    },

    painter: {
      icon: Paintbrush,
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "border-pink-200",
      accent: "bg-pink-500",
      soft: "from-pink-50 to-white",
      hover: "group-hover:bg-pink-600",
      hoverText: "group-hover:text-white",
    },

    electrician: {
      icon: Zap,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      accent: "bg-yellow-500",
      soft: "from-yellow-50 to-white",
      hover: "group-hover:bg-yellow-500",
      hoverText: "group-hover:text-white",
    },

    plumber: {
      icon: Wrench,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      accent: "bg-blue-500",
      soft: "from-blue-50 to-white",
      hover: "group-hover:bg-blue-600",
      hoverText: "group-hover:text-white",
    },

    gardener: {
      icon: Sprout,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      accent: "bg-green-500",
      soft: "from-green-50 to-white",
      hover: "group-hover:bg-green-600",
      hoverText: "group-hover:text-white",
    },

    cleaner: {
      icon: Sparkles,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-200",
      accent: "bg-cyan-500",
      soft: "from-cyan-50 to-white",
      hover: "group-hover:bg-cyan-600",
      hoverText: "group-hover:text-white",
    },

    welder: {
      icon: Construction,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      accent: "bg-red-500",
      soft: "from-red-50 to-white",
      hover: "group-hover:bg-red-600",
      hoverText: "group-hover:text-white",
    },

    driver: {
      icon: Car,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-200",
      accent: "bg-violet-500",
      soft: "from-violet-50 to-white",
      hover: "group-hover:bg-violet-600",
      hoverText: "group-hover:text-white",
    },

    "construction worker": {
      icon: HardHat,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      accent: "bg-orange-500",
      soft: "from-orange-50 to-white",
      hover: "group-hover:bg-orange-600",
      hoverText: "group-hover:text-white",
    },

    helper: {
      icon: HandHelping,
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-200",
      accent: "bg-teal-500",
      soft: "from-teal-50 to-white",
      hover: "group-hover:bg-teal-600",
      hoverText: "group-hover:text-white",
    },

    "ac technician": {
      icon: Snowflake,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200",
      accent: "bg-sky-500",
      soft: "from-sky-50 to-white",
      hover: "group-hover:bg-sky-600",
      hoverText: "group-hover:text-white",
    },

    mechanic: {
      icon: Settings,
      color: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
      accent: "bg-slate-600",
      soft: "from-slate-50 to-white",
      hover: "group-hover:bg-slate-700",
      hoverText: "group-hover:text-white",
    },

    "tiles worker": {
      icon: Layers3,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      accent: "bg-indigo-500",
      soft: "from-indigo-50 to-white",
      hover: "group-hover:bg-indigo-600",
      hoverText: "group-hover:text-white",
    },

    "furniture worker": {
      icon: Sofa,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      accent: "bg-orange-500",
      soft: "from-orange-50 to-white",
      hover: "group-hover:bg-orange-600",
      hoverText: "group-hover:text-white",
    },

    "home care": {
      icon: HeartHandshake,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      accent: "bg-rose-500",
      soft: "from-rose-50 to-white",
      hover: "group-hover:bg-rose-600",
      hoverText: "group-hover:text-white",
    },

    "graphic designer": {
      icon: Palette,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-50",
      border: "border-fuchsia-200",
      accent: "bg-fuchsia-500",
      soft: "from-fuchsia-50 to-white",
      hover: "group-hover:bg-fuchsia-600",
      hoverText: "group-hover:text-white",
    },

    other: {
      icon: BriefcaseBusiness,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      accent: "bg-indigo-500",
      soft: "from-indigo-50 to-white",
      hover: "group-hover:bg-indigo-600",
      hoverText: "group-hover:text-white",
    },
  };

  return (
    icons[type] || {
      icon: BriefcaseBusiness,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      accent: "bg-indigo-500",
      soft: "from-indigo-50 to-white",
      hover: "group-hover:bg-indigo-600",
      hoverText: "group-hover:text-white",
    }
  );
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
      background:linear-gradient(135deg,#2563eb,#7c3aed);
      border:3px solid #ffffff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 14px rgba(37,99,235,.45);
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
  // CUSTOM CSS
  // ====================================================

  useEffect(() => {
    const style = document.createElement("style");

    style.setAttribute("data-jobhir-style", "true");

    style.innerHTML = `
      @keyframes jobhirMarquee {
        0% {
          transform: translateX(100%);
        }

        100% {
          transform: translateX(-100%);
        }
      }

      .jobhir-marquee {
        display: inline-block;
        white-space: nowrap;
        animation: jobhirMarquee 18s linear infinite;
      }

      .jobhir-location-marker {
        background: transparent !important;
        border: none !important;
      }

      .jobhir-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .jobhir-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
      }

      .jobhir-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(#2563eb, #7c3aed);
        border-radius: 10px;
      }

      .jobhir-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #6366f1 #f1f5f9;
      }
    `;

    document.head.appendChild(style);

    return () => {
      style.remove();
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
          new Set([
            ...INDIA_STATES,
            ...apiStates,
          ])
        ).sort((a, b) =>
          String(a).localeCompare(String(b))
        );

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

        const ids = Array.isArray(
          response.data?.appliedJobIds
        )
          ? response.data.appliedJobIds
          : [];

        setAppliedJobs(ids);
      } catch (err) {
        console.error(
          "Applied jobs fetch error:",
          err
        );
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

    const selected = String(selectedState)
      .trim()
      .toLowerCase();

    return jobs.filter((job) => {
      return (
        String(getJobState(job))
          .trim()
          .toLowerCase() === selected
      );
    });
  }, [jobs, selectedState]);

  // ====================================================
  // AVAILABLE JOBS
  // ====================================================

  const availableJobs = useMemo(() => {
    return filteredJobs.filter(
      (job) =>
        !appliedJobs.includes(job?._id)
    );
  }, [filteredJobs, appliedJobs]);

  // ====================================================
  // AVAILABLE WORK TYPES
  // ====================================================

  const availableWorkTypes = useMemo(() => {
    return Array.from(
      new Set([
        ...WORK_TYPES,
        ...jobs
          .map((job) => job?.workType)
          .filter(Boolean),
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
            normalizeWorkType(job?.workType) ===
            normalizeWorkType(workType)
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
  }, [
    availableJobs,
    selectedWorkType,
  ]);

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
    setNote(
      `Applying for ${job?.title || "job"}`
    );
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
      setError(
        "Please enter a valid 10 digit mobile number."
      );
      return;
    }

    if (
      !amountInRupees ||
      Number(amountInRupees) <= 0
    ) {
      setError(
        "Please enter a valid application fee."
      );
      return;
    }

    if (!selectedJob?._id) {
      setError(
        "Please select a job first."
      );
      return;
    }

    try {
      setError("");
      setLoading(true);

      const amount = Math.round(
        Number(amountInRupees) * 100
      );

      localStorage.setItem(
        "mobileNumber",
        mobileNumber
      );

      const response = await axios.post(
        `${API_BASE}/create-order`,
        {
          amount,
          customerName:
            customerName.trim(),
          mobileNumber,
          email: email.trim(),
          note: note.trim(),
          jobId: selectedJob._id,
          location:
            selectedJob.location || null,
        }
      );

      const checkoutUrl =
        response.data?.checkoutPageUrl;

      if (!checkoutUrl) {
        setError(
          "Unable to get checkout URL. Please try again."
        );
        return;
      }

      window.open(
        checkoutUrl,
        "_blank"
      );

      handleCloseModal();
    } catch (err) {
      console.error(
        "Error creating order:",
        err
      );

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
    document
      .getElementById("jobs")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const scrollToHealthcare = () => {
    document
      .getElementById("healthcare-jobs")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900">

      {/* ==================================================
          HEADER
      ================================================== */}

      <Header
        onOfferJobClick={() =>
          navigate("/offer-job")
        }
      />

      {/* ==================================================
          TOP MARQUEE
      ================================================== */}

      <div className="w-full overflow-hidden border-b border-amber-400/20 bg-slate-950 py-2.5 text-white shadow-sm">
        <div className="jobhir-marquee text-[11px] font-semibold tracking-wide sm:text-xs">

          <span className="text-slate-300">
            {currentTime}
          </span>

          <span className="mx-5 text-amber-400">
            •
          </span>

          <span>
            Find genuine job opportunities near you
          </span>

          <span className="mx-5 text-amber-400">
            •
          </span>

          <span>
            100% Secure &amp; Safe
          </span>

          <span className="mx-5 text-amber-400">
            •
          </span>

          <span>
            JobHir — Jobs for Everyone
          </span>

        </div>
      </div>

      {/* ==================================================
          TOP ACTION AREA
      ================================================== */}

      <section className="w-full px-3 pt-4 sm:px-5 lg:px-8 xl:px-10">
        <div className="w-full border border-blue-100 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="min-w-0 text-center lg:text-left">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-xs">
                Job Search
              </p>

              <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                Find Your Next Job
              </h1>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Search genuine job opportunities across India.
              </p>

            </div>

            {/* RIGHT */}

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">

              <button
                type="button"
                onClick={() =>
                  navigate("/offer-job")
                }
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
              >
                + Post a Job
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/worker-register")
                }
                className="w-full border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100 sm:w-auto"
              >
                Register
              </button>

              <select
                value={selectedState}
                onChange={(event) => {
                  setSelectedState(
                    event.target.value
                  );

                  setSelectedWorkType(null);

                  setTimeout(
                    scrollToJobs,
                    50
                  );
                }}
                className="h-11 w-full border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:w-52"
              >
                <option value="All">
                  All India
                </option>

                {stateList.map((state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                ))}
              </select>

            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          STATE SUMMARY
      ================================================== */}

      <section
        id="jobs"
        className="w-full scroll-mt-24 px-3 pt-3 sm:px-5 lg:px-8 xl:px-10"
      >
        <div className="relative w-full overflow-hidden border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-purple-50 px-4 py-3 shadow-sm">

          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600" />

          <div className="flex items-center justify-between gap-3 pl-2">

            <div className="min-w-0">

              <p className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                Showing jobs from
              </p>

              <div className="mt-1 flex items-center gap-2">

                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-sm shadow-sm">
                  🇮🇳
                </span>

                <p className="truncate text-sm font-extrabold text-slate-800 sm:text-base">
                  {selectedState === "All"
                    ? "All India"
                    : selectedState}
                </p>

              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">

              <div className="hidden text-right sm:block">

                <p className="text-xs font-semibold text-slate-400">
                  {selectedWorkType ||
                    "Available Jobs"}
                </p>

              </div>

              <div className="flex h-10 min-w-[48px] items-center justify-center border border-blue-100 bg-white px-3 shadow-sm">

                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-base font-extrabold text-transparent">
                  {selectedWorkType
                    ? categoryJobs.length
                    : availableJobs.length}
                </span>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN JOB AREA
      ================================================== */}

      <main className="w-full px-3 py-6 sm:px-5 sm:py-8 lg:px-8 xl:px-10">

        {/* ==================================================
            LOADING
        ================================================== */}

        {loadingJobs && (
          <div className="flex min-h-[350px] items-center justify-center">

            <div className="relative h-16 w-16">

              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />

              <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-600 border-r-purple-600 border-t-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />

              </div>

            </div>

          </div>
        )}

        {/* ==================================================
            NO JOBS
        ================================================== */}

        {!loadingJobs &&
          availableJobs.length === 0 && (
            <div className="flex min-h-[350px] items-center justify-center">

              <div className="w-full max-w-lg border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                  <Search className="h-7 w-7 text-indigo-600" />
                </div>

                <p className="text-lg font-extrabold text-slate-800">
                  No jobs found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try selecting another state.
                </p>

              </div>

            </div>
          )}

       {/* ==================================================
    CATEGORY VIEW
================================================== */}

{!loadingJobs &&
  availableJobs.length > 0 &&
  !selectedWorkType && (
    <section className="mt-2">

      {/* SECTION HEADER */}

      <div className="mb-7 border-b border-slate-200 pb-5">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <span className="h-1 w-9 bg-gradient-to-r from-blue-600 to-purple-600" />

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-indigo-600">
                Explore Opportunities
              </span>

            </div>

            

          </div>

          {/* TOTAL */}

          <div className="flex w-fit items-center gap-3 border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <div className="flex h-9 w-9 items-center justify-center bg-indigo-50 text-indigo-600">

              <BriefcaseBusiness
                className="h-4.5 w-4.5"
                strokeWidth={2.2}
              />

            </div>

            <div>

              <p className="text-lg font-black leading-none text-slate-900">
                {availableJobs.length}
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Jobs Available
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* CATEGORY GRID */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

        {workTypeCategories.map(
          ({ workType, count }) => {

            const {
              icon: Icon,
              color,
              bg,
              border,
              accent,
              soft,
              hover,
              hoverText,
            } = getWorkTypeIconData(workType);

            return (
              <button
                key={workType}
                type="button"
                onClick={() =>
                  setSelectedWorkType(workType)
                }
                className="
                  group relative overflow-hidden
                  border border-slate-200
                  bg-white text-left
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-slate-300
                  hover:shadow-xl
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  focus:ring-offset-2
                "
              >

                {/* COLOR TOP LINE */}

                <div
                  className={`h-1 w-full ${accent}`}
                />

                {/* SOFT BACKGROUND */}

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${soft} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative p-4">

                  {/* ICON + ARROW */}

                  <div className="mb-5 flex items-center justify-between">

                    <div
                      className={`
                        flex h-12 w-12
                        items-center justify-center
                        border ${border} ${bg} ${color}
                        transition-all duration-300
                        ${hover} ${hoverText}
                        group-hover:scale-110
                        group-hover:shadow-md
                      `}
                    >

                      <Icon
                        className="h-6 w-6"
                        strokeWidth={2.2}
                      />

                    </div>

                    <div
                      className="
                        flex h-8 w-8
                        items-center justify-center
                        border border-slate-100
                        bg-white
                        text-slate-300
                        transition-all duration-300
                        group-hover:border-slate-200
                        group-hover:text-slate-700
                      "
                    >

                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      />

                    </div>

                  </div>


                  {/* CATEGORY NAME */}

                  <h3 className="min-h-[40px] text-sm font-black leading-5 text-slate-800 transition-colors group-hover:text-slate-950">
                    {workType}
                  </h3>


                  {/* COUNT */}

                  <div className="mt-3 flex items-baseline gap-1.5">

                    <span
                      className={`
                        text-xl font-black
                        ${color}
                      `}
                    >
                      {count}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {count === 1
                        ? "Job"
                        : "Jobs"}
                    </span>

                  </div>


                  {/* BOTTOM */}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Explore
                    </span>

                    <span
                      className={`
                        text-[10px]
                        font-black
                        ${color}
                      `}
                    >
                      View Jobs
                    </span>

                  </div>

                </div>

              </button>
            );
          }
        )}

      </div>

    </section>
  )}

        {/* ==================================================
            SELECTED CATEGORY
        ================================================== */}

        {!loadingJobs &&
          selectedWorkType && (
            <section className="mt-2">

              {/* CATEGORY HEADER */}

              <div className="mb-6 border border-slate-200 bg-white">

                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

                  <div className="flex items-center gap-4">

                    {/* ICON */}

                    {(() => {
  const {
    icon: Icon,
    color,
    bg,
    border,
    accent,
  } = getWorkTypeIconData(
    selectedWorkType
  );

                      return (
                        <div
  className={`
    flex h-12 w-12 shrink-0
    items-center justify-center
    border ${border} ${bg} ${color}
    sm:h-14 sm:w-14
  `}
>

                          <Icon
                            className="h-6 w-6"
                            strokeWidth={2}
                          />

                        </div>
                      );
                    })()}

                    <div>

                      <div className="mb-1 flex items-center gap-2">

                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                          Job Category
                        </span>

                      </div>

                      <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                        {selectedWorkType}
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {categoryJobs.length}{" "}
                        {categoryJobs.length === 1
                          ? "job"
                          : "jobs"}{" "}
                        available in this category
                      </p>

                    </div>

                  </div>

                  {/* BACK BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(null)
                    }
                    className="inline-flex w-full items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:w-auto"
                  >

                    <ArrowLeft className="h-4 w-4" />

                    All Categories

                  </button>

                </div>

              </div>

              {/* NO CATEGORY JOBS */}

              {categoryJobs.length === 0 && (
                <div className="border border-slate-200 bg-white px-6 py-14 text-center">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-slate-200 bg-slate-50">

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
                    onClick={() =>
                      setSelectedWorkType(null)
                    }
                    className="mt-5 inline-flex items-center gap-2 bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >

                    <ArrowLeft className="h-4 w-4" />

                    Browse Categories

                  </button>

                </div>
              )}

              {/* JOB GRID */}

              {categoryJobs.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                  {categoryJobs.map((job) => {

                    const {
  icon: Icon,
  color,
  bg,
  border,
  accent,
} = getWorkTypeIconData(
  job?.workType || selectedWorkType
);

                    const state =
                      getJobState(job);

                    const district =
                      getJobDistrict(job);

                    const address =
                      getJobAddress(job);

                    return (
                      <article
                        key={
                          job?._id ||
                          job?.id
                        }
                        className="group relative flex h-full flex-col overflow-hidden border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg"
                      >

                        {/* TOP ACCENT */}

                        <div className={`h-1 w-full ${accent}`} />

                        <div className="flex flex-1 flex-col p-4">

                          {/* TITLE ROW */}

                          <div className="mb-4 flex items-start justify-between gap-3">

                            <div className="flex min-w-0 items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-indigo-100 bg-indigo-50 text-indigo-600">

                                <Icon
                                  className="h-5 w-5"
                                  strokeWidth={2}
                                />

                              </div>

                              <div className="min-w-0">

                                <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-900">
                                  {job?.title ||
                                    job?.workType ||
                                    "Job Opportunity"}
                                </h3>

                                <p className="mt-0.5 text-[11px] font-medium text-indigo-600">
                                  {job?.workType ||
                                    selectedWorkType}
                                </p>

                              </div>

                            </div>

                            {/* STATUS */}

                            <span className="shrink-0 border border-emerald-100 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                              Available
                            </span>

                          </div>

                          {/* DESCRIPTION */}

                          {job?.description && (
                            <p className="mb-4 line-clamp-3 text-xs leading-5 text-slate-500">
                              {job.description}
                            </p>
                          )}

                          {/* AMOUNT */}

                          <div className="mb-4 border border-indigo-100 bg-indigo-50/60 p-3">

                            <div className="mb-1 flex items-center gap-1.5">

                              <IndianRupee className="h-3.5 w-3.5 text-indigo-600" />

                              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                                Job Payment
                              </span>

                            </div>

                            <div className="text-xl font-black text-slate-900">

                              ₹
                              {Number(
                                job?.amount || 0
                              ).toLocaleString(
                                "en-IN"
                              )}

                            </div>

                          </div>

                          {/* DETAILS */}

                          <div className="space-y-2.5">

                            {/* WORK */}

                            {job?.workType && (
                              <div className="flex items-center gap-2.5">

                                <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-50 text-slate-500">

                                  <BriefcaseBusiness className="h-3.5 w-3.5" />

                                </div>

                                <div className="min-w-0">

                                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    Work
                                  </p>

                                  <p className="truncate text-xs font-semibold text-slate-700">
                                    {job.workType}
                                  </p>

                                </div>

                              </div>
                            )}

                            {/* LOCATION */}

                            {(state || district) && (
                              <div className="flex items-center gap-2.5">

                                <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-50 text-slate-500">

                                  <MapPinned className="h-3.5 w-3.5" />

                                </div>

                                <div className="min-w-0">

                                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    Location
                                  </p>

                                  <p className="truncate text-xs font-semibold text-slate-700">
                                    {[
                                      district,
                                      state,
                                    ]
                                      .filter(
                                        Boolean
                                      )
                                      .join(
                                        ", "
                                      )}
                                  </p>

                                </div>

                              </div>
                            )}

                            {/* ADDRESS */}

                            {address && (
                              <div className="flex items-start gap-2.5">

                                <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-slate-50 text-slate-500">

                                  <MapPin className="h-3.5 w-3.5" />

                                </div>

                                <div className="min-w-0">

                                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    Address
                                  </p>

                                  <p className="line-clamp-2 text-xs font-medium leading-4 text-slate-600">
                                    {address}
                                  </p>

                                </div>

                              </div>
                            )}

                          </div>

                          {/* APPLY BUTTON */}

                          <div className="mt-auto pt-5">

                            <button
                              type="button"
                              onClick={() =>
                                handleApply(
                                  job
                                )
                              }
                              className="flex w-full items-center justify-center gap-2 bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.98]"
                            >

                              Apply Now

                              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />

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
          HEALTHCARE JOBS
      ================================================== */}

      <section
        id="healthcare-jobs"
        className="scroll-mt-24"
      >
        <HealthcareJobs />
      </section>

      {/* ==================================================
          APPLICATION MODAL
      ================================================== */}

      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 px-3 py-5 backdrop-blur-sm sm:px-5"
          onClick={handleCloseModal}
        >

          <div
            className="jobhir-scrollbar relative max-h-[94vh] w-full max-w-2xl overflow-y-auto border border-white/20 bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 px-5 py-5 text-white shadow-md sm:px-6">

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center bg-white/10 text-lg text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                ✕
              </button>

              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                Job Application
              </p>

              <h2 className="mt-1 pr-10 text-xl font-extrabold sm:text-2xl">
                Apply for{" "}
                {selectedJob?.title ||
                  "Job"}
              </h2>

              <div className="mt-3 inline-flex bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                Application Fee: ₹
                {amountInRupees || 0}
              </div>

            </div>

            {/* BODY */}

            <div className="p-5 sm:p-6">

              <div className="grid gap-4">

                {/* NAME */}

                <div>

                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Your Name
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(
                        event.target.value
                      )
                    }
                    placeholder="Enter your name"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                {/* MOBILE */}

                <div>

                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(event) =>
                      setMobileNumber(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-1.5 block text-xs font-bold text-slate-600">

                    Email

                    <span className="ml-1 font-normal text-slate-400">
                      (Optional)
                    </span>

                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="Enter your email"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                {/* LOCATION */}

                <div className="overflow-hidden border border-indigo-100 bg-gradient-to-br from-blue-50 to-purple-50">

                  <div className="flex items-start gap-3 border-b border-indigo-100 px-4 py-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-lg text-white">
                      📍
                    </div>

                    <div>

                      <p className="text-sm font-extrabold text-slate-800">
                        Job Location
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Location provided by the job poster
                      </p>

                    </div>

                  </div>

                  <div className="p-3">

                    <div className="border border-slate-100 bg-white p-3">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Address
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-700">
                        {getJobAddress(
                          selectedJob
                        )}
                      </p>

                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">

                      {selectedJob?.location?.village && (
                        <div className="border border-slate-100 bg-white p-3">

                          <p className="text-[10px] font-bold text-slate-400">
                            Village
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {
                              selectedJob
                                .location
                                .village
                            }
                          </p>

                        </div>
                      )}

                      {selectedJob?.location?.locality && (
                        <div className="border border-slate-100 bg-white p-3">

                          <p className="text-[10px] font-bold text-slate-400">
                            Locality / Mohalla
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {
                              selectedJob
                                .location
                                .locality
                            }
                          </p>

                        </div>
                      )}

                      {getJobState(
                        selectedJob
                      ) && (
                        <div className="border border-slate-100 bg-white p-3">

                          <p className="text-[10px] font-bold text-slate-400">
                            State
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {getJobState(
                              selectedJob
                            )}
                          </p>

                        </div>
                      )}

                      {getJobDistrict(
                        selectedJob
                      ) && (
                        <div className="border border-slate-100 bg-white p-3">

                          <p className="text-[10px] font-bold text-slate-400">
                            District
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {getJobDistrict(
                              selectedJob
                            )}
                          </p>

                        </div>
                      )}

                      {selectedJob?.location?.postcode && (
                        <div className="border border-slate-100 bg-white p-3">

                          <p className="text-[10px] font-bold text-slate-400">
                            PIN
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-700">
                            {
                              selectedJob
                                .location
                                .postcode
                            }
                          </p>

                        </div>
                      )}

                    </div>

                    {/* MAP */}

                    {selectedJob?.location?.latitude != null &&
                      selectedJob?.location?.longitude != null && (
                        <div className="mt-3 overflow-hidden border border-indigo-100 bg-white p-1">

                          <div className="h-56 w-full overflow-hidden sm:h-64">

                            <MapContainer
                              center={[
                                Number(
                                  selectedJob
                                    .location
                                    .latitude
                                ),
                                Number(
                                  selectedJob
                                    .location
                                    .longitude
                                ),
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
                                  Number(
                                    selectedJob
                                      .location
                                      .latitude
                                  ),
                                  Number(
                                    selectedJob
                                      .location
                                      .longitude
                                  ),
                                ]}
                              />

                              <Marker
                                position={[
                                  Number(
                                    selectedJob
                                      .location
                                      .latitude
                                  ),
                                  Number(
                                    selectedJob
                                      .location
                                      .longitude
                                  ),
                                ]}
                                icon={
                                  locationIcon
                                }
                              >

                                <Popup>

                                  <strong>
                                    Job Location
                                  </strong>

                                  <br />

                                  {getJobAddress(
                                    selectedJob
                                  )}

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
                    Application Fee
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      value={amountInRupees}
                      onChange={(event) =>
                        setAmountInRupees(
                          event.target.value
                        )
                      }
                      min="1"
                      className="w-full border border-slate-200 bg-slate-50 p-3 pl-8 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    onChange={(event) =>
                      setNote(
                        event.target.value
                      )
                    }
                    placeholder="Note"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-4 border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* PAYMENT INFO */}

              <div className="mt-5 border border-amber-100 bg-amber-50 p-3">

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <p className="text-xs font-bold text-amber-800">
                      Secure Application
                    </p>

                    <p className="mt-0.5 text-[11px] text-amber-700">
                      You will be redirected to the secure payment page.
                    </p>

                  </div>

                  <span className="shrink-0 bg-white px-2 py-1 text-xs font-extrabold text-amber-700 shadow-sm">
                    ₹
                    {amountInRupees || 0}
                  </span>

                </div>

              </div>

              {/* PAY */}

              <button
                type="button"
                onClick={createOrder}
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹
                    {amountInRupees || 0}
                    {" & "}
                    Apply
                  </>
                )}

              </button>

              <p className="mt-3 text-center text-[10px] text-slate-400">
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