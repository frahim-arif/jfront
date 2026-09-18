
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

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HealthcareJobs from "./HealthcareJobs";

// ======================================================
// API
// ======================================================

const API = "https://jbackend-h963.onrender.com";

// ======================================================
// CUSTOM MAP MARKER
// ======================================================

const locationIcon = new L.DivIcon({
  className: "jobhir-location-marker",
  html: `
    <div class="jobhir-marker-wrap">
      <div class="jobhir-marker-pin">
        <div class="jobhir-marker-dot"></div>
      </div>
    </div>
  `,
  iconSize: [42, 52],
  iconAnchor: [21, 52],
  popupAnchor: [0, -48],
});

// ======================================================
// MAP CENTER
// ======================================================

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16, {
        animate: true,
      });
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
  mason: "🧱",
  carpenter: "🪚",
  painter: "🎨",
  electrician: "⚡",
  plumber: "🔧",
  gardener: "🌱",
  cleaner: "🧹",
  welder: "🔥",
  driver: "🚗",
  "construction worker": "🏗️",
  helper: "🤝",
  "ac technician": "❄️",
  mechanic: "⚙️",
  "tiles worker": "🔲",
  "furniture worker": "🪑",
  "home care": "❤️",
  "graphic designer": "🖥️",
  other: "💼",
};

const getCategoryIcon = (value) =>
  CATEGORY_ICONS[String(value || "").trim().toLowerCase()] ||
  "💼";

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
  // JOB DATA
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

  // ====================================================
  // MODAL
  // ====================================================

  const [selectedJob, setSelectedJob] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");

  const [amountInRupees, setAmountInRupees] = useState(10);
  const [note, setNote] = useState("Order for job");

  // ====================================================
  // LOADING
  // ====================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(true);

  // ====================================================
  // TIME
  // ====================================================

  const [currentTime, setCurrentTime] = useState("");

  // ====================================================
  // CUSTOM CSS
  // ====================================================

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes jobhir-marquee {
        0% {
          transform: translateX(100%);
        }
        100% {
          transform: translateX(-100%);
        }
      }

      @keyframes jobhir-pulse {
        0%, 100% {
          transform: scale(1);
          opacity: .8;
        }
        50% {
          transform: scale(1.08);
          opacity: 1;
        }
      }

      @keyframes jobhir-float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }

      .jobhir-marquee {
        white-space: nowrap;
        display: inline-block;
        animation: jobhir-marquee 18s linear infinite;
      }

      .jobhir-location-marker {
        background: transparent !important;
        border: none !important;
      }

      .jobhir-marker-wrap {
        width: 42px;
        height: 52px;
        position: relative;
      }

      .jobhir-marker-pin {
        width: 38px;
        height: 38px;
        position: absolute;
        left: 2px;
        top: 2px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: linear-gradient(135deg,#2563eb,#4f46e5,#7c3aed);
        border: 3px solid #fff;
        box-shadow: 0 8px 20px rgba(37,99,235,.35);
      }

      .jobhir-marker-dot {
        position: absolute;
        width: 10px;
        height: 10px;
        left: 11px;
        top: 11px;
        border-radius: 50%;
        background: #fff;
      }

      .jobhir-scrollbar::-webkit-scrollbar {
        width: 6px;
      }

      .jobhir-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
      }

      .jobhir-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(#2563eb,#7c3aed);
        border-radius: 20px;
      }

      .jobhir-map .leaflet-container {
        width: 100%;
        height: 100%;
      }

      .jobhir-float {
        animation: jobhir-float 3s ease-in-out infinite;
      }

      .leaflet-control-attribution {
        font-size: 8px !important;
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
        const res = await axios.get(`${API}/jobs`);

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
          `${API}/applied-jobs/${mobile}`
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
  // FILTER BY STATE
  // ====================================================

  useEffect(() => {
    if (selectedState === "All") {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter((job) => {
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

    setFilteredJobs(filtered);
  }, [selectedState, jobs]);

  // ====================================================
  // AVAILABLE JOBS
  // ====================================================

  const availableJobs = useMemo(
    () =>
      filteredJobs.filter(
        (job) =>
          !appliedJobs.includes(job?._id)
      ),
    [filteredJobs, appliedJobs]
  );

  // ====================================================
  // WORK TYPES
  // ====================================================

  const availableWorkTypes = useMemo(
    () =>
      Array.from(
        new Set([
          ...WORK_TYPES,
          ...jobs
            .map((job) => job?.workType)
            .filter(Boolean),
        ])
      ),
    [jobs]
  );

  // ====================================================
  // CATEGORY DATA
  // ====================================================

  const workTypeCategories = useMemo(
    () =>
      availableWorkTypes
        .map((workType) => ({
          workType,
          count: availableJobs.filter(
            (job) =>
              normalizeWorkType(
                job?.workType
              ) ===
              normalizeWorkType(workType)
          ).length,
        }))
        .filter((item) => item.count > 0),
    [availableWorkTypes, availableJobs]
  );

  // ====================================================
  // CATEGORY JOBS
  // ====================================================

  const categoryJobs = useMemo(
    () =>
      selectedWorkType
        ? availableJobs.filter(
            (job) =>
              normalizeWorkType(
                job?.workType
              ) ===
              normalizeWorkType(
                selectedWorkType
              )
          )
        : [],
    [availableJobs, selectedWorkType]
  );

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
  // CREATE ORDER
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
        `${API}/create-order`,
        {
          amount,
          customerName:
            customerName.trim(),
          mobileNumber,
          email: email.trim(),
          note,
          jobId: selectedJob._id || null,
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
  // OPEN JOB
  // ====================================================

  const openJob = (job) => {
    setSelectedJob(job);
    setAmountInRupees(10);
    setNote(`Applying for ${job.title}`);
    setError("");

    setTimeout(() => {
      document
        .getElementById("jobhir-application-modal")
        ?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
    }, 50);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f9fc] text-slate-900">

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

      <div className="overflow-hidden border-b border-indigo-500/20 bg-gradient-to-r from-[#1d4ed8] via-[#4f46e5] to-[#7c3aed] py-2.5 text-white">

        <div className="jobhir-marquee text-[11px] font-bold tracking-wide sm:text-xs">
          {currentTime}
          <span className="mx-5 opacity-60">•</span>
          Find genuine job opportunities near you
          <span className="mx-5 opacity-60">•</span>
          Secure &amp; simple application process
          <span className="mx-5 opacity-60">•</span>
          JobHir — Jobs for Everyone
        </div>

      </div>

      {/* ==================================================
          HERO / SEARCH AREA
      ================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">

        {/* Decorative background */}

        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-purple-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-10 lg:px-10 xl:px-12">

          <div className="grid items-center gap-7 lg:grid-cols-[1fr_auto]">

            {/* HERO TEXT */}

            <div>

              

              
              {/* STATS */}

              <div className="mt-5 flex flex-wrap gap-2.5">

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-sm">
                    💼
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      {availableJobs.length}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Available Jobs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-sm">
                    🛠️
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      {workTypeCategories.length}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Categories
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-sm">
                    🇮🇳
                  </span>
                  <div>
                    <p className="text-sm font-black text-slate-800">
                      All India
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400">
                      Job coverage
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* ACTION PANEL */}

            <div className="w-full lg:w-[390px]">

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/60">

                <div className="mb-2.5 flex items-center gap-2 px-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    🔎
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-800">
                      Find jobs in your area
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Select your preferred state
                    </p>
                  </div>
                </div>

                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedWorkType(null);
                  }}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="All">
                    🇮🇳 All India
                  </option>

                  {stateList.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>

                <div className="mt-2 grid grid-cols-2 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/worker-register")
                    }
                    className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-xs font-extrabold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    👤 Register
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/offer-job")
                    }
                    className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-3 py-2.5 text-xs font-extrabold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    + Post a Job
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          LOCATION SUMMARY
      ================================================== */}

      <section className="mx-auto max-w-[1600px] px-4 pt-5 sm:px-6 lg:px-10 xl:px-12">

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600" />

          <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-lg shadow-sm">
                📍
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Currently showing
                </p>

                <p className="truncate text-base font-black text-slate-800">
                  {selectedState === "All"
                    ? "Jobs across India"
                    : selectedState}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2">

              {selectedWorkType && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedWorkType(null)
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  ← Categories
                </button>
              )}

              <div className="rounded-xl bg-slate-950 px-4 py-2 text-center text-white shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  {selectedWorkType
                    ? "Category Jobs"
                    : "Available"}
                </p>

                <p className="text-lg font-black leading-5">
                  {selectedWorkType
                    ? categoryJobs.length
                    : availableJobs.length}
                </p>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 xl:px-12">

        {/* LOADING */}

        {loadingJobs && (
          <div className="flex min-h-[400px] items-center justify-center">

            <div className="text-center">

              <div className="relative mx-auto h-16 w-16">

                <div className="absolute inset-0 rounded-full border-4 border-blue-100" />

                <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-600 border-r-purple-600 border-t-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                </div>

              </div>

              <p className="mt-4 text-sm font-bold text-slate-500">
                Finding available jobs...
              </p>

            </div>

          </div>
        )}

        {/* NO JOBS */}

        {!loadingJobs &&
          availableJobs.length === 0 && (
            <div className="flex min-h-[420px] items-center justify-center">

              <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">

                <div className="jobhir-float mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-purple-100 text-4xl">
                  🔎
                </div>

                <h2 className="mt-5 text-2xl font-black text-slate-900">
                  No jobs available
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  We couldn't find any available jobs for
                  the selected location. Try another state
                  or check again later.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedState("All");
                    setSelectedWorkType(null);
                  }}
                  className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
                >
                  View All India Jobs
                </button>

              </div>

            </div>
          )}

        {/* ==================================================
            CATEGORY VIEW
        ================================================== */}

        {!loadingJobs &&
          availableJobs.length > 0 &&
          !selectedWorkType && (
            <section>

              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <div className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-700">
                    Explore Opportunities
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    Choose your work category
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select a category to discover jobs matching
                    your skills.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold text-slate-400">
                    Showing
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    {availableJobs.length} jobs
                  </p>
                </div>

              </div>

              {/* CATEGORY GRID */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">

                {workTypeCategories.map(
                  ({ workType, count }) => (
                    <button
                      key={workType}
                      type="button"
                      onClick={() =>
                        setSelectedWorkType(workType)
                      }
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/60 sm:p-5"
                    >

                      {/* Gradient line */}

                      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

                      {/* Icon */}

                      <div className="flex items-start justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-2xl transition-all duration-300 group-hover:scale-110 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:shadow-lg">
                          {getCategoryIcon(workType)}
                        </div>

                        <span className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-500">
                          {count}
                        </span>

                      </div>

                      <h3 className="mt-5 min-h-[40px] text-sm font-black leading-5 text-slate-800 transition group-hover:text-blue-700 sm:text-base">
                        {workType}
                      </h3>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                        <span className="text-[10px] font-bold text-slate-400">
                          Jobs available
                        </span>

                        <span className="text-xs font-black text-blue-600 transition group-hover:translate-x-1">
                          View →
                        </span>

                      </div>

                    </button>
                  )
                )}

              </div>

            </section>
          )}

        {/* ==================================================
            SELECTED CATEGORY
        ================================================== */}

        {!loadingJobs &&
          selectedWorkType && (
            <section>

              {/* CATEGORY HERO */}

              <div className="relative mb-6 overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl sm:p-7">

                <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-purple-600/20 blur-3xl" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-sm">
                      {getCategoryIcon(
                        selectedWorkType
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-blue-300">
                        Work Category
                      </p>

                      <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                        {selectedWorkType}
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Jobs available in{" "}
                        {selectedState === "All"
                          ? "India"
                          : selectedState}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedWorkType(null)
                      }
                      className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
                    >
                      ← All Categories
                    </button>

                    <div className="rounded-xl bg-white px-4 py-2.5 text-center text-slate-900">
                      <p className="text-[9px] font-bold uppercase text-slate-400">
                        Jobs
                      </p>
                      <p className="text-xl font-black leading-5 text-indigo-700">
                        {categoryJobs.length}
                      </p>
                    </div>

                  </div>

                </div>
              </div>

              {/* EMPTY */}

              {categoryJobs.length === 0 && (
                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                    🔎
                  </div>

                  <h3 className="mt-4 text-xl font-black text-slate-800">
                    No jobs in this category
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Try another category or state.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(null)
                    }
                    className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
                  >
                    Back to Categories
                  </button>

                </div>
              )}

              {/* JOB GRID */}

              {categoryJobs.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                  {categoryJobs.map((job) => {

                    const jobState =
                      job?.state ||
                      job?.location?.state ||
                      "India";

                    const jobDistrict =
                      job?.district ||
                      job?.location?.district;

                    return (
                      <article
                        key={job._id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70"
                      >

                        {/* CARD TOP */}

                        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                        <div className="flex flex-1 flex-col p-5">

                          {/* BADGES */}

                          <div className="flex items-center justify-between gap-2">

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                              {job.workType || "Job"}
                            </span>

                            <span className="text-[10px] font-bold text-slate-400">
                              JOB
                            </span>

                          </div>

                          {/* TITLE */}

                          <h3 className="mt-4 line-clamp-2 min-h-[48px] text-lg font-black leading-6 text-slate-900 transition group-hover:text-blue-700">
                            {job.title || "Job Opportunity"}
                          </h3>

                          {/* DESCRIPTION */}

                          <p className="mt-2 line-clamp-3 min-h-[60px] text-xs leading-5 text-slate-500">
                            {job.description ||
                              "No description available for this job."}
                          </p>

                          {/* AMOUNT */}

                          <div className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5">

                            <div className="flex items-center justify-between">

                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                  Job Amount
                                </p>

                                <p className="mt-0.5 text-2xl font-black text-emerald-700">
                                  ₹{job.amount || "—"}
                                </p>
                              </div>

                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                                💰
                              </div>

                            </div>

                          </div>

                          {/* DETAILS */}

                          <div className="mt-3 space-y-2">

                            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">

                              <span className="text-sm">
                                📍
                              </span>

                              <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  Location
                                </p>

                                <p className="truncate text-xs font-bold text-slate-700">
                                  {job.location?.address ||
                                    jobDistrict ||
                                    jobState}
                                </p>
                              </div>

                            </div>

                            <div className="grid grid-cols-2 gap-2">

                              <div className="rounded-xl bg-indigo-50 px-3 py-2.5">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                                  State
                                </p>
                                <p className="mt-0.5 truncate text-xs font-bold text-indigo-700">
                                  {jobState}
                                </p>
                              </div>

                              <div className="rounded-xl bg-purple-50 px-3 py-2.5">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
                                  District
                                </p>
                                <p className="mt-0.5 truncate text-xs font-bold text-purple-700">
                                  {jobDistrict || "—"}
                                </p>
                              </div>

                            </div>

                          </div>

                          {/* POSTED */}

                          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                            <span className="text-[10px] font-semibold text-slate-400">
                              Posted
                            </span>

                            <span className="text-[10px] font-bold text-slate-500">
                              {job.createdAt
                                ? formatDistanceToNow(
                                    new Date(
                                      job.createdAt
                                    ),
                                    {
                                      addSuffix: true,
                                    }
                                  )
                                : "Recently"}
                            </span>

                          </div>

                          {/* APPLY */}

                          <button
                            type="button"
                            onClick={() =>
                              openJob(job)
                            }
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-sm font-black text-white shadow-md shadow-indigo-100 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
                          >
                            Apply Now
                            <span>→</span>
                          </button>

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

      <HealthcareJobs />

      {/* ==================================================
          APPLICATION MODAL
      ================================================== */}

      {selectedJob && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 px-3 py-4 backdrop-blur-md sm:px-5"
          onClick={handleCloseModal}
        >

          <div
            id="jobhir-application-modal"
            className="jobhir-scrollbar relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-white shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-20 overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 px-5 py-5 text-white shadow-lg sm:px-7">

              <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10" />

              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                ✕
              </button>

              <div className="relative pr-12">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl backdrop-blur">
                    💼
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">
                      Job Application
                    </p>

                    <h2 className="mt-0.5 line-clamp-2 text-xl font-black sm:text-2xl">
                      {selectedJob.title}
                    </h2>
                  </div>

                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                  <span className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-bold backdrop-blur">
                    {selectedJob.workType || "Job"}
                  </span>

                  <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-black text-indigo-700">
                    Application Fee ₹
                    {amountInRupees || 0}
                  </span>

                </div>

              </div>
            </div>

            {/* MODAL BODY */}

            <div className="p-5 sm:p-7">

              {/* JOB SUMMARY */}

              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">

                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-[9px] font-bold uppercase text-emerald-500">
                    Amount
                  </p>
                  <p className="mt-1 text-base font-black text-emerald-700">
                    ₹{selectedJob.amount || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-[9px] font-bold uppercase text-blue-500">
                    State
                  </p>
                  <p className="mt-1 truncate text-xs font-black text-blue-700">
                    {selectedJob.state ||
                      selectedJob.location?.state ||
                      "India"}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3">
                  <p className="text-[9px] font-bold uppercase text-purple-500">
                    District
                  </p>
                  <p className="mt-1 truncate text-xs font-black text-purple-700">
                    {selectedJob.district ||
                      selectedJob.location?.district ||
                      "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    Type
                  </p>
                  <p className="mt-1 truncate text-xs font-black text-slate-700">
                    {selectedJob.workType || "Job"}
                  </p>
                </div>

              </div>

              {/* FORM */}

              <div className="space-y-4">

                {/* NAME */}

                <div>
                  <label className="mb-1.5 block text-xs font-black text-slate-600">
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
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* MOBILE */}

                <div>
                  <label className="mb-1.5 block text-xs font-black text-slate-600">
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-1.5 block text-xs font-black text-slate-600">
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* LOCATION */}

                <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-blue-50 to-purple-50">

                  <div className="flex items-center gap-3 border-b border-indigo-100 px-4 py-3.5">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-lg text-white shadow-sm">
                      📍
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-800">
                        Job Location
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Location provided by the job poster
                      </p>
                    </div>

                  </div>

                  <div className="p-3">

                    {/* ADDRESS */}

                    <div className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm">

                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        Address
                      </p>

                      <p className="mt-1 text-sm font-bold leading-5 text-slate-700">
                        {selectedJob.location?.address ||
                          "Location provided by employer"}
                      </p>

                    </div>

                    {/* LOCATION DETAILS */}

                    <div className="mt-2 grid grid-cols-2 gap-2">

                      {selectedJob.location?.village && (
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-[9px] font-bold text-slate-400">
                            Village
                          </p>
                          <p className="mt-1 truncate text-xs font-bold text-slate-700">
                            {
                              selectedJob
                                .location
                                .village
                            }
                          </p>
                        </div>
                      )}

                      {selectedJob.location?.locality && (
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-[9px] font-bold text-slate-400">
                            Locality
                          </p>
                          <p className="mt-1 truncate text-xs font-bold text-slate-700">
                            {
                              selectedJob
                                .location
                                .locality
                            }
                          </p>
                        </div>
                      )}

                      {(selectedJob.location?.state ||
                        selectedJob.state) && (
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-[9px] font-bold text-slate-400">
                            State
                          </p>
                          <p className="mt-1 truncate text-xs font-bold text-slate-700">
                            {selectedJob.location?.state ||
                              selectedJob.state}
                          </p>
                        </div>
                      )}

                      {(selectedJob.location?.district ||
                        selectedJob.district) && (
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-[9px] font-bold text-slate-400">
                            District
                          </p>
                          <p className="mt-1 truncate text-xs font-bold text-slate-700">
                            {selectedJob.location?.district ||
                              selectedJob.district}
                          </p>
                        </div>
                      )}

                      {selectedJob.location?.postcode && (
                        <div className="rounded-xl bg-white p-3 shadow-sm">
                          <p className="text-[9px] font-bold text-slate-400">
                            PIN
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-700">
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

                    {selectedJob.location?.latitude != null &&
                      selectedJob.location?.longitude != null && (
                        <div className="jobhir-map mt-3 overflow-hidden rounded-2xl border border-indigo-100 bg-white p-1 shadow-sm">

                          <div className="h-60 w-full overflow-hidden rounded-xl sm:h-72">

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

                {/* FEE */}

                <div>

                  <label className="mb-1.5 block text-xs font-black text-slate-600">
                    Application Fee
                  </label>

                  <div className="relative">

                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500">
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* NOTE */}

                <div>

                  <label className="mb-1.5 block text-xs font-black text-slate-600">
                    Note
                  </label>

                  <input
                    type="text"
                    value={note}
                    onChange={(e) =>
                      setNote(e.target.value)
                    }
                    placeholder="Application note"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  {error}
                </div>
              )}

              {/* SECURE PAYMENT */}

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-3.5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                  🔒
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-amber-800">
                    Secure Application Payment
                  </p>

                  <p className="mt-0.5 text-[10px] leading-4 text-amber-700">
                    You will be redirected to the secure
                    payment page to complete your application.
                  </p>
                </div>

                <span className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-black text-amber-700 shadow-sm">
                  ₹{amountInRupees || 0}
                </span>

              </div>

              {/* PAY */}

              <button
                type="button"
                onClick={createOrder}
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-4 text-sm font-black text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{amountInRupees || 0}
                    <span>•</span>
                    Apply Now
                    <span>→</span>
                  </>
                )}

              </button>

              <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">
                By continuing, you agree to proceed with this
                job application.
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

