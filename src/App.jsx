
import { useEffect, useState } from "react";
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
// ALL INDIA STATES + UNION TERRITORIES
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
// JOB WORK TYPES / CATEGORIES
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
  // JOB STATES
  // ====================================================

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // ====================================================
  // STATE FILTER
  // ====================================================

  const [stateList, setStateList] = useState(INDIA_STATES);
  const [selectedState, setSelectedState] = useState("All");

  // ====================================================
  // SELECTED WORK TYPE / CATEGORY
  // ====================================================

  const [selectedWorkType, setSelectedWorkType] = useState(null);

  // ====================================================
  // SELECTED JOB
  // ====================================================

  const [selectedJob, setSelectedJob] = useState(null);

  // ====================================================
  // APPLY / PAYMENT
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
  // CUSTOM STYLE
  // ====================================================

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      @keyframes scrollText {
        0% {
          transform: translateX(100%);
        }

        100% {
          transform: translateX(-100%);
        }
      }

      .scroller {
        white-space: nowrap;
        display: inline-block;
        animation: scrollText 15s linear infinite;
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
        border-radius: 20px;
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

      const formatted = now.toLocaleString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setCurrentTime(formatted);
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

        // ==================================================
        // GET STATES FROM API
        // ==================================================

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

        // ==================================================
        // MERGE INDIA STATES + API STATES
        // ==================================================

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
  // FILTER JOBS BY STATE
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

  const availableJobs = filteredJobs.filter(
    (job) =>
      !appliedJobs.includes(job?._id)
  );

  // ====================================================
  // ALL AVAILABLE WORK TYPES
  // ====================================================

  const availableWorkTypes = Array.from(
    new Set([
      ...WORK_TYPES,

      ...jobs
        .map((job) => job?.workType)
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

  // ====================================================
  // SELECTED CATEGORY JOBS
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
  // CLOSE APPLY MODAL
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
    // ==================================================
    // VALIDATION
    // ==================================================

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

      // ==================================================
      // PAYMENT AMOUNT
      // ==================================================

      const amount = Math.round(
        Number(amountInRupees) * 100
      );

      // ==================================================
      // SAVE WORKER MOBILE
      // ==================================================

      localStorage.setItem(
        "mobileNumber",
        mobileNumber
      );

      // ==================================================
      // CREATE ORDER
      // ==================================================

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

      // ==================================================
      // CHECKOUT
      // ==================================================

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
  // RENDER
  // ====================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        onOfferJobClick={() =>
          navigate("/offer-job")
        }
      />

      {/* =================================================
          TOP SCROLLING BAR
      ================================================= */}

      <div className="w-full overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 py-2 text-white shadow-sm">

        <p className="scroller text-center text-[11px] font-semibold tracking-wide sm:text-xs">
          {currentTime}
          {"  •  "}
          Find your dream job today!
          {"  •  "}
          100% Secure &amp; Safe!
        </p>

      </div>

      {/* =================================================
          TOP ACTION AREA
      ================================================= */}

      <section className="w-full px-3 pt-4 sm:px-5 sm:pt-5 lg:px-8 xl:px-10">

        <div className="w-full rounded-2xl border border-blue-100 bg-white p-3 shadow-sm sm:p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* LEFT */}

            <div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 sm:text-xs">
                Job Search
              </p>

              <h1 className="mt-1 text-xl font-extrabold text-slate-800 sm:text-2xl">
                Find Jobs Near You
              </h1>

            </div>

            {/* RIGHT */}

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

              {/* POST JOB */}

              <button
                type="button"
                onClick={() =>
                  navigate("/offer-job")
                }
                className="
                  w-full
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-600
                  to-purple-600
                  px-5
                  py-2.5
                  text-sm
                  font-extrabold
                  text-white
                  shadow-md
                  shadow-indigo-200
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-lg
                  hover:shadow-indigo-300
                  sm:w-auto
                "
              >
                + Post a Job
              </button>

              {/* REGISTER */}

              <button
                type="button"
                onClick={() =>
                  navigate("/worker-register")
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-indigo-200
                  bg-indigo-50
                  px-5
                  py-2.5
                  text-sm
                  font-bold
                  text-indigo-700
                  transition
                  hover:border-indigo-300
                  hover:bg-indigo-100
                  sm:w-auto
                "
              >
                Register
              </button>

              {/* STATE */}

              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(
                    e.target.value
                  );

                  setSelectedWorkType(null);
                }}
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-3
                  text-sm
                  font-semibold
                  text-slate-700
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-100
                  sm:w-48
                "
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

      {/* =================================================
          SELECTED STATE INFO
      ================================================= */}

      <section className="w-full px-3 pt-3 sm:px-5 lg:px-8 xl:px-10">

        <div className="relative w-full overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-purple-50 px-4 py-3 shadow-sm">

          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-600" />

          <div className="flex items-center justify-between gap-3 pl-1">

            {/* STATE */}

            <div className="min-w-0">

              <p className="text-[10px] font-semibold text-slate-400 sm:text-xs">
                Showing jobs from
              </p>

              <div className="mt-1 flex items-center gap-2">

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm shadow-sm">
                  🇮🇳
                </span>

                <p className="truncate text-sm font-extrabold text-slate-800 sm:text-base">
                  {selectedState === "All"
                    ? "All India"
                    : selectedState}
                </p>

              </div>

            </div>

            {/* JOB COUNT */}

            <div className="flex shrink-0 items-center gap-2">

              <div className="hidden text-right sm:block">

                <p className="text-xs font-semibold text-slate-400">
                  {selectedWorkType
                    ? selectedWorkType
                    : "Available Jobs"}
                </p>

              </div>

              <div className="flex h-10 min-w-[44px] items-center justify-center rounded-xl border border-blue-100 bg-white px-3 shadow-sm">

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

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="w-full px-3 py-6 sm:px-5 sm:py-8 lg:px-8 xl:px-10">

        {/* =================================================
            LOADING
        ================================================= */}

        {loadingJobs && (
          <div className="flex min-h-[350px] items-center justify-center">

            <div className="relative">

              <div className="h-16 w-16 rounded-full border-4 border-indigo-100" />

              <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-r-purple-600 border-t-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            NO JOBS
        ================================================= */}

        {!loadingJobs &&
          availableJobs.length === 0 && (

            <div className="flex min-h-[350px] items-center justify-center">

              <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">

                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-3xl">
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

        {/* =================================================
            CATEGORY LIST
        ================================================= */}

        {!loadingJobs &&
          availableJobs.length > 0 &&
          !selectedWorkType && (

            <section>

              {/* TITLE */}

              <div className="mb-6 flex flex-col items-center justify-center text-center">

                <span className="inline-flex rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
                  Explore Opportunities
                </span>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                  Choose Your Work Category
                </h2>

                <p className="mt-1 max-w-2xl text-xs text-slate-500 sm:text-sm">
                  Select a category to see available jobs matching your skills.
                </p>

              </div>

              {/* CATEGORY GRID */}

              <div className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                sm:gap-4
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                2xl:grid-cols-7
              ">

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
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        text-left
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-indigo-200
                        hover:shadow-xl
                        hover:shadow-indigo-100
                        sm:p-5
                      "
                    >

                      {/* TOP GRADIENT */}

                      <div className="
                        absolute
                        left-0
                        top-0
                        h-1
                        w-full
                        bg-gradient-to-r
                        from-blue-500
                        via-indigo-500
                        to-purple-600
                      " />

                      {/* CATEGORY ICON */}

                      <div className="
                        mb-4
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-gradient-to-br
                        from-blue-50
                        to-purple-100
                        text-blue-700
                        transition-all
                        duration-300
                        group-hover:from-blue-600
                        group-hover:to-purple-600
                        group-hover:text-white
                      ">

                        <span className="text-sm font-extrabold">
                          {workType
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                      </div>

                      {/* CATEGORY NAME */}

                      <div className="flex min-h-[48px] items-center">

                        <h3 className="
                          text-sm
                          font-extrabold
                          leading-5
                          text-slate-800
                          transition
                          group-hover:text-indigo-700
                          sm:text-base
                        ">
                          {workType}
                        </h3>

                      </div>

                      {/* COUNT */}

                      <div className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        border-t
                        border-slate-100
                        pt-3
                      ">

                        <span className="text-[11px] font-medium text-slate-400 sm:text-xs">
                          Available
                        </span>

                        <span className="
                          flex
                          h-7
                          min-w-[30px]
                          items-center
                          justify-center
                          rounded-full
                          bg-gradient-to-r
                          from-blue-50
                          to-purple-50
                          px-2
                          text-xs
                          font-extrabold
                          text-indigo-700
                          ring-1
                          ring-inset
                          ring-indigo-100
                        ">
                          {count}
                        </span>

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

              <div className="
                relative
                mb-6
                overflow-hidden
                rounded-2xl
                border
                border-indigo-100
                bg-gradient-to-r
                from-blue-600
                via-indigo-600
                to-purple-700
                p-4
                shadow-lg
                shadow-indigo-100
                sm:p-5
              ">

                <div className="
                  absolute
                  -right-10
                  -top-10
                  h-32
                  w-32
                  rounded-full
                  bg-white/10
                " />

                <div className="
                  relative
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                ">

                  {/* BACK */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(null)
                    }
                    className="
                      w-fit
                      rounded-xl
                      border
                      border-white/20
                      bg-white/10
                      px-4
                      py-2.5
                      text-sm
                      font-bold
                      text-white
                      backdrop-blur-sm
                      transition
                      hover:bg-white/20
                    "
                  >
                    ← Back to Categories
                  </button>

                  {/* CATEGORY */}

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    sm:justify-end
                  ">

                    <div className="text-right">

                      <p className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-blue-100
                      ">
                        Work Category
                      </p>

                      <h2 className="
                        text-xl
                        font-extrabold
                        text-white
                        sm:text-2xl
                      ">
                        {selectedWorkType}
                      </h2>

                    </div>

                    <div className="
                      flex
                      h-12
                      min-w-[50px]
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      px-3
                      shadow-md
                    ">

                      <span className="
                        text-lg
                        font-extrabold
                        text-indigo-700
                      ">
                        {categoryJobs.length}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  EMPTY CATEGORY
              ================================================= */}

              {categoryJobs.length === 0 && (

                <div className="
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  px-6
                  py-16
                  text-center
                  shadow-sm
                ">

                  <div className="
                    mx-auto
                    mb-4
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-100
                    to-purple-100
                    text-3xl
                  ">
                    🔍
                  </div>

                  <p className="
                    text-lg
                    font-extrabold
                    text-slate-800
                  ">
                    No jobs found in this category.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(null)
                    }
                    className="
                      mt-5
                      rounded-xl
                      bg-gradient-to-r
                      from-blue-600
                      to-purple-600
                      px-5
                      py-2.5
                      text-sm
                      font-bold
                      text-white
                      shadow-md
                      transition
                      hover:-translate-y-0.5
                      hover:shadow-lg
                    "
                  >
                    Back to Categories
                  </button>

                </div>

              )}

              {/* =================================================
                  JOB CARDS
              ================================================= */}

              {categoryJobs.length > 0 && (

                <div className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                  2xl:grid-cols-5
                ">

                  {categoryJobs.map(
                    (job) => (

                      <article
                        key={job._id}
                        className="
                          group
                          relative
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          shadow-sm
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:border-indigo-200
                          hover:shadow-xl
                          hover:shadow-indigo-100
                        "
                      >

                        {/* TOP GRADIENT */}

                        <div className="
                          h-1.5
                          w-full
                          bg-gradient-to-r
                          from-blue-500
                          via-indigo-500
                          to-purple-600
                        " />

                        <div className="
                          flex
                          h-full
                          flex-col
                          p-5
                        ">

                          {/* TITLE */}

                          <div className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          ">

                            <h2 className="
                              line-clamp-2
                              text-lg
                              font-extrabold
                              leading-6
                              text-slate-900
                              transition
                              group-hover:text-indigo-700
                            ">
                              {job.title}
                            </h2>

                            <span className="
                              shrink-0
                              rounded-lg
                              bg-gradient-to-r
                              from-blue-50
                              to-purple-50
                              px-2
                              py-1
                              text-[10px]
                              font-bold
                              text-indigo-700
                              ring-1
                              ring-inset
                              ring-indigo-100
                            ">
                              JOB
                            </span>

                          </div>

                          {/* DESCRIPTION */}

                          <p className="
                            mt-3
                            line-clamp-3
                            min-h-[60px]
                            text-sm
                            leading-5
                            text-slate-500
                          ">
                            {job.description ||
                              "No description available."}
                          </p>

                          {/* DETAILS */}

                          <div className="mt-4 space-y-2">

                            {/* PRICE */}

                            <div className="
                              flex
                              items-center
                              justify-between
                              rounded-xl
                              bg-emerald-50
                              px-3
                              py-2
                            ">

                              <span className="
                                text-xs
                                font-semibold
                                text-emerald-700
                              ">
                                Job Amount
                              </span>

                              <span className="
                                text-sm
                                font-extrabold
                                text-emerald-600
                              ">
                                ₹{job.amount}
                              </span>

                            </div>

                            {/* WORK */}

                            {job.workType && (
                              <div className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-blue-50
                                px-3
                                py-2
                              ">

                                <span className="
                                  text-[11px]
                                  font-bold
                                  text-blue-600
                                ">
                                  Work
                                </span>

                                <span className="
                                  truncate
                                  text-xs
                                  font-semibold
                                  text-slate-700
                                ">
                                  {job.workType}
                                </span>

                              </div>
                            )}

                            {/* STATE */}

                            <div className="
                              flex
                              items-center
                              gap-2
                              rounded-lg
                              bg-purple-50
                              px-3
                              py-2
                            ">

                              <span className="
                                text-[11px]
                                font-bold
                                text-purple-600
                              ">
                                State
                              </span>

                              <span className="
                                truncate
                                text-xs
                                font-semibold
                                text-slate-700
                              ">
                                {job.state ||
                                  job.location?.state ||
                                  "India"}
                              </span>

                            </div>

                            {/* DISTRICT */}

                            {job.district && (
                              <div className="
                                flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-indigo-50
                                px-3
                                py-2
                              ">

                                <span className="
                                  text-[11px]
                                  font-bold
                                  text-indigo-600
                                ">
                                  District
                                </span>

                                <span className="
                                  truncate
                                  text-xs
                                  font-semibold
                                  text-slate-700
                                ">
                                  {job.district}
                                </span>

                              </div>
                            )}

                            {/* LOCATION */}

                            {job.location?.address && (
                              <div className="
                                rounded-lg
                                bg-slate-50
                                px-3
                                py-2
                              ">

                                <p className="
                                  text-[10px]
                                  font-bold
                                  text-slate-400
                                ">
                                  📍 Location
                                </p>

                                <p className="
                                  mt-0.5
                                  line-clamp-2
                                  text-xs
                                  font-medium
                                  leading-4
                                  text-slate-600
                                ">
                                  {job.location.address}
                                </p>

                              </div>
                            )}

                            {/* POSTED */}

                            {job.createdAt && (
                              <div className="
                                flex
                                items-center
                                justify-between
                                pt-1
                              ">

                                <span className="
                                  text-[10px]
                                  font-medium
                                  text-slate-400
                                ">
                                  Posted
                                </span>

                                <span className="
                                  text-[10px]
                                  font-semibold
                                  text-slate-500
                                ">
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
                            onClick={() => {
                              setSelectedJob(job);

                              setAmountInRupees(
                                10
                              );

                              setNote(
                                `Applying for ${job.title}`
                              );

                              setError("");
                            }}
                            className="
                              mt-5
                              w-full
                              rounded-xl
                              bg-gradient-to-r
                              from-blue-600
                              via-indigo-600
                              to-purple-600
                              py-3
                              text-sm
                              font-extrabold
                              text-white
                              shadow-md
                              shadow-indigo-100
                              transition-all
                              duration-200
                              hover:-translate-y-0.5
                              hover:shadow-lg
                              hover:shadow-indigo-200
                            "
                          >
                            Apply Now
                          </button>

                        </div>

                      </article>

                    )
                  )}

                </div>
              )}

            </section>
          )}

      </main>

      {/* =================================================
          APPLY MODAL
      ================================================= */}

      {selectedJob && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-slate-950/70
            px-3
            py-5
            backdrop-blur-sm
            sm:px-5
          "
          onClick={handleCloseModal}
        >

          <div
            className="
              jobhir-scrollbar
              relative
              max-h-[94vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-3xl
              border
              border-white/20
              bg-white
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="
              sticky
              top-0
              z-10
              bg-gradient-to-r
              from-blue-700
              via-indigo-700
              to-purple-700
              px-5
              py-5
              text-white
              shadow-md
              sm:px-6
            ">

              {/* CLOSE */}

              <button
                type="button"
                onClick={handleCloseModal}
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-lg
                  text-white
                  backdrop-blur
                  transition
                  hover:bg-white/20
                "
              >
                ✕
              </button>

              <p className="
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-blue-100
              ">
                Job Application
              </p>

              <h2 className="
                mt-1
                pr-10
                text-xl
                font-extrabold
                sm:text-2xl
              ">
                Apply for {selectedJob.title}
              </h2>

              <div className="
                mt-3
                inline-flex
                items-center
                rounded-lg
                bg-white/10
                px-3
                py-1.5
                text-xs
                font-semibold
                backdrop-blur-sm
              ">
                Application Fee: ₹
                {amountInRupees || 0}
              </div>

            </div>

            {/* =================================================
                MODAL BODY
            ================================================= */}

            <div className="p-5 sm:p-6">

              <div className="grid gap-4">

                {/* NAME */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-slate-600
                  ">
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
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                </div>

                {/* MOBILE */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-slate-600
                  ">
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
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-slate-600
                  ">
                    Email
                    <span className="
                      ml-1
                      font-normal
                      text-slate-400
                    ">
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
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                </div>

                {/* =================================================
                    EMPLOYER LOCATION
                ================================================= */}

                <div className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-indigo-100
                  bg-gradient-to-br
                  from-blue-50
                  to-purple-50
                ">

                  {/* LOCATION HEADER */}

                  <div className="
                    flex
                    items-start
                    gap-3
                    border-b
                    border-indigo-100
                    px-4
                    py-3
                  ">

                    <div className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-br
                      from-blue-600
                      to-purple-600
                      text-lg
                      text-white
                      shadow-sm
                    ">
                      📍
                    </div>

                    <div className="min-w-0">

                      <p className="
                        text-sm
                        font-extrabold
                        text-slate-800
                      ">
                        Job Location
                      </p>

                      <p className="
                        mt-0.5
                        text-xs
                        text-slate-500
                      ">
                        Location provided by the job poster
                      </p>

                    </div>

                  </div>

                  <div className="p-3">

                    {/* ADDRESS */}

                    <div className="
                      rounded-xl
                      border
                      border-slate-100
                      bg-white
                      p-3
                    ">

                      <p className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-slate-400
                      ">
                        Address
                      </p>

                      <p className="
                        mt-1
                        text-sm
                        font-semibold
                        leading-5
                        text-slate-700
                      ">
                        {selectedJob.location?.address ||
                          "Location provided by employer"}
                      </p>

                    </div>

                    {/* LOCATION DETAILS */}

                    <div className="
                      mt-3
                      grid
                      grid-cols-2
                      gap-2
                    ">

                      {/* VILLAGE */}

                      {selectedJob.location?.village && (
                        <div className="
                          rounded-xl
                          border
                          border-slate-100
                          bg-white
                          p-3
                        ">

                          <p className="
                            text-[10px]
                            font-bold
                            text-slate-400
                          ">
                            Village
                          </p>

                          <p className="
                            mt-1
                            truncate
                            text-xs
                            font-semibold
                            text-slate-700
                          ">
                            {
                              selectedJob
                                .location
                                .village
                            }
                          </p>

                        </div>
                      )}

                      {/* LOCALITY */}

                      {selectedJob.location?.locality && (
                        <div className="
                          rounded-xl
                          border
                          border-slate-100
                          bg-white
                          p-3
                        ">

                          <p className="
                            text-[10px]
                            font-bold
                            text-slate-400
                          ">
                            Locality / Mohalla
                          </p>

                          <p className="
                            mt-1
                            truncate
                            text-xs
                            font-semibold
                            text-slate-700
                          ">
                            {
                              selectedJob
                                .location
                                .locality
                            }
                          </p>

                        </div>
                      )}

                      {/* STATE */}

                      {(selectedJob.location?.state ||
                        selectedJob.state) && (

                        <div className="
                          rounded-xl
                          border
                          border-slate-100
                          bg-white
                          p-3
                        ">

                          <p className="
                            text-[10px]
                            font-bold
                            text-slate-400
                          ">
                            State
                          </p>

                          <p className="
                            mt-1
                            truncate
                            text-xs
                            font-semibold
                            text-slate-700
                          ">
                            {selectedJob.location?.state ||
                              selectedJob.state}
                          </p>

                        </div>
                      )}

                      {/* DISTRICT */}

                      {(selectedJob.location?.district ||
                        selectedJob.district) && (

                        <div className="
                          rounded-xl
                          border
                          border-slate-100
                          bg-white
                          p-3
                        ">

                          <p className="
                            text-[10px]
                            font-bold
                            text-slate-400
                          ">
                            District
                          </p>

                          <p className="
                            mt-1
                            truncate
                            text-xs
                            font-semibold
                            text-slate-700
                          ">
                            {selectedJob.location?.district ||
                              selectedJob.district}
                          </p>

                        </div>
                      )}

                      {/* PIN */}

                      {selectedJob.location?.postcode && (
                        <div className="
                          rounded-xl
                          border
                          border-slate-100
                          bg-white
                          p-3
                        ">

                          <p className="
                            text-[10px]
                            font-bold
                            text-slate-400
                          ">
                            PIN
                          </p>

                          <p className="
                            mt-1
                            text-xs
                            font-semibold
                            text-slate-700
                          ">
                            {
                              selectedJob
                                .location
                                .postcode
                            }
                          </p>

                        </div>
                      )}

                    </div>

                    {/* =================================================
                        MAP
                    ================================================= */}

                    {selectedJob.location?.latitude != null &&
                      selectedJob.location?.longitude != null && (

                        <div className="
                          mt-3
                          overflow-hidden
                          rounded-2xl
                          border
                          border-indigo-100
                          bg-white
                          p-1
                        ">

                          <div className="
                            h-56
                            w-full
                            overflow-hidden
                            rounded-xl
                            sm:h-64
                          ">

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

                {/* =================================================
                    APPLICATION FEE
                ================================================= */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-slate-600
                  ">
                    Application Fee
                  </label>

                  <div className="relative">

                    <span className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      font-bold
                      text-slate-500
                    ">
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
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-3
                        pl-8
                        text-sm
                        font-semibold
                        text-slate-800
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-100
                      "
                    />

                  </div>

                </div>

                {/* NOTE */}

                <div>

                  <label className="
                    mb-1.5
                    block
                    text-xs
                    font-bold
                    text-slate-600
                  ">
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
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-3
                      text-sm
                      text-slate-800
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />

                </div>

              </div>

              {/* ERROR */}

              {error && (

                <div className="
                  mt-4
                  rounded-xl
                  border
                  border-red-100
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-600
                ">
                  {error}
                </div>

              )}

              {/* SECURE PAYMENT INFO */}

              <div className="
                mt-5
                rounded-2xl
                border
                border-amber-100
                bg-amber-50
                p-3
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-3
                ">

                  <div>

                    <p className="
                      text-xs
                      font-bold
                      text-amber-800
                    ">
                      Secure Application
                    </p>

                    <p className="
                      mt-0.5
                      text-[11px]
                      text-amber-700
                    ">
                      You will be redirected to the secure payment page.
                    </p>

                  </div>

                  <span className="
                    shrink-0
                    rounded-lg
                    bg-white
                    px-2
                    py-1
                    text-xs
                    font-extrabold
                    text-amber-700
                    shadow-sm
                  ">
                    ₹{amountInRupees || 0}
                  </span>

                </div>

              </div>

              {/* =================================================
                  PAY & APPLY
              ================================================= */}

              <button
                type="button"
                onClick={createOrder}
                disabled={loading}
                className="
                  mt-5
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-600
                  to-purple-600
                  py-3.5
                  text-sm
                  font-extrabold
                  text-white
                  shadow-lg
                  shadow-indigo-200
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  hover:shadow-indigo-300
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  disabled:hover:translate-y-0
                "
              >

                {loading ? (
                  <>
                    <span className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    " />

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

              <p className="
                mt-3
                text-center
                text-[10px]
                text-slate-400
              ">
                By continuing, you agree to proceed with this job application.
              </p>

            </div>

          </div>

        </div>
      )}
      <HealthcareJobs/>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>
  );
}
