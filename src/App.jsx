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
// APP
// ======================================================

export default function App() {
  const navigate = useNavigate();

  // ====================================================
  // DISTRICTS
  // ====================================================

  const fixedDistricts = [
    "Nagaon",
    "Morigaon",
    "Hojai",
    "Kamrup",
    "Sunitpur",
    "Dhubri",
    "Borpeta",
    "Hajo",
  ];

  // ====================================================
  // JOB STATES
  // ====================================================

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [districtList, setDistrictList] =
    useState(fixedDistricts);

  const [selectedDistrict, setSelectedDistrict] =
    useState("All");

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
  // SCROLLER STYLE
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

      const formatted =
        now.toLocaleString("en-IN", {
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

    const timer =
      setInterval(updateTime, 1000);

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
        setFilteredJobs(fetchedJobs);

        // API se districts
        const apiDistricts = [
          ...new Set(
            fetchedJobs
              .map((job) => job?.district)
              .filter(Boolean)
          ),
        ];

        // Fixed + API districts
        const mergedDistricts =
          Array.from(
            new Set([
              ...fixedDistricts,
              ...apiDistricts,
            ])
          );

        setDistrictList(
          mergedDistricts
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
  // FILTER JOBS
  // ====================================================

  useEffect(() => {
    if (selectedDistrict === "All") {
      setFilteredJobs(jobs);
      return;
    }

    setFilteredJobs(
      jobs.filter(
        (job) =>
          job?.district ===
          selectedDistrict
      )
    );
  }, [
    selectedDistrict,
    jobs,
  ]);

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
  // APPLY / CREATE PAYMENT ORDER
  // ====================================================

  const createOrder = async () => {
    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

    if (!customerName.trim()) {
      alert("Please enter your name.");
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

      // ------------------------------------------------
      // PAYMENT AMOUNT
      // ₹10 = 1000 paise
      // ------------------------------------------------

      const amount = Math.round(
        Number(amountInRupees) * 100
      );

      // ------------------------------------------------
      // SAVE WORKER MOBILE
      // ------------------------------------------------

      localStorage.setItem(
        "mobileNumber",
        mobileNumber
      );

      // ------------------------------------------------
      // CREATE ORDER
      // ------------------------------------------------
      //
      // IMPORTANT:
      // Worker ki location nahi bhej rahe.
      //
      // Sirf Employer ki job location:
      // selectedJob.location
      //
      // Agar location nahi hai to bhi
      // payment/apply ko block nahi karenge.
      // ------------------------------------------------

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

            // Employer ki location
            // Worker ki location nahi
            location:
              selectedJob.location ||
              null,
          }
        );

      // ------------------------------------------------
      // CHECKOUT
      // ------------------------------------------------

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
    <div className="min-h-screen bg-gray-100 text-black">

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

      <div className="bg-white py-1 overflow-hidden">
        <p className="scroller text-center font-semibold text-xs">
          {currentTime} / Find your dream job today!{" "}
          100% Secure & Safe!
        </p>
      </div>

      {/* =================================================
          REGISTER + DISTRICT
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 mt-4 flex justify-end items-center gap-2">

        {/* REGISTER */}

        <button
          onClick={() => {
            window.location.href =
              "/worker-register";
          }}
          className="w-32 h-10 bg-[#9B845E] text-white font-semibold border border-[#9B845E] hover:bg-[#866F4D] transition-colors duration-200 focus:outline-none"
        >
          Register
        </button>

        {/* DESKTOP DISTRICT */}

        <select
          value={selectedDistrict}
          onChange={(e) =>
            setSelectedDistrict(
              e.target.value
            )
          }
          className="hidden sm:inline-block w-32 h-10 px-3 bg-[#E8E0CF] text-[#333333] font-semibold border border-[#D5C9B0] hover:bg-[#DDD3C0] transition-colors duration-200 focus:outline-none"
        >
          <option value="All">
            Districts
          </option>

          {districtList.map(
            (district) => (
              <option
                key={district}
                value={district}
              >
                {district}
              </option>
            )
          )}
        </select>

        {/* MOBILE DISTRICT */}

        <div className="sm:hidden">
          <select
            value={selectedDistrict}
            onChange={(e) =>
              setSelectedDistrict(
                e.target.value
              )
            }
            className="w-32 h-10 px-3 bg-[#E8E0CF] text-[#333333] font-semibold border border-[#D5C9B0] hover:bg-[#DDD3C0] transition-colors duration-200 focus:outline-none"
          >
            <option value="All">
              Districts
            </option>

            {districtList.map(
              (district) => (
                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* =================================================
          JOB CARDS
      ================================================= */}

      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 px-4">

        {/* LOADING */}

        {loadingJobs && (
          <div className="col-span-full flex justify-center items-center py-20">

            <div className="relative">

              <div className="w-16 h-16 rounded-full border-4 border-blue-200"></div>

              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>

            </div>
          </div>
        )}

        {/* NO JOB */}

        {!loadingJobs &&
          filteredJobs.length === 0 && (
            <p className="text-center col-span-full text-lg font-semibold text-gray-700">
              No jobs found for this district.
            </p>
          )}

        {/* JOB LIST */}

        {!loadingJobs &&
          filteredJobs
            .filter(
              (job) =>
                !appliedJobs.includes(
                  job?._id
                )
            )
            .map((job) => (
              <div
                key={job._id}
                className="relative rounded-2xl p-1 shadow-2xl hover:scale-105 transition-all duration-300"
              >

                <div className="bg-white rounded-2xl p-5 flex flex-col justify-between">

                  {/* TITLE */}

                  <h2 className="text-xl font-bold mb-2 text-gray-900">
                    {job.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="text-gray-700 mb-4">
                    {job.description}
                  </p>

                  {/* DETAILS */}

                  <ul className="text-black mb-4 space-y-1 text-sm">

                    <li>
                      <strong className="text-green-500">
                        Price:
                      </strong>{" "}
                      {job.amount} ₹
                    </li>

                    <li>
                      <strong className="text-fuchsia-700">
                        District:
                      </strong>{" "}
                      {job.district}
                    </li>

                    {/* EMPLOYER LOCATION */}

                    {job.location?.address && (
                      <li>
                        <strong className="text-red-500">
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
                      setSelectedJob(job);

                      setAmountInRupees(10);

                      setNote(
                        `Applying for ${job.title}`
                      );

                      setError("");
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition blink"
                  >
                    Apply Now
                  </button>

                </div>
              </div>
            ))}
      </div>

      {/* =================================================
          APPLY MODAL
      ================================================= */}

      {selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto"
          onClick={handleCloseModal}
        >

          <div
            className="bg-white rounded-xl shadow-2xl p-5 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-black hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* TITLE */}

            <h2 className="text-2xl font-bold text-center mb-5 text-black pr-6">
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
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
              />

              {/* MOBILE */}

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
                placeholder="Mobile Number"
                maxLength={10}
                inputMode="numeric"
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
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
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
              />

              {/* =================================================
                  EMPLOYER JOB LOCATION
                  
                  IMPORTANT:
                  Yahan worker ki location nahi hai.
                  Ye sirf employer ki location hai.
              ================================================= */}

              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">

                <div className="flex items-start gap-3">

                  <div className="text-red-500 text-xl">
                    📍
                  </div>

                  <div className="min-w-0">

                    <p className="font-semibold text-gray-800 text-sm">
                      Job Location
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Location provided by the job poster
                    </p>

                  </div>
                </div>

                {/* ADDRESS */}

                <div className="mt-3 bg-white rounded-lg p-3 border border-gray-100">

                  <p className="text-xs text-gray-400 mb-1">
                    Address
                  </p>

                  <p className="text-sm font-medium text-gray-700 leading-5">
                    {selectedJob.location?.address ||
                      "Location provided by employer"}
                  </p>

                </div>

                {/* LOCATION DETAILS */}

                <div className="grid grid-cols-2 gap-2 mt-3">

                  {selectedJob.location?.village && (
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-[10px] text-gray-400">
                        Village
                      </p>

                      <p className="text-xs font-medium text-gray-700">
                        {
                          selectedJob
                            .location
                            .village
                        }
                      </p>
                    </div>
                  )}

                  {selectedJob.location?.locality && (
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-[10px] text-gray-400">
                        Locality / Mohalla
                      </p>

                      <p className="text-xs font-medium text-gray-700">
                        {
                          selectedJob
                            .location
                            .locality
                        }
                      </p>
                    </div>
                  )}

                  {(selectedJob.location?.district ||
                    selectedJob.district) && (
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-[10px] text-gray-400">
                        District
                      </p>

                      <p className="text-xs font-medium text-gray-700">
                        {selectedJob.location?.district ||
                          selectedJob.district}
                      </p>
                    </div>
                  )}

                  {selectedJob.location?.postcode && (
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-[10px] text-gray-400">
                        PIN
                      </p>

                      <p className="text-xs font-medium text-gray-700">
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
                    EMPLOYER LOCATION MAP

                    Map sirf tab dikhega jab employer ne
                    latitude + longitude save kiya ho.
                    
                    Iske missing hone par Apply BLOCK nahi hoga.
                ================================================= */}

                {selectedJob.location?.latitude != null &&
                  selectedJob.location?.longitude != null && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">

                      <div className="h-52 w-full">

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
                value={amountInRupees}
                onChange={(e) =>
                  setAmountInRupees(
                    e.target.value
                  )
                }
                min="1"
                placeholder="Application Fee"
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
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
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
              />

            </div>

            {/* ERROR */}

            {error && (
              <p className="text-red-600 mt-2 text-sm">
                {error}
              </p>
            )}

            {/* =================================================
                PAY & APPLY
            ================================================= */}

            <button
              onClick={createOrder}
              disabled={loading}
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg shadow-md transition-all"
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