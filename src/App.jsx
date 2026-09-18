import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
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
  job?.location?.address || "Location provided by employer";

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
          new Set([...INDIA_STATES, ...apiStates])
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
      (job) => !appliedJobs.includes(job?._id)
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
    // -------------------------------
    // VALIDATION
    // -------------------------------

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

      const amount = Math.round(
        Number(amountInRupees) * 100
      );

      // Save mobile locally
      localStorage.setItem(
        "mobileNumber",
        mobileNumber
      );

      const response = await axios.post(
        `${API_BASE}/create-order`,
        {
          amount,
          customerName: customerName.trim(),
          mobileNumber,
          email: email.trim(),
          note: note.trim(),
          jobId: selectedJob._id,
          location: selectedJob.location || null,
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

      window.open(checkoutUrl, "_blank");

      setSelectedJob(null);
      setCustomerName("");
      setMobileNumber("");
      setEmail("");
      setAmountInRupees(10);
      setNote("Order for job");
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

      <section className="w-full px-3 pt-4 sm:px-5 sm:pt-5 lg:px-8 xl:px-10">
        <div className="w-full border border-blue-100 bg-white p-4 shadow-sm sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 text-center sm:text-xs">
                Job Search
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

      <section className="w-full px-3 pt-3 sm:px-5 lg:px-8 xl:px-10">
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
          MAIN
      ================================================== */}

      <main className="w-full px-3 py-6 sm:px-5 sm:py-8 lg:px-8 xl:px-10">

        {/* LOADING */}

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

        {/* NO JOBS */}

        {!loadingJobs &&
          availableJobs.length === 0 && (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="w-full max-w-lg border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-3xl">
                  🔍
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
            <section>

              <div className="mb-6 text-center">
                <span className="inline-flex border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
                  Explore Opportunities
                </span>

                <h5 className="mt-3 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                  Select a category to see available
                  jobs matching your skills.
                </h5>

    
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">

                {workTypeCategories.map(
                  ({ workType, count }) => (
                    <button
                      key={workType}
                      type="button"
                      onClick={() =>
                        setSelectedWorkType(
                          workType
                        )
                      }
                      className="group relative overflow-hidden border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100 sm:p-5"
                    >
                      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

                      <div className="mb-4 flex h-10 w-10 items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 text-blue-700 transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white">
                        <span className="text-sm font-extrabold">
                          {workType
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>

                      <div className="flex min-h-[48px] items-center">
                        <h3 className="text-sm font-extrabold leading-5 text-slate-800 transition group-hover:text-indigo-700 sm:text-base">
                          {workType}
                        </h3>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-[11px] font-medium text-slate-400 sm:text-xs">
                          Available
                        </span>

                        <span className="flex h-7 min-w-[30px] items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 px-2 text-xs font-extrabold text-indigo-700 ring-1 ring-inset ring-indigo-100">
                          {count}
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

              {/* CATEGORY HEADER */}

              <div className="relative mb-6 overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-4 shadow-lg shadow-indigo-100 sm:p-5">

                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(null)
                    }
                    className="w-fit border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    ← Back to Categories
                  </button>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-100">
                        Work Category
                      </p>

                      <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                        {selectedWorkType}
                      </h2>
                    </div>

                    <div className="flex h-12 min-w-[50px] items-center justify-center bg-white px-3 shadow-md">
                      <span className="text-lg font-extrabold text-indigo-700">
                        {categoryJobs.length}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* EMPTY CATEGORY */}

              {categoryJobs.length === 0 && (
                <div className="border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">

                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-3xl">
                    🔍
                  </div>

                  <p className="text-lg font-extrabold text-slate-800">
                    No jobs found in this category.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(null)
                    }
                    className="mt-5 bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Back to Categories
                  </button>
                </div>
              )}

              {/* JOB CARDS */}

              {categoryJobs.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

                  {categoryJobs.map((job) => (
                    <article
                      key={job?._id}
                      className="group relative flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100"
                    >

                      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

                      <div className="flex h-full flex-col p-5">

                        {/* TITLE */}

                        <div className="flex items-start justify-between gap-3">
                          <h2 className="line-clamp-2 text-lg font-extrabold leading-6 text-slate-900 transition group-hover:text-indigo-700">
                            {job?.title ||
                              "Job Opportunity"}
                          </h2>

                          <span className="shrink-0 bg-gradient-to-r from-blue-50 to-purple-50 px-2 py-1 text-[10px] font-bold text-indigo-700 ring-1 ring-inset ring-indigo-100">
                            JOB
                          </span>
                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-3 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-500">
                          {job?.description ||
                            "No description available."}
                        </p>

                        {/* DETAILS */}

                        <div className="mt-4 space-y-2">

                          {/* AMOUNT */}

                          <div className="flex items-center justify-between bg-emerald-50 px-3 py-2">
                            <span className="text-xs font-semibold text-emerald-700">
                              Job Amount
                            </span>

                            <span className="text-sm font-extrabold text-emerald-600">
                              ₹{job?.amount ?? 0}
                            </span>
                          </div>

                          {/* WORK TYPE */}

                          {job?.workType && (
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2">
                              <span className="text-[11px] font-bold text-blue-600">
                                Work
                              </span>

                              <span className="truncate text-xs font-semibold text-slate-700">
                                {job.workType}
                              </span>
                            </div>
                          )}

                          {/* STATE */}

                          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2">
                            <span className="text-[11px] font-bold text-purple-600">
                              State
                            </span>

                            <span className="truncate text-xs font-semibold text-slate-700">
                              {getJobState(job) ||
                                "India"}
                            </span>
                          </div>

                          {/* DISTRICT */}

                          {getJobDistrict(job) && (
                            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2">
                              <span className="text-[11px] font-bold text-indigo-600">
                                District
                              </span>

                              <span className="truncate text-xs font-semibold text-slate-700">
                                {getJobDistrict(job)}
                              </span>
                            </div>
                          )}

                          {/* LOCATION */}

                          {job?.location?.address && (
                            <div className="bg-slate-50 px-3 py-2">
                              <p className="text-[10px] font-bold text-slate-400">
                                📍 Location
                              </p>

                              <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-4 text-slate-600">
                                {job.location.address}
                              </p>
                            </div>
                          )}

                          {/* POSTED */}

                          {job?.createdAt && (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] font-medium text-slate-400">
                                Posted
                              </span>

                              <span className="text-[10px] font-semibold text-slate-500">
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

                        </div>

                        {/* APPLY */}

                        <button
                          type="button"
                          onClick={() =>
                            handleApply(job)
                          }
                          className="mt-5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-sm font-extrabold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          Apply Now
                        </button>

                      </div>
                    </article>
                  ))}

                </div>
              )}
            </section>
          )}

      </main>

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

            {/* MODAL HEADER */}

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

            {/* MODAL BODY */}

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
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="Enter your email"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* ==================================================
                    JOB LOCATION
                ================================================== */}

                <div className="overflow-hidden border border-indigo-100 bg-gradient-to-br from-blue-50 to-purple-50">

                  <div className="flex items-start gap-3 border-b border-indigo-100 px-4 py-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-lg text-white shadow-sm">
                      📍
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-800">
                        Job Location
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Location provided by the job poster
                      </p>
                    </div>

                  </div>

                  <div className="p-3">

                    {/* ADDRESS */}

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

                    {/* LOCATION DETAILS */}

                    <div className="mt-3 grid grid-cols-2 gap-2">

                      {selectedJob?.location
                        ?.village && (
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

                      {selectedJob?.location
                        ?.locality && (
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

                      {selectedJob?.location
                        ?.postcode && (
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

                    {selectedJob?.location
                      ?.latitude != null &&
                      selectedJob?.location
                        ?.longitude != null && (
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
                    onChange={(event) =>
                      setNote(
                        event.target.value
                      )
                    }
                    placeholder="Note"
                    className="w-full border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                      You will be redirected to
                      the secure payment page.
                    </p>
                  </div>

                  <span className="shrink-0 bg-white px-2 py-1 text-xs font-extrabold text-amber-700 shadow-sm">
                    ₹{amountInRupees || 0}
                  </span>

                </div>
              </div>

              {/* PAY & APPLY */}

              <button
                type="button"
                onClick={createOrder}
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[10px] text-slate-400">
                By continuing, you agree to proceed
                with this job application.
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