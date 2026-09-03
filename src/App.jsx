import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  MapPin,
  Search,
  Users,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import JobCard from "./components/JobCard.jsx";

// ======================================================
// API
// ======================================================

const API_URL = "https://jbackend-h963.onrender.com";

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
// DEFAULT WORK TYPES
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
// NORMALIZE WORK TYPE
// ======================================================

const normalizeWorkType = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

// ======================================================
// APP
// ======================================================

export default function App() {
  const navigate = useNavigate();

  // ====================================================
  // STATES
  // ====================================================

  const [jobs, setJobs] = useState([]);

  const [appliedJobs, setAppliedJobs] =
    useState([]);

  const [filteredJobs, setFilteredJobs] =
    useState([]);

  const [stateList, setStateList] =
    useState(INDIA_STATES);

  const [selectedState, setSelectedState] =
    useState("All");

  const [selectedWorkType, setSelectedWorkType] =
    useState(null);

  const [loadingJobs, setLoadingJobs] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [currentTime, setCurrentTime] =
    useState("");

  // ====================================================
  // LIVE TIME
  // ====================================================

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formatted =
        now.toLocaleString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

      setCurrentTime(formatted);
    };

    updateTime();

    const timer = setInterval(
      updateTime,
      60000
    );

    return () => clearInterval(timer);
  }, []);

  // ====================================================
  // FETCH JOBS
  // ====================================================

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);

      const res = await axios.get(
        `${API_URL}/jobs`
      );

      const fetchedJobs =
        res.data?.jobs || [];

      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);

      // GET API STATES

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

      // MERGE STATES

      const mergedStates =
        Array.from(
          new Set([
            ...INDIA_STATES,
            ...apiStates,
          ])
        ).sort();

      setStateList(mergedStates);
    } catch (err) {
      console.error(
        "Error fetching jobs:",
        err
      );

      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ====================================================
  // FETCH APPLIED JOBS
  // ====================================================

  useEffect(() => {
    const mobile =
      localStorage.getItem(
        "mobileNumber"
      );

    if (!mobile) return;

    const fetchAppliedJobs =
      async () => {
        try {
          const res =
            await axios.get(
              `${API_URL}/applied-jobs/${mobile}`
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

    const filtered = jobs.filter(
      (job) => {
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
      }
    );

    setFilteredJobs(filtered);
  }, [
    selectedState,
    jobs,
  ]);

  // ====================================================
  // AVAILABLE JOBS
  // ====================================================

  const availableJobs =
    filteredJobs.filter(
      (job) =>
        !appliedJobs.includes(
          job?._id
        )
    );

  // ====================================================
  // SEARCH FILTER
  // ====================================================

  const searchedJobs =
    availableJobs.filter((job) => {
      const query =
        searchTerm
          .trim()
          .toLowerCase();

      if (!query) return true;

      return [
        job?.title,
        job?.description,
        job?.workType,
        job?.district,
        job?.state,
        job?.location?.address,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });

  // ====================================================
  // AVAILABLE WORK TYPES
  // ====================================================

  const availableWorkTypes =
    Array.from(
      new Set([
        ...WORK_TYPES,

        ...availableJobs
          .map(
            (job) =>
              job?.workType
          )
          .filter(Boolean),
      ])
    );

  // ====================================================
  // CATEGORY COUNT
  // ====================================================

  const workTypeCategories =
    availableWorkTypes
      .map((workType) => ({
        workType,

        count:
          searchedJobs.filter(
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
        (item) =>
          item.count > 0
      );

  // ====================================================
  // SELECTED CATEGORY JOBS
  // ====================================================

  const categoryJobs =
    selectedWorkType
      ? searchedJobs.filter(
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
  // RESET FILTERS
  // ====================================================

  const resetFilters = () => {
    setSelectedState("All");
    setSelectedWorkType(null);
    setSearchTerm("");
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================================================
          HEADER
      ================================================= */}

      <Header
        onOfferJobClick={() =>
          navigate("/offer-job")
        }
      />

      {/* ================================================
          TOP INFO BAR
      ================================================= */}

      <div className="border-b border-sky-100 bg-white">

        <div className="max-w-7xl mx-auto px-4 py-2">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">

            <div className="flex items-center gap-2 text-slate-500">

              <Sparkles
                size={14}
                className="text-sky-600"
              />

              <span>
                Find verified work opportunities
                across India
              </span>

            </div>

            <div className="font-medium text-slate-500">
              {currentTime}
            </div>

          </div>

        </div>

      </div>

      {/* ================================================
          HERO SECTION
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-blue-700 to-indigo-800">

        {/* Background */}

        <div className="absolute inset-0 opacity-20">

          <div className="absolute top-0 left-10 h-72 w-72 rounded-full bg-white blur-3xl" />

          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-cyan-300 blur-3xl" />

        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-20">

          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">

              <BriefcaseBusiness size={16} />

              <span>
                India's Growing Job Platform
              </span>

            </div>

            <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">

              Find Work That
              <span className="block text-sky-200">
                Matches Your Skills
              </span>

            </h1>

            <p className="mt-5 text-sm sm:text-lg leading-7 text-sky-100 max-w-2xl mx-auto">

              Discover local jobs, connect with
              employers, and apply for work
              opportunities easily with Jobhir.

            </p>

            {/* SEARCH */}

            <div className="mt-8 max-w-2xl mx-auto">

              <div className="flex items-center gap-3 bg-white rounded-2xl p-2 shadow-2xl">

                <div className="flex flex-1 items-center gap-3 px-3">

                  <Search
                    size={20}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(
                        e.target.value
                      );

                      setSelectedWorkType(null);
                    }}
                    placeholder="Search jobs, skills or work type..."
                    className="h-12 w-full outline-none text-sm sm:text-base text-slate-700"
                  />

                </div>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(
                        "jobs-section"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="hidden sm:flex h-12 px-5 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition"
                >
                  Search
                </button>

              </div>

            </div>

            {/* HERO BUTTONS */}

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">

              <button
                onClick={() =>
                  navigate(
                    "/worker-register"
                  )
                }
                className="h-12 px-6 rounded-xl bg-white text-sky-700 font-bold hover:bg-sky-50 transition shadow-lg"
              >
                Register as Worker
              </button>

              <button
                onClick={() =>
                  navigate("/offer-job")
                }
                className="h-12 px-6 rounded-xl border border-white/30 bg-white/10 text-white font-bold hover:bg-white/20 transition backdrop-blur-sm"
              >
                Post a Job
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================
          STATS
      ================================================= */}

      <section className="relative z-10 -mt-7">

        <div className="max-w-6xl mx-auto px-4">

          <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

            {/* Total Jobs */}

            <div className="p-5 sm:p-6 text-center border-b md:border-b-0 md:border-r border-slate-100">

              <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">

                <BriefcaseBusiness size={20} />

              </div>

              <p className="text-2xl font-bold">
                {availableJobs.length}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Available Jobs
              </p>

            </div>

            {/* Categories */}

            <div className="p-5 sm:p-6 text-center border-b md:border-b-0 md:border-r border-slate-100">

              <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

                <Users size={20} />

              </div>

              <p className="text-2xl font-bold">
                {workTypeCategories.length}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Work Categories
              </p>

            </div>

            {/* States */}

            <div className="p-5 sm:p-6 text-center border-r border-slate-100">

              <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                <MapPin size={20} />

              </div>

              <p className="text-2xl font-bold">
                {stateList.length}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Locations
              </p>

            </div>

            {/* Status */}

            <div className="p-5 sm:p-6 text-center">

              <div className="mx-auto mb-3 w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

                <ShieldCheckIcon />

              </div>

              <p className="text-sm font-bold text-emerald-600">
                Active
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Secure Platform
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================
          FILTER SECTION
      ================================================= */}

      <section className="max-w-7xl mx-auto px-4 mt-10">

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            {/* LEFT */}

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Browse Opportunities
              </p>

              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
                Find jobs in your preferred location
              </h2>

            </div>

            {/* FILTER */}

            <div className="flex flex-col sm:flex-row gap-3">

              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(
                    e.target.value
                  );

                  setSelectedWorkType(
                    null
                  );
                }}
                className="h-11 min-w-[220px] px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >

                <option value="All">
                  All India
                </option>

                {stateList.map(
                  (state) => (
                    <option
                      key={state}
                      value={state}
                    >
                      {state}
                    </option>
                  )
                )}

              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="h-11 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm flex items-center justify-center gap-2"
              >

                <RefreshCw size={16} />

                Reset

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================
          CURRENT FILTER INFO
      ================================================= */}

      <section className="max-w-7xl mx-auto px-4 mt-5">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">

              <MapPin size={20} />

            </div>

            <div>

              <p className="text-xs text-slate-500">
                Currently showing
              </p>

              <p className="font-bold text-slate-800">

                {selectedState === "All"
                  ? "Jobs across India"
                  : `Jobs in ${selectedState}`}

              </p>

            </div>

          </div>

          <div className="rounded-full bg-sky-50 border border-sky-100 px-4 py-2">

            <span className="text-sm font-bold text-sky-700">
              {selectedWorkType
                ? categoryJobs.length
                : searchedJobs.length}
            </span>

            <span className="ml-1 text-xs text-sky-600">
              jobs found
            </span>

          </div>

        </div>

      </section>

      {/* ================================================
          MAIN JOB SECTION
      ================================================= */}

      <main
        id="jobs-section"
        className="max-w-7xl mx-auto px-4 py-10"
      >

        {/* ================================================
            LOADING
        ================================================= */}

        {loadingJobs && (

          <div className="flex flex-col items-center justify-center py-24">

            <div className="relative">

              <div className="w-16 h-16 rounded-full border-4 border-sky-100" />

              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-sky-600 border-t-transparent animate-spin" />

            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Loading latest jobs...
            </p>

          </div>

        )}

        {/* ================================================
            EMPTY STATE
        ================================================= */}

        {!loadingJobs &&
          searchedJobs.length === 0 && (

            <div className="bg-white rounded-2xl border border-slate-200 py-20 px-5 text-center">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">

                <Search size={30} />

              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-800">
                No jobs found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or
                location filter.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
              >
                Reset Filters
              </button>

            </div>

          )}

        {/* ================================================
            CATEGORY LIST
        ================================================= */}

        {!loadingJobs &&
          searchedJobs.length > 0 &&
          !selectedWorkType && (

            <section>

              {/* TITLE */}

              <div className="mb-8 text-center">

                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-bold text-sky-600 border border-sky-100">

                  <Sparkles size={14} />

                  Explore Opportunities

                </div>

                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900">
                  Find Jobs by Work Type
                </h2>

                <p className="mt-2 text-sm sm:text-base text-slate-500">
                  Select a category to view available
                  job opportunities
                </p>

              </div>

              {/* CATEGORY GRID */}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">

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
                      className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 text-left shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300"
                    >

                      {/* Top glow */}

                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

                      <div className="min-h-[54px] flex items-center">

                        <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                          {workType}
                        </h3>

                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">

                        <span className="text-xs text-slate-500">
                          Available Jobs
                        </span>

                        <span className="min-w-[32px] h-8 px-2 rounded-full bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">
                          {count}
                        </span>

                      </div>

                    </button>

                  )
                )}

              </div>

            </section>

          )}

        {/* ================================================
            SELECTED CATEGORY
        ================================================= */}

        {!loadingJobs &&
          selectedWorkType && (

            <section>

              {/* HEADER */}

              <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedWorkType(
                          null
                        )
                      }
                      className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
                    >
                      ← Back
                    </button>

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Work Category
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {selectedWorkType}
                      </h2>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-sky-50 border border-sky-100 px-4 py-3">

                    <BriefcaseBusiness
                      size={18}
                      className="text-sky-600"
                    />

                    <span className="font-bold text-sky-700">
                      {categoryJobs.length}
                    </span>

                    <span className="text-sm text-sky-600">
                      Jobs
                    </span>

                  </div>

                </div>

              </div>

              {/* NO CATEGORY JOBS */}

              {categoryJobs.length === 0 && (

                <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">

                  <Search
                    size={38}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-4 text-lg font-bold text-slate-700">
                    No jobs found in this category
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(
                        null
                      )
                    }
                    className="mt-5 px-5 py-2.5 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700"
                  >
                    Browse Categories
                  </button>

                </div>

              )}

              {/* JOB CARDS */}

              {categoryJobs.length > 0 && (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

                  {categoryJobs.map(
                    (job) => (

                      <JobCard
                        key={job._id}
                        job={job}
                      />

                    )
                  )}

                </div>

              )}

            </section>

          )}

      </main>

      {/* ================================================
          CTA SECTION
      ================================================= */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 to-blue-700 p-7 sm:p-10">

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="max-w-xl">

              <p className="text-sky-100 text-sm font-semibold">
                FOR EMPLOYERS
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                Looking for skilled workers?
              </h2>

              <p className="mt-3 text-sm sm:text-base text-sky-100">
                Post your job and connect with
                workers looking for opportunities.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/offer-job")
              }
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white text-sky-700 font-bold hover:bg-sky-50 transition shadow-lg"
            >

              Post a Job

              <ArrowRight size={18} />

            </button>

          </div>

          <div className="absolute -right-16 -bottom-20 w-72 h-72 rounded-full bg-white/10" />

        </div>

      </section>

      {/* ================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>
  );
}

// ======================================================
// SIMPLE SHIELD ICON
// ======================================================

function ShieldCheckIcon() {
  return (
    <div className="font-bold text-lg">
      ✓
    </div>
  );
}