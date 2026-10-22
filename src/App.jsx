import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MobileBottomNav from "./components/MobileBottomNav.jsx";
import OfferBanner from "./components/OfferBanner.jsx";
import JobsSection from "./components/JobsSection.jsx";
import GetStartedPanel from "./components/GetStartedPanel.jsx";



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
} from "lucide-react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HealthcareJobs from "./HealthcareJobs";
import JobStatsSection from "./components/JobStatsSection";


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
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
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

    .jobhir-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #64748b #f1f5f9;
    }

    .jobhir-scrollbar::-webkit-scrollbar {
      width: 6px;
    }

    .jobhir-scrollbar::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 20px;
    }

    .jobhir-scrollbar::-webkit-scrollbar-thumb {
      background: #64748b;
      border-radius: 20px;
    }

    /* Main application */
    .jobhir-app {
  min-height: 100vh;
  background: #faf8ef !important;
  color: #172d27;
}

    .jobhir-app * {
      box-sizing: border-box;
    }

    /* Smooth interactions */
    .jobhir-app button {
      transition:
        background-color .2s ease,
        border-color .2s ease,
        box-shadow .2s ease,
        transform .2s ease;
    }

    /* Main content */
    .jobhir-app main {
  border-color: #e6e0cd !important;
}

    /* Search and filter panel */
   .jobhir-app .jobhir-top-panel {
  background: linear-gradient(135deg, #071c19, #0b302a, #123d32) !important;
  border: 1px solid rgba(200, 174, 106, .4) !important;
  border-radius: 20px !important;
  box-shadow: 0 18px 45px rgba(7, 28, 25, .16);
}

    /* Job cards and content cards */
    .jobhir-app main article {
      overflow: hidden;
      border: 1px solid #e2e8f0 !important;
      border-radius: 18px !important;
      background: #ffffff !important;
      box-shadow: 0 4px 18px rgba(15, 23, 42, .05);
      transition:
        border-color .2s ease,
        box-shadow .2s ease,
        transform .2s ease;
    }

    .jobhir-app main article:hover {
      border-color: #c7d2fe !important;
      box-shadow: 0 12px 28px rgba(79, 70, 229, .10);
      transform: translateY(-2px);
    }

    /* Category cards */
    .jobhir-app main section button {
      border-radius: 18px !important;
      overflow: hidden;
    }

    .jobhir-app main section button .rounded-lg {
      border-radius: 12px !important;
    }

    /* Inputs */
    .jobhir-app input,
    .jobhir-app select,
    .jobhir-app textarea {
      border-radius: 12px !important;
      border-color: #dce2ec;
      transition:
        border-color .2s ease,
        box-shadow .2s ease;
    }

    .jobhir-app input:focus,
    .jobhir-app select:focus,
    .jobhir-app textarea:focus {
      outline: none;
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, .12);
    }

    /* Buttons inside job cards */
    .jobhir-app main article button {
      border-radius: 12px;
    }

    /* Bottom action buttons */
    .jobhir-app .jobhir-bottom-actions {
      gap: 10px;
    }

    .jobhir-app .jobhir-bottom-actions button {
      border-radius: 14px !important;
      box-shadow: 0 4px 12px rgba(15, 23, 42, .08);
    }

    /* Application and payment modal */
    .jobhir-app .jobhir-scrollbar {
      border-radius: 20px;
      box-shadow: 0 24px 70px rgba(15, 23, 42, .20);
    }

    .jobhir-app .jobhir-scrollbar input,
    .jobhir-app .jobhir-scrollbar select {
      min-height: 44px;
    }

    /* Map */
    .jobhir-app .leaflet-container {
      border-radius: 16px;
      overflow: hidden;
    }

    /* Mobile layout */
    @media (max-width: 640px) {
      .jobhir-app main {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }

      .jobhir-app .jobhir-top-panel {
        border-radius: 16px !important;
        padding: 14px !important;
      }

      .jobhir-app main article {
        border-radius: 16px !important;
      }

      .jobhir-app main section button {
        border-radius: 15px !important;
      }

      .jobhir-app .jobhir-bottom-actions {
        padding: 10px 8px;
        flex-wrap: wrap;
      }

      .jobhir-app .jobhir-scrollbar {
        max-width: calc(100vw - 24px);
        border-radius: 18px;
      }
    }

    /* Accessibility: reduce animation when requested */
    @media (prefers-reduced-motion: reduce) {
      .jobhir-app *,
      .jobhir-marquee {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important;
      }
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
    <div className="jobhir-app min-h-screen w-full overflow-x-hidden bg-[#faf8ef] text-[#172d27]">

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
<div className="w-full overflow-hidden border-b border-[#c8ae6a]/40 bg-[#071c19] py-1 text-white shadow-sm">
  <div className="jobhir-marquee text-[11px] font-semibold tracking-wide sm:text-xs">

    <span className="text-slate-300">
      {currentTime}
    </span>

    <span className="mx-5 text-amber-400">•</span>

    <span>Find genuine job opportunities near you</span>

    <span className="mx-5 text-amber-400">•</span>

    <span>100% Secure &amp; Safe</span>

    <span className="mx-5 text-amber-400">•</span>

    <span>JobHir — Jobs for Everyone</span>

  </div>
</div>

{/* ==================================================
    JOBHIR — COMPACT PREMIUM ACTION AREA
================================================== */}

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
   
  
{/* ==================================================
    JOBHIR WORKER REGISTRATION — ANIMATED OFFER
================================================== */}

<OfferBanner onRegister={() => navigate("/worker-register")} />




 





      {/* ==================================================
          STATE SUMMARY
      ================================================== */}

      {/* <section
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
      </section> */}

      {/* ==================================================
          MAIN JOB AREA
      ================================================== */}

  
<main
  id="jobs"
  className="scroll-mt-24 w-full px-3 pb-8 pt-4 sm:px-5 lg:px-8 xl:px-10"
>
  <JobsSection
    loading={loadingJobs}
    selectedState={selectedState}
    availableJobs={availableJobs}
    categories={workTypeCategories}
    selectedWorkType={selectedWorkType}
    categoryJobs={categoryJobs}
    onSelectWorkType={setSelectedWorkType}
    onApply={handleApply}
    onShowAll={() => setSelectedState("All")}
  />
</main>

<div className="jobhir-bottom-actions mx-auto grid w-full max-w-3xl grid-cols-2 gap-3 px-3 py-5">
  {/* NOW WORKERS */}
  <button
    type="button"
    onClick={() => navigate("/working-workers")}
    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-800 p-3.5 text-left text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] sm:p-4"
  >
    <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />

    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
      <BriefcaseBusiness size={22} />
    </span>

    <span className="relative min-w-0 flex-1">
      <span className="flex items-center gap-1.5 text-sm font-extrabold">
        <span className="whitespace-nowrap">Now Workers</span>

        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-80" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
        </span>
      </span>

      <span className="block truncate text-[11px] font-medium text-indigo-100">
        Workers available now
      </span>
    </span>

    <ArrowRight className="relative hidden h-4 w-4 shrink-0 transition group-hover:translate-x-1 sm:block" />
  </button>

  {/* PAY JOBHIR */}
  <button
    type="button"
    onClick={() => navigate("/payment")}
    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-3.5 text-left text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] sm:p-4"
  >
    <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />

    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
      <CreditCard size={22} />
    </span>

    <span className="relative min-w-0 flex-1">
      <span className="block whitespace-nowrap text-sm font-extrabold">
        Pay JobHir
      </span>

      <span className="block truncate text-[11px] font-medium text-emerald-100">
        Safe &amp; secure payment
      </span>
    </span>

    <ArrowRight className="relative hidden h-4 w-4 shrink-0 transition group-hover:translate-x-1 sm:block" />
  </button>
</div>

<JobStatsSection
  totalJobs={jobs.length}
  availableJobsCount={availableJobs.length}
  is24x7={true}
/>

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

      <Footer
  totalJobs={jobs.length}
  availableJobs={availableJobs.length}
  is24x7={true}
/>
<MobileBottomNav />
    </div>
  );
}