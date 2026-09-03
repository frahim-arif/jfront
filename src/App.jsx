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
      background:#ef4444;
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 3px 10px rgba(0,0,0,.35);
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
  // States
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

  // Union Territories
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

  const [stateList, setStateList] =
    useState(INDIA_STATES);

  const [selectedState, setSelectedState] =
    useState("All");

  // ====================================================
  // SELECTED WORK TYPE / CATEGORY
  // ====================================================

  const [selectedWorkType, setSelectedWorkType] =
    useState(null);

  // ====================================================
  // SELECTED JOB
  // ====================================================

  const [selectedJob, setSelectedJob] =
    useState(null);

  // ====================================================
  // APPLY / PAYMENT
  // ====================================================

  const [customerName, setCustomerName] =
    useState("");

  const [mobileNumber, setMobileNumber] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [amountInRupees, setAmountInRupees] =
    useState(10);

  const [note, setNote] =
    useState("Order for job");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loadingJobs, setLoadingJobs] =
    useState(true);

  // ====================================================
  // LIVE TIME
  // ====================================================

  const [currentTime, setCurrentTime] =
    useState("");

  // ====================================================
  // SCROLLER + LEAFLET STYLE
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
        animation: scrollText 12s linear infinite;
      }

      .jobhir-location-marker {
        background: transparent !important;
        border: none !important;
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

      const formatted = now.toLocaleString(
        "en-IN",
        {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      );

      setCurrentTime(formatted);
    };

    updateTime();

    const timer = setInterval(
      updateTime,
      1000
    );

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

        const fetchedJobs =
          res.data?.jobs || [];

        setJobs(fetchedJobs);

        setFilteredJobs(
          fetchedJobs
        );

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

        const mergedStates =
          Array.from(
            new Set([
              ...INDIA_STATES,
              ...apiStates,
            ])
          ).sort();

        setStateList(
          mergedStates
        );
      } catch (err) {
        console.error(
          "Error fetching jobs:",
          err
        );
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
  // Applied jobs ko hide rakhenge
  // ====================================================

  const availableJobs =
    filteredJobs.filter(
      (job) =>
        !appliedJobs.includes(
          job?._id
        )
    );

  // ====================================================
  // ALL AVAILABLE WORK TYPES
  // ====================================================
  //
  // WORK_TYPES ke saath database me agar koi naya
  // workType aaye to wo bhi automatically category
  // me add ho jayega.
  //
  // ====================================================

  const availableWorkTypes =
    Array.from(
      new Set([
        ...WORK_TYPES,

        ...jobs
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
          availableJobs.filter(
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

    setNote(
      "Order for job"
    );

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
      alert(
        "Please enter your name."
      );
      return;
    }

    if (
      !/^\d{10}$/.test(
        mobileNumber
      )
    ) {
      alert(
        "Please enter a valid 10 digit mobile number."
      );
      return;
    }

    if (
      !amountInRupees ||
      Number(amountInRupees) <= 0
    ) {
      alert(
        "Please enter a valid amount."
      );
      return;
    }

    if (!selectedJob) {
      alert(
        "Please select a job first."
      );
      return;
    }

    try {
      setError("");
      setLoading(true);

      // ==================================================
      // PAYMENT AMOUNT
      // ==================================================

      const amount = Math.round(
        Number(amountInRupees) *
          100
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

      const res =
        await axios.post(
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
              selectedJob._id ||
              null,

            // Employer location
            location:
              selectedJob.location ||
              null,
          }
        );

      // ==================================================
      // CHECKOUT
      // ==================================================

      if (
        res.data?.checkoutPageUrl
      ) {
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
        err.response?.data
          ?.message ||
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
    <div className="
      min-h-screen
      bg-gray-100
      text-black
    ">

      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        onOfferJobClick={() =>
          navigate("/offer-job")
        }
      />

      {/* =================================================
          SCROLLING BAR
      ================================================= */}

      <div className="
        bg-white
        py-1
        overflow-hidden
      ">

        <p className="
          scroller
          text-center
          font-semibold
          text-xs
        ">
          {currentTime} / Find your dream job today!{" "}
          100% Secure & Safe!
        </p>

      </div>

      {/* =================================================
          REGISTER + STATE FILTER
      ================================================= */}

      <div className="
        max-w-7xl
        mx-auto
        px-4
        mt-4
        flex
        justify-end
        items-center
        gap-2
      ">

        {/* REGISTER */}

        <button
          onClick={() =>
            navigate(
              "/worker-register"
            )
          }
          className="
            w-32
            h-10
            bg-[#9B845E]
            text-white
            font-semibold
            border
            border-[#9B845E]
            hover:bg-[#866F4D]
            transition-colors
            duration-200
            focus:outline-none
          "
        >
          Register
        </button>

        {/* STATE SELECT */}

        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(
              e.target.value
            );

            // State change hone par
            // category reset
            setSelectedWorkType(
              null
            );
          }}
          className="
            w-40
            h-10
            px-3
            bg-[#E8E0CF]
            text-[#333333]
            font-semibold
            border
            border-[#D5C9B0]
            hover:bg-[#DDD3C0]
            transition-colors
            duration-200
            focus:outline-none
          "
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

      </div>

      {/* =================================================
          SELECTED STATE INFO
      ================================================= */}

      <div className="
        max-w-7xl
        mx-auto
        px-4
        mt-3
        sm:mt-4
      ">

        <div className="
          bg-white
          border
          border-gray-200
          rounded-xl
          shadow-sm
          px-3
          py-2
          sm:px-4
          sm:py-3
        ">

          <div className="
            flex
            items-center
            justify-between
            gap-3
          ">

            {/* STATE */}

            <div className="min-w-0">

              <p className="
                text-[10px]
                sm:text-xs
                text-gray-400
                font-medium
              ">
                Showing jobs from
              </p>

              <div className="
                flex
                items-center
                gap-1.5
                mt-0.5
              ">

                <span className="
                  text-sm
                  sm:text-base
                ">
                  🇮🇳
                </span>

                <p className="
                  font-bold
                  text-gray-800
                  text-sm
                  sm:text-base
                  truncate
                ">
                  {selectedState === "All"
                    ? "All India"
                    : selectedState}
                </p>

              </div>

            </div>

            {/* JOB COUNT */}

            <div className="
              flex
              items-center
              gap-2
              shrink-0
            ">

              <div className="
                hidden
                sm:block
                text-right
              ">

                <p className="
                  text-xs
                  text-gray-400
                  font-medium
                ">
                  {selectedWorkType
                    ? selectedWorkType
                    : "Available Jobs"}
                </p>

              </div>

              <div className="
                min-w-[38px]
                h-8
                sm:h-9
                px-2.5
                rounded-lg
                bg-blue-50
                border
                border-blue-100
                flex
                items-center
                justify-center
              ">

                <span className="
                  font-bold
                  text-blue-600
                  text-sm
                  sm:text-base
                ">
                  {selectedWorkType
                    ? categoryJobs.length
                    : availableJobs.length}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          CATEGORY / JOB SECTION
      ================================================= */}

      <div className="
        max-w-7xl
        mx-auto
        mt-6
        px-4
      ">

        {/* =================================================
            LOADING
        ================================================= */}

        {loadingJobs && (
          <div className="
            flex
            justify-center
            items-center
            py-20
          ">

            <div className="relative">

              <div className="
                w-16
                h-16
                rounded-full
                border-4
                border-blue-200
              " />

              <div className="
                absolute
                top-0
                left-0
                w-16
                h-16
                rounded-full
                border-4
                border-blue-600
                border-t-transparent
                animate-spin
              " />

              <div className="
                absolute
                inset-0
                flex
                justify-center
                items-center
              ">

                <div className="
                  w-3
                  h-3
                  bg-blue-600
                  rounded-full
                  animate-pulse
                " />

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            NO JOBS
        ================================================= */}

        {!loadingJobs &&
          availableJobs.length === 0 && (

            <div className="
              text-center
              py-16
            ">

              <div className="
                text-5xl
                mb-4
              ">
                🔍
              </div>

              <p className="
                text-lg
                font-semibold
                text-gray-700
              ">
                No jobs found.
              </p>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">
                Try selecting another state.
              </p>

            </div>
          )}

        {/* =================================================
            CATEGORY LIST
        ================================================= */}

        {!loadingJobs &&
          availableJobs.length > 0 &&
          !selectedWorkType && (

            <div>

              {/* TITLE */}

              <div className="
                mb-5
                text-center
              ">

              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-100">
    Explore Opportunities
  </span>

              </div>

              {/* CATEGORY GRID */}

              <div className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                gap-3
                sm:gap-5
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
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        p-4
                        sm:p-5
                        text-left
                        shadow-sm
                        hover:shadow-xl
                        hover:border-blue-400
                        hover:-translate-y-1
                        transition-all
                        duration-200
                      "
                    >

                      {/* CATEGORY */}

                      <div className="
                        min-h-[52px]
                        flex
                        items-center
                      ">

                        <h3 className="
                          text-base
                          sm:text-lg
                          font-bold
                          text-gray-800
                          group-hover:text-blue-600
                          transition
                        ">
                          {workType}
                        </h3>

                      </div>

                      {/* COUNT */}

                      <div className="
                        mt-3
                        flex
                        items-center
                        justify-between
                      ">

                        <span className="
                          text-xs
                          sm:text-sm
                          text-gray-500
                        ">
                          Available Jobs
                        </span>

                        <span className="
                          min-w-[30px]
                          h-7
                          px-2
                          rounded-full
                          bg-blue-50
                          text-blue-600
                          border
                          border-blue-100
                          flex
                          items-center
                          justify-center
                          text-xs
                          sm:text-sm
                          font-bold
                        ">
                          {count}
                        </span>

                      </div>

                    </button>
                  )
                )}

              </div>

            </div>
          )}

        {/* =================================================
            SELECTED CATEGORY
        ================================================= */}

        {!loadingJobs &&
          selectedWorkType && (

            <div>

              {/* CATEGORY HEADER */}

              <div className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                shadow-sm
                p-4
                mb-6
              ">

                <div className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                ">

                  {/* BACK */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(
                        null
                      )
                    }
                    className="
                      w-fit
                      px-4
                      py-2
                      rounded-lg
                      bg-gray-100
                      hover:bg-gray-200
                      text-gray-700
                      font-semibold
                      text-sm
                      transition
                    "
                  >
                    ← Back to Categories
                  </button>

                  {/* CATEGORY */}

                  <div className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  ">

                    <div>

                      <p className="
                        text-xs
                        text-gray-400
                      ">
                        Work Category
                      </p>

                      <h2 className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-gray-800
                      ">
                        {selectedWorkType}
                      </h2>

                    </div>

                    <div className="
                      min-w-[45px]
                      h-10
                      px-3
                      rounded-lg
                      bg-blue-50
                      border
                      border-blue-100
                      flex
                      items-center
                      justify-center
                    ">

                      <span className="
                        text-blue-600
                        font-bold
                      ">
                        {categoryJobs.length}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  CATEGORY JOBS
              ================================================= */}

              {categoryJobs.length === 0 && (

                <div className="
                  text-center
                  py-16
                ">

                  <div className="
                    text-5xl
                    mb-4
                  ">
                    🔍
                  </div>

                  <p className="
                    text-lg
                    font-semibold
                    text-gray-700
                  ">
                    No jobs found in this category.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedWorkType(
                        null
                      )
                    }
                    className="
                      mt-4
                      px-5
                      py-2
                      bg-blue-600
                      text-white
                      rounded-lg
                      font-semibold
                      hover:bg-blue-700
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
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  gap-7
                ">

                  {categoryJobs.map(
                    (job) => (

                      <div
                        key={job._id}
                        className="
                          relative
                          rounded-2xl
                          p-1
                          shadow-2xl
                          hover:scale-105
                          transition-all
                          duration-300
                        "
                      >

                        <div className="
                          bg-white
                          rounded-2xl
                          p-5
                          flex
                          flex-col
                          justify-between
                          h-full
                        ">

                          {/* TITLE */}

                          <h2 className="
                            text-xl
                            font-bold
                            mb-2
                            text-gray-900
                          ">
                            {job.title}
                          </h2>

                          {/* DESCRIPTION */}

                          <p className="
                            text-gray-700
                            mb-4
                          ">
                            {job.description}
                          </p>

                          {/* DETAILS */}

                          <ul className="
                            text-black
                            mb-4
                            space-y-1
                            text-sm
                          ">

                            {/* PRICE */}

                            <li>
                              <strong className="
                                text-green-500
                              ">
                                Price:
                              </strong>{" "}
                              {job.amount} ₹
                            </li>

                            {/* WORK TYPE */}

                            {job.workType && (
                              <li>
                                <strong className="
                                  text-blue-600
                                ">
                                  Work:
                                </strong>{" "}
                                {job.workType}
                              </li>
                            )}

                            {/* STATE */}

                            <li>
                              <strong className="
                                text-purple-700
                              ">
                                State:
                              </strong>{" "}
                              {job.state ||
                                job.location?.state ||
                                "India"}
                            </li>

                            {/* DISTRICT */}

                            {job.district && (
                              <li>
                                <strong className="
                                  text-fuchsia-700
                                ">
                                  District:
                                </strong>{" "}
                                {job.district}
                              </li>
                            )}

                            {/* LOCATION */}

                            {job.location?.address && (
                              <li>
                                <strong className="
                                  text-red-500
                                ">
                                  📍 Location:
                                </strong>{" "}
                                {job.location.address}
                              </li>
                            )}

                            {/* POSTED */}

                            {job.createdAt && (
                              <li>
                                <strong>
                                  Posted:
                                </strong>{" "}
                                {formatDistanceToNow(
                                  new Date(
                                    job.createdAt
                                  ),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </li>
                            )}

                          </ul>

                          {/* APPLY */}

                          <button
                            onClick={() => {

                              setSelectedJob(
                                job
                              );

                              setAmountInRupees(
                                10
                              );

                              setNote(
                                `Applying for ${job.title}`
                              );

                              setError("");

                            }}
                            className="
                              w-full
                              bg-blue-600
                              text-white
                              py-2
                              rounded-lg
                              font-semibold
                              hover:bg-gray-800
                              transition
                            "
                          >
                            Apply Now
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>
              )}

            </div>
          )}

      </div>

      {/* =================================================
          APPLY MODAL
      ================================================= */}

      {selectedJob && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            px-4
            py-6
            overflow-y-auto
          "
          onClick={handleCloseModal}
        >

          <div
            className="
              bg-white
              rounded-xl
              shadow-2xl
              p-5
              w-full
              max-w-md
              relative
              max-h-[90vh]
              overflow-y-auto
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              onClick={
                handleCloseModal
              }
              className="
                absolute
                top-3
                right-3
                text-black
                hover:text-gray-700
                text-xl
              "
            >
              ✕
            </button>

            {/* TITLE */}

            <h2 className="
              text-2xl
              font-bold
              text-center
              mb-5
              text-black
              pr-6
            ">
              Apply for{" "}
              {selectedJob.title}
            </h2>

            <div className="grid gap-4">

              {/* NAME */}

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                placeholder="Your Name"
                className="
                  p-3
                  border
                  border-gray-300
                  rounded-lg
                  w-full
                  focus:outline-none
                  focus:border-blue-500
                "
              />

              {/* MOBILE */}

              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(
                    e.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        10
                      )
                  )
                }
                placeholder="Mobile Number"
                maxLength={10}
                inputMode="numeric"
                className="
                  p-3
                  border
                  border-gray-300
                  rounded-lg
                  w-full
                  focus:outline-none
                  focus:border-blue-500
                "
              />

              {/* EMAIL */}

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Email (Optional)"
                className="
                  p-3
                  border
                  border-gray-300
                  rounded-lg
                  w-full
                  focus:outline-none
                  focus:border-blue-500
                "
              />

              {/* =================================================
                  EMPLOYER LOCATION
              ================================================= */}

              <div className="
                border
                border-gray-200
                rounded-xl
                p-3
                bg-gray-50
              ">

                <div className="
                  flex
                  items-start
                  gap-3
                ">

                  <div className="
                    text-red-500
                    text-xl
                  ">
                    📍
                  </div>

                  <div className="min-w-0">

                    <p className="
                      font-semibold
                      text-gray-800
                      text-sm
                    ">
                      Job Location
                    </p>

                    <p className="
                      text-xs
                      text-gray-500
                      mt-1
                    ">
                      Location provided by the job poster
                    </p>

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="
                  mt-3
                  bg-white
                  rounded-lg
                  p-3
                  border
                  border-gray-100
                ">

                  <p className="
                    text-xs
                    text-gray-400
                    mb-1
                  ">
                    Address
                  </p>

                  <p className="
                    text-sm
                    font-medium
                    text-gray-700
                    leading-5
                  ">
                    {selectedJob.location?.address ||
                      "Location provided by employer"}
                  </p>

                </div>

                {/* LOCATION DETAILS */}

                <div className="
                  grid
                  grid-cols-2
                  gap-2
                  mt-3
                ">

                  {/* VILLAGE */}

                  {selectedJob.location?.village && (
                    <div className="
                      bg-white
                      rounded-lg
                      p-2
                    ">

                      <p className="
                        text-[10px]
                        text-gray-400
                      ">
                        Village
                      </p>

                      <p className="
                        text-xs
                        font-medium
                        text-gray-700
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
                      bg-white
                      rounded-lg
                      p-2
                    ">

                      <p className="
                        text-[10px]
                        text-gray-400
                      ">
                        Locality / Mohalla
                      </p>

                      <p className="
                        text-xs
                        font-medium
                        text-gray-700
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
                      bg-white
                      rounded-lg
                      p-2
                    ">

                      <p className="
                        text-[10px]
                        text-gray-400
                      ">
                        State
                      </p>

                      <p className="
                        text-xs
                        font-medium
                        text-gray-700
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
                      bg-white
                      rounded-lg
                      p-2
                    ">

                      <p className="
                        text-[10px]
                        text-gray-400
                      ">
                        District
                      </p>

                      <p className="
                        text-xs
                        font-medium
                        text-gray-700
                      ">
                        {selectedJob.location?.district ||
                          selectedJob.district}
                      </p>

                    </div>
                  )}

                  {/* PIN */}

                  {selectedJob.location?.postcode && (
                    <div className="
                      bg-white
                      rounded-lg
                      p-2
                    ">

                      <p className="
                        text-[10px]
                        text-gray-400
                      ">
                        PIN
                      </p>

                      <p className="
                        text-xs
                        font-medium
                        text-gray-700
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
                      rounded-xl
                      border
                      border-gray-200
                    ">

                      <div className="
                        h-52
                        w-full
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
                          className="
                            h-full
                            w-full
                          "
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

              {/* =================================================
                  APPLICATION FEE
              ================================================= */}

              <input
                type="number"
                value={
                  amountInRupees
                }
                onChange={(e) =>
                  setAmountInRupees(
                    e.target.value
                  )
                }
                min="1"
                placeholder="Application Fee"
                className="
                  p-3
                  border
                  border-gray-300
                  rounded-lg
                  w-full
                  focus:outline-none
                  focus:border-blue-500
                "
              />

              {/* NOTE */}

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
                  p-3
                  border
                  border-gray-300
                  rounded-lg
                  w-full
                  focus:outline-none
                  focus:border-blue-500
                "
              />

            </div>

            {/* ERROR */}

            {error && (
              <p className="
                text-red-600
                mt-2
                text-sm
              ">
                {error}
              </p>
            )}

            {/* =================================================
                PAY & APPLY
            ================================================= */}

            <button
              onClick={
                createOrder
              }
              disabled={loading}
              className="
                mt-6
                w-full
                bg-yellow-400
                hover:bg-yellow-500
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-black
                font-semibold
                py-3
                rounded-lg
                shadow-md
                transition-all
              "
            >
              {loading
                ? "Processing..."
                : "Pay & Apply"}
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

    </div>
  );
}