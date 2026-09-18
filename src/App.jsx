import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Users,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  X,
  IndianRupee,
  Clock3,
  Building2,
  UserRound,
  CheckCircle2,
  Navigation,
  Sparkles,
  Zap,
  BadgeCheck,
  Menu,
} from "lucide-react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HealthcareJobs from "./HealthcareJobs";

// ======================================================
// LEAFLET LOCATION MARKER
// ======================================================

const locationIcon = new L.DivIcon({
  className: "jobhir-location-marker",

  html: `
    <div style="
      width:34px;
      height:34px;
      background:linear-gradient(135deg,#2563eb,#7c3aed);
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 14px rgba(37,99,235,.45);
      position:relative;
    ">
      <div style="
        width:10px;
        height:10px;
        background:white;
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
    if (position) {
      map.setView(position, 16);
    }
  }, [map, position]);

  return null;
}

// ======================================================
// INDIA STATES
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
// CATEGORY ICONS
// ======================================================

const CATEGORY_ICONS = {
  Mason: "🧱",
  Carpenter: "🪚",
  Painter: "🎨",
  Electrician: "⚡",
  Plumber: "🔧",
  Gardener: "🌱",
  Cleaner: "🧹",
  Welder: "🔥",
  Driver: "🚗",
  "Construction Worker": "🏗️",
  Helper: "🤝",
  "AC Technician": "❄️",
  Mechanic: "⚙️",
  "Tiles Worker": "◈",
  "Furniture Worker": "🪑",
  "Home Care": "❤️",
  "Graphic Designer": "🖥️",
  Other: "💼",
};

// ======================================================
// NORMALIZE
// ======================================================

const normalizeWorkType = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

// ======================================================
// APP
// ======================================================

export default function App() {
  const navigate = useNavigate();

  // ====================================================
  // JOB STATES
  // ====================================================

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // ====================================================
  // FILTERS
  // ====================================================

  const [stateList, setStateList] = useState(INDIA_STATES);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedWorkType, setSelectedWorkType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ====================================================
  // SELECTED JOB
  // ====================================================

  const [selectedJob, setSelectedJob] = useState(null);

  // ====================================================
  // PAYMENT
  // ====================================================

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amountInRupees, setAmountInRupees] = useState(10);
  const [note, setNote] = useState("Order for job");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(true);

  // ====================================================
  // LIVE TIME
  // ====================================================

  const [currentTime, setCurrentTime] = useState("");

  // ====================================================
  // CUSTOM CSS
  // ====================================================

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes jobhirScrollText {
        0% {
          transform: translateX(100%);
        }

        100% {
          transform: translateX(-100%);
        }
      }

      .jobhir-scroller {
        white-space: nowrap;
        display: inline-block;
        animation: jobhirScrollText 18s linear infinite;
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

      .jobhir-grid-bg {
        background-image:
          linear-gradient(rgba(37,99,235,.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(37,99,235,.035) 1px, transparent 1px);
        background-size: 34px 34px;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
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
    const fetchJobs = async () => {
      try {
        const res = await axios.get(
          "https://jbackend-h963.onrender.com/jobs"
        );

        const fetchedJobs = res.data?.jobs || [];

        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);

        const apiStates = [
          ...new Set(
            fetchedJobs
              .map(
                (job) =>
                  job?.state ||
                  job?.location?.state
              )
              .filter(Boolean)
          ),
        ];

        const mergedStates = Array.from(
          new Set([
            ...INDIA_STATES,
            ...apiStates,
          ])
        ).sort();

        setStateList(mergedStates);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // ====================================================
  // FETCH APPLIED JOBS
  // ====================================================

  useEffect(() => {
    const mobile = localStorage.getItem("mobileNumber");

    if (!mobile) return;

    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(
          `https://jbackend-h963.onrender.com/applied-jobs/${mobile}`
        );

        setAppliedJobs(
          res.data?.appliedJobIds || []
        );
      } catch (err) {
        console.error(
          "Applied jobs fetch error:",
          err
        );
      }
    };

    fetchAppliedJobs();
  }, []);

  // ====================================================
  // FILTER JOBS
  // ====================================================

  useEffect(() => {
    let result = [...jobs];

    if (selectedState !== "All") {
      result = result.filter((job) => {
        const jobState =
          job?.state ||
          job?.location?.state ||
          "";

        return (
          String(jobState)
            .trim()
            .toLowerCase() ===
          String(selectedState)
            .trim()
            .toLowerCase()
        );
      });
    }

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((job) => {
        const searchable = [
          job?.title,
          job?.description,
          job?.workType,
          job?.state,
          job?.district,
          job?.location?.state,
          job?.location?.district,
          job?.location?.address,
          job?.location?.village,
          job?.location?.locality,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      });
    }

    setFilteredJobs(result);
  }, [selectedState, searchQuery, jobs]);

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
  // WORK TYPES
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
            normalizeWorkType(
              job?.workType
            ) ===
            normalizeWorkType(
              workType
            )
        ).length,
      }))
      .filter(
        (item) => item.count > 0
      );
  }, [
    availableWorkTypes,
    availableJobs,
  ]);

  // ====================================================
  // CATEGORY JOBS
  // ====================================================

  const categoryJobs = selectedWorkType
    ? availableJobs.filter(
        (job) =>
          normalizeWorkType(
            job?.workType
          ) ===
          normalizeWorkType(
            selectedWorkType
          )
      )
    : [];

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const handleCloseModal = () => {
    setSelectedJob(null);

    setCustomerName("");
    setMobileNumber("");
    setEmail("");
    setAmountInRupees(10);
    setNote("Order for job");
    setError("");
  };

  // ====================================================
  // CREATE PAYMENT ORDER
  // ====================================================

  const createOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      alert(
        "Please enter a valid 10 digit mobile number."
      );
      return;
    }

    if (
      !amountInRupees ||
      Number(amountInRupees) <= 0
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!selectedJob) {
      alert("Please select a job first.");
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

      const res = await axios.post(
        "https://jbackend-h963.onrender.com/create-order",
        {
          amount,

          customerName:
            customerName.trim(),

          mobileNumber,

          email:
            email.trim(),

          note,

          jobId:
            selectedJob._id || null,

          location:
            selectedJob.location || null,
        }
      );

      if (res.data?.checkoutPageUrl) {
        window.open(
          res.data.checkoutPageUrl,
          "_blank"
        );

        handleCloseModal();
      } else {
        setError(
          "Unable to get checkout URL."
        );
      }
    } catch (err) {
      console.error(
        "Error creating order:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // OPEN APPLY MODAL
  // ====================================================

  const openApplyModal = (job) => {
    setSelectedJob(job);

    setAmountInRupees(10);

    setNote(
      `Applying for ${job.title}`
    );

    setError("");
  };

  // ====================================================
  // CLEAR SEARCH
  // ====================================================

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("All");
    setSelectedWorkType(null);
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
          LIVE TOP BAR
      ================================================== */}

      <div className="w-full overflow-hidden border-b border-indigo-900/20 bg-slate-950 py-2 text-white">
        <div className="overflow-hidden">
          <p className="jobhir-scroller text-[10px] font-semibold tracking-wide sm:text-xs">
            {currentTime}
            {"   •   "}
            Find work. Find workers. Grow together.
            {"   •   "}
            JobHir connects people with opportunities.
            {"   •   "}
            Safe &amp; Secure Job Platform
          </p>
        </div>
      </div>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="jobhir-grid-bg relative w-full overflow-hidden border-b border-slate-200 bg-white">

        {/* Decorative circles */}

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-purple-100/50 blur-3xl" />

        <div className="relative mx-auto w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">

          <div className="mx-auto max-w-7xl">

            {/* HERO CONTENT */}

            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">

              <div>

                {/* SMALL LABEL */}

                <div className="mb-4 inline-flex items-center gap-2 border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">

                  <Sparkles
                    size={14}
                    strokeWidth={2.5}
                  />

                  India's Growing Job Network

                </div>

                {/* TITLE */}

                <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">

                  Find the right job.
                  <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Build your future.
                  </span>

                </h1>

                {/* DESCRIPTION */}

                <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">

                  Discover jobs near you across India.
                  Search by skill, work category,
                  state or location and apply
                  directly from JobHir.

                </p>

                {/* SEARCH */}

                <div className="mt-7 max-w-3xl">

                  <div className="flex flex-col gap-2 border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60 sm:flex-row">

                    <div className="flex min-w-0 flex-1 items-center gap-3 px-3">

                      <Search
                        size={20}
                        className="shrink-0 text-blue-600"
                      />

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(
                            e.target.value
                          )
                        }
                        placeholder="Search jobs, skills, location..."
                        className="h-11 min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                      />

                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() =>
                            setSearchQuery("")
                          }
                          className="text-slate-400 transition hover:text-slate-700"
                        >
                          <X size={17} />
                        </button>
                      )}

                    </div>

                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(
                          e.target.value
                        );
                        setSelectedWorkType(null);
                      }}
                      className="h-11 border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 sm:w-52"
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

                    <button
                      type="button"
                      onClick={() => {
                        if (!searchQuery.trim()) {
                          document
                            .getElementById(
                              "job-categories"
                            )
                            ?.scrollIntoView({
                              behavior: "smooth",
                            });
                        }
                      }}
                      className="flex h-11 items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 text-sm font-extrabold text-white transition hover:brightness-105"
                    >
                      Search
                      <ArrowRight size={17} />
                    </button>

                  </div>

                </div>

                {/* HERO ACTIONS */}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/worker-register")
                    }
                    className="flex items-center justify-center gap-2 border border-blue-600 bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    <UserRound size={17} />
                    Register as Worker
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/offer-job")
                    }
                    className="flex items-center justify-center gap-2 border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                  >
                    <BriefcaseBusiness size={17} />
                    Post a Job
                  </button>

                </div>

              </div>

              {/* HERO STATS PANEL */}

              <div className="relative">

                <div className="border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-6">

                  <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-5">

                    <div>

                      <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                        JobHir
                      </p>

                      <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                        Opportunities near you
                      </h2>

                    </div>

                    <div className="flex h-11 w-11 items-center justify-center bg-blue-50 text-blue-600">
                      <Zap size={22} />
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="border border-blue-100 bg-blue-50 p-4">
                      <BriefcaseBusiness
                        size={20}
                        className="text-blue-600"
                      />

                      <p className="mt-3 text-2xl font-extrabold text-slate-900">
                        {jobs.length}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Total Jobs
                      </p>
                    </div>

                    <div className="border border-purple-100 bg-purple-50 p-4">
                      <Users
                        size={20}
                        className="text-purple-600"
                      />

                      <p className="mt-3 text-2xl font-extrabold text-slate-900">
                        {availableJobs.length}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Available Now
                      </p>
                    </div>

                    <div className="border border-emerald-100 bg-emerald-50 p-4">
                      <MapPin
                        size={20}
                        className="text-emerald-600"
                      />

                      <p className="mt-3 text-2xl font-extrabold text-slate-900">
                        {stateList.length}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Locations
                      </p>
                    </div>

                    <div className="border border-amber-100 bg-amber-50 p-4">
                      <ShieldCheck
                        size={20}
                        className="text-amber-600"
                      />

                      <p className="mt-3 text-2xl font-extrabold text-slate-900">
                        24/7
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Online Access
                      </p>
                    </div>

                  </div>

                  <div className="mt-4 flex items-start gap-3 border border-slate-200 bg-slate-50 p-4">

                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <p className="text-xs leading-5 text-slate-600">
                      Browse opportunities,
                      select your category and
                      apply directly through JobHir.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          QUICK INFO STRIP
      ================================================== */}

      <section className="w-full border-b border-slate-200 bg-white">

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 divide-y divide-slate-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-10">

          <div className="flex items-center gap-3 py-4 sm:px-5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-blue-50 text-blue-600">
              <Search size={19} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Search Easily
              </p>

              <p className="text-xs text-slate-500">
                Find jobs by skill or location
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3 py-4 sm:px-5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-purple-50 text-purple-600">
              <MapPin size={19} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Local Opportunities
              </p>

              <p className="text-xs text-slate-500">
                Explore work across India
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3 py-4 sm:px-5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-600">
              <BadgeCheck size={19} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Simple Application
              </p>

              <p className="text-xs text-slate-500">
                Apply directly to listed jobs
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          STATE SUMMARY
      ================================================== */}

      <section className="w-full px-4 pt-7 sm:px-6 lg:px-10">

        <div className="mx-auto w-full max-w-7xl">

          <div className="flex flex-col gap-4 border border-blue-100 bg-gradient-to-r from-white via-blue-50/70 to-purple-50/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-blue-600 shadow-sm">
                <Navigation size={20} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Currently showing
                </p>

                <p className="mt-1 text-base font-extrabold text-slate-900">
                  {selectedState === "All"
                    ? "All India"
                    : selectedState}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="text-right">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Available Jobs
                </p>

                <p className="text-xl font-extrabold text-indigo-700">
                  {selectedWorkType
                    ? categoryJobs.length
                    : availableJobs.length}
                </p>

              </div>

              {(searchQuery ||
                selectedState !== "All" ||
                selectedWorkType) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600"
                >
                  Clear
                </button>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="w-full px-4 py-8 sm:px-6 lg:px-10 lg:py-10">

        <div className="mx-auto w-full max-w-7xl">

          {/* =================================================
              LOADING
          ================================================= */}

          {loadingJobs && (
            <div className="py-20">

              <div className="mx-auto max-w-xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-blue-100 bg-blue-50">

                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-blue-100 border-t-blue-600" />

                </div>

                <h3 className="mt-5 text-base font-extrabold text-slate-800">
                  Finding available jobs...
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Please wait while we load the latest opportunities.
                </p>

              </div>

            </div>
          )}

          {/* =================================================
              NO JOBS
          ================================================= */}

          {!loadingJobs &&
            availableJobs.length === 0 && (

              <div className="py-12">

                <div className="mx-auto max-w-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center bg-blue-50 text-blue-600">
                    <Search size={28} />
                  </div>

                  <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                    No jobs found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    We could not find an available
                    job matching your current
                    search or location filter.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105"
                  >
                    View All Jobs
                    <ArrowRight size={17} />
                  </button>

                </div>

              </div>
            )}

          {/* =================================================
              CATEGORIES
          ================================================= */}

          {!loadingJobs &&
            availableJobs.length > 0 &&
            !selectedWorkType && (

              <section id="job-categories">

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <div className="h-1 w-8 bg-blue-600" />

                      <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                        Explore Jobs
                      </span>

                    </div>

                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      Choose your work category
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm text-slate-500">
                      Select a category to discover
                      available opportunities matching
                      your skills.
                    </p>

                  </div>

                  <div className="border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
                    {workTypeCategories.length} categories available
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

                  {workTypeCategories.map(
                    ({
                      workType,
                      count,
                    }) => (

                      <button
                        key={workType}
                        type="button"
                        onClick={() =>
                          setSelectedWorkType(
                            workType
                          )
                        }
                        className="group relative overflow-hidden border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/60"
                      >

                        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600" />

                        <div className="flex items-start justify-between gap-2">

                          <div className="flex h-11 w-11 items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 text-xl transition group-hover:from-blue-600 group-hover:to-purple-600 group-hover:grayscale-0">
                            {CATEGORY_ICONS[workType] ||
                              "💼"}
                          </div>

                          <span className="text-[11px] font-extrabold text-blue-600">
                            {count}
                          </span>

                        </div>

                        <h3 className="mt-5 line-clamp-2 min-h-[40px] text-sm font-extrabold leading-5 text-slate-800 transition group-hover:text-blue-700">
                          {workType}
                        </h3>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                          <span className="text-[10px] font-semibold text-slate-400">
                            Available
                          </span>

                          <ArrowRight
                            size={15}
                            className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                          />

                        </div>

                      </button>

                    )
                  )}

                </div>

              </section>
            )}

          {/* =================================================
              SELECTED CATEGORY
          ================================================= */}

          {!loadingJobs &&
            selectedWorkType && (

              <section>

                {/* CATEGORY HEADER */}

                <div className="mb-6 border border-indigo-100 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-5 text-white shadow-lg shadow-indigo-100 sm:p-6">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedWorkType(null)
                        }
                        className="mb-4 flex items-center gap-2 text-xs font-bold text-blue-100 transition hover:text-white"
                      >
                        <ChevronLeft size={16} />
                        Back to Categories
                      </button>

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center bg-white/10 text-2xl">
                          {CATEGORY_ICONS[
                            selectedWorkType
                          ] || "💼"}
                        </div>

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                            Work Category
                          </p>

                          <h2 className="mt-1 text-2xl font-extrabold">
                            {selectedWorkType}
                          </h2>

                        </div>

                      </div>

                    </div>

                    <div className="border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-100">
                        Available
                      </p>

                      <p className="mt-1 text-3xl font-extrabold">
                        {categoryJobs.length}
                      </p>

                    </div>

                  </div>

                </div>

                {/* EMPTY */}

                {categoryJobs.length === 0 && (

                  <div className="border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center bg-blue-50 text-blue-600">
                      <Search size={27} />
                    </div>

                    <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                      No jobs in this category
                    </h3>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedWorkType(null)
                      }
                      className="mt-5 bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white"
                    >
                      Back to Categories
                    </button>

                  </div>
                )}

                {/* =================================================
                    JOB GRID
                ================================================= */}

                {categoryJobs.length > 0 && (

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {categoryJobs.map((job) => (

                      <article
                        key={job._id}
                        className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
                      >

                        {/* CARD TOP */}

                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

                        <div className="flex flex-1 flex-col p-5">

                          {/* JOB HEADER */}

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <div className="mb-2 flex items-center gap-2">

                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
                                  {job.workType ||
                                    "Job"}
                                </span>

                              </div>

                              <h2 className="line-clamp-2 text-lg font-extrabold leading-6 text-slate-900 transition group-hover:text-blue-700">
                                {job.title}
                              </h2>

                            </div>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-blue-50 text-blue-600">
                              <BriefcaseBusiness
                                size={18}
                              />
                            </div>

                          </div>

                          {/* DESCRIPTION */}

                          <p className="mt-3 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-500">
                            {job.description ||
                              "No description available."}
                          </p>

                          {/* SALARY */}

                          <div className="mt-4 flex items-center justify-between border border-emerald-100 bg-emerald-50 px-3 py-3">

                            <div className="flex items-center gap-2">

                              <div className="flex h-8 w-8 items-center justify-center bg-white text-emerald-600">
                                <IndianRupee
                                  size={16}
                                />
                              </div>

                              <div>

                                <p className="text-[10px] font-semibold text-emerald-700">
                                  Job Amount
                                </p>

                                <p className="text-sm font-extrabold text-emerald-700">
                                  ₹{job.amount}
                                </p>

                              </div>

                            </div>

                            <CheckCircle2
                              size={17}
                              className="text-emerald-500"
                            />

                          </div>

                          {/* DETAILS */}

                          <div className="mt-4 space-y-2">

                            {(job.state ||
                              job.location?.state) && (

                              <div className="flex items-center gap-3 border-b border-slate-100 pb-2">

                                <MapPin
                                  size={16}
                                  className="shrink-0 text-blue-600"
                                />

                                <div className="min-w-0">

                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    State
                                  </p>

                                  <p className="truncate text-xs font-bold text-slate-700">
                                    {job.state ||
                                      job.location
                                        ?.state}
                                  </p>

                                </div>

                              </div>
                            )}

                            {job.district && (

                              <div className="flex items-center gap-3 border-b border-slate-100 pb-2">

                                <Building2
                                  size={16}
                                  className="shrink-0 text-purple-600"
                                />

                                <div className="min-w-0">

                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    District
                                  </p>

                                  <p className="truncate text-xs font-bold text-slate-700">
                                    {job.district}
                                  </p>

                                </div>

                              </div>
                            )}

                            {job.location?.address && (

                              <div className="flex items-start gap-3">

                                <Navigation
                                  size={16}
                                  className="mt-0.5 shrink-0 text-slate-400"
                                />

                                <div className="min-w-0">

                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Location
                                  </p>

                                  <p className="line-clamp-2 text-xs leading-5 text-slate-600">
                                    {job.location.address}
                                  </p>

                                </div>

                              </div>
                            )}

                          </div>

                          {/* POSTED */}

                          {job.createdAt && (

                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                              <div className="flex items-center gap-1.5 text-slate-400">

                                <Clock3 size={13} />

                                <span className="text-[10px] font-semibold">
                                  Posted
                                </span>

                              </div>

                              <span className="text-[10px] font-bold text-slate-500">
                                {formatDistanceToNow(
                                  new Date(
                                    job.createdAt
                                  ),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>

                            </div>
                          )}

                          {/* APPLY */}

                          <button
                            type="button"
                            onClick={() =>
                              openApplyModal(job)
                            }
                            className="mt-5 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-100 transition hover:brightness-105 hover:shadow-lg"
                          >
                            Apply Now
                            <ArrowRight
                              size={17}
                            />
                          </button>

                        </div>

                      </article>

                    ))}

                  </div>
                )}

              </section>
            )}

        </div>

      </main>

      {/* ==================================================
          APPLY MODAL
      ================================================== */}

      {selectedJob && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/75 px-3 py-4 backdrop-blur-sm sm:px-5"
          onClick={handleCloseModal}
        >

          <div
            className="jobhir-scrollbar relative max-h-[95vh] w-full max-w-2xl overflow-y-auto border border-white/20 bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 px-5 py-5 text-white shadow-md sm:px-6">

              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center bg-white/10 text-white transition hover:bg-white/20"
              >
                <X size={18} />
              </button>

              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                Job Application
              </p>

              <h2 className="mt-1 pr-12 text-xl font-extrabold sm:text-2xl">
                Apply for {selectedJob.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2">

                <span className="border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold">
                  Application Fee: ₹
                  {amountInRupees || 0}
                </span>

                {selectedJob.workType && (
                  <span className="border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold">
                    {selectedJob.workType}
                  </span>
                )}

              </div>

            </div>

            {/* MODAL BODY */}

            <div className="p-5 sm:p-6">

              {/* JOB SUMMARY */}

              <div className="mb-5 grid grid-cols-2 gap-3">

                <div className="border border-emerald-100 bg-emerald-50 p-3">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Job Amount
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-emerald-700">
                    ₹{selectedJob.amount}
                  </p>

                </div>

                <div className="border border-blue-100 bg-blue-50 p-3">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Location
                  </p>

                  <p className="mt-1 line-clamp-1 text-sm font-extrabold text-slate-700">
                    {selectedJob.district ||
                      selectedJob.location?.district ||
                      selectedJob.state ||
                      selectedJob.location?.state ||
                      "India"}
                  </p>

                </div>

              </div>

              <div className="grid gap-4">

                {/* NAME */}

                <div>

                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Your Name
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) =>
                      setCustomerName(
                        e.target.value
                      )
                    }
                    placeholder="Enter your name"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    onChange={(e) =>
                      setMobileNumber(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter your email"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                {/* LOCATION */}

                <div className="overflow-hidden border border-indigo-100 bg-slate-50">

                  <div className="flex items-center gap-3 border-b border-indigo-100 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3">

                    <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      <MapPin size={19} />
                    </div>

                    <div>

                      <p className="text-sm font-extrabold text-slate-800">
                        Job Location
                      </p>

                      <p className="text-xs text-slate-500">
                        Location provided by the job poster
                      </p>

                    </div>

                  </div>

                  <div className="p-3">

                    <div className="border border-slate-200 bg-white p-3">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Address
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-700">
                        {selectedJob.location?.address ||
                          "Location provided by employer"}
                      </p>

                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">

                      {selectedJob.location?.village && (
                        <LocationDetail
                          label="Village"
                          value={
                            selectedJob
                              .location
                              .village
                          }
                        />
                      )}

                      {selectedJob.location?.locality && (
                        <LocationDetail
                          label="Locality / Mohalla"
                          value={
                            selectedJob
                              .location
                              .locality
                          }
                        />
                      )}

                      {(selectedJob.location?.state ||
                        selectedJob.state) && (
                        <LocationDetail
                          label="State"
                          value={
                            selectedJob
                              .location
                              ?.state ||
                            selectedJob.state
                          }
                        />
                      )}

                      {(selectedJob.location?.district ||
                        selectedJob.district) && (
                        <LocationDetail
                          label="District"
                          value={
                            selectedJob
                              .location
                              ?.district ||
                            selectedJob.district
                          }
                        />
                      )}

                      {selectedJob.location?.postcode && (
                        <LocationDetail
                          label="PIN"
                          value={
                            selectedJob
                              .location
                              .postcode
                          }
                        />
                      )}

                    </div>

                    {/* MAP */}

                    {selectedJob.location?.latitude != null &&
                      selectedJob.location?.longitude != null && (

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
                                icon={locationIcon}
                              >

                                <Popup>

                                  <strong>
                                    Job Location
                                  </strong>

                                  <br />

                                  {selectedJob
                                    .location
                                    ?.address ||
                                    "Job Location"}

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
                      onChange={(e) =>
                        setAmountInRupees(
                          e.target.value
                        )
                      }
                      min="1"
                      placeholder="Application Fee"
                      className="w-full border border-slate-200 bg-slate-50 p-3 pl-8 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    onChange={(e) =>
                      setNote(
                        e.target.value
                      )
                    }
                    placeholder="Note"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* ERROR */}

              {error && (

                <div className="mt-4 border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>

              )}

              {/* PAYMENT NOTICE */}

              <div className="mt-5 flex items-start gap-3 border border-amber-100 bg-amber-50 p-4">

                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div className="min-w-0">

                  <p className="text-xs font-extrabold text-amber-800">
                    Secure Application
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-amber-700">
                    You will be redirected to
                    the secure payment page to
                    complete your application.
                  </p>

                </div>

                <span className="ml-auto shrink-0 text-sm font-extrabold text-amber-800">
                  ₹{amountInRupees || 0}
                </span>

              </div>

              {/* PAY */}

              <button
                type="button"
                onClick={createOrder}
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{amountInRupees || 0}
                    {" & "}
                    Apply
                    <ArrowRight size={17} />
                  </>
                )}

              </button>

              <p className="mt-3 text-center text-[10px] leading-5 text-slate-400">
                By continuing, you agree to
                proceed with this job application.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          HEALTHCARE JOBS
      ================================================== */}

      <HealthcareJobs />

      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />

    </div>
  );
}

// ======================================================
// LOCATION DETAIL COMPONENT
// ======================================================

function LocationDetail({ label, value }) {
  return (
    <div className="border border-slate-200 bg-white p-3">

      <p className="text-[10px] font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}