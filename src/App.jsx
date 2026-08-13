import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import OfferJob from "./OfferJob.jsx";

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
      width: 34px;
      height: 34px;
      background: #ef4444;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 10px rgba(0,0,0,0.35);
      position: relative;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 9px;
        left: 9px;
      "></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

// ======================================================
// MAP CENTER COMPONENT
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
const navigate = useNavigate();
  // ====================================================
  // JOB STATES
  // ====================================================

  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [districtList, setDistrictList] = useState(fixedDistricts);
  const [selectedDistrict, setSelectedDistrict] = useState("All");

  // ====================================================
  // MODAL STATES
  // ====================================================

  const [selectedJob, setSelectedJob] = useState(null);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  // ====================================================
  // CUSTOMER / PAYMENT STATES
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
  // LOCATION STATES
  // ====================================================

  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ====================================================
  // SCROLLER
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

        const fetchedJobs = res.data.jobs || [];

        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);

        const apiDistricts = [
          ...new Set(
            fetchedJobs
              .map((job) => job.district)
              .filter(Boolean)
          ),
        ];

        const mergedDistricts = Array.from(
          new Set([...fixedDistricts, ...apiDistricts])
        );

        setDistrictList(mergedDistricts);
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

        setAppliedJobs(res.data.appliedJobIds || []);
      } catch (err) {
        console.error("Applied jobs fetch error:", err);
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
    } else {
      setFilteredJobs(
        jobs.filter(
          (job) => job.district === selectedDistrict
        )
      );
    }
  }, [selectedDistrict, jobs]);

  // ====================================================
  // RESET MODAL
  // ====================================================

  const handleCloseModal = () => {
    setSelectedJob(null);
    setShowOfferPopup(false);

    setCustomerName("");
    setMobileNumber("");
    setEmail("");
    setAmountInRupees(10);
    setNote("Order for job");

    setError("");

    // Location reset
    setUserLocation(null);
    setLocationError("");
    setLocationLoading(false);
  };

  // ====================================================
  // CURRENT LOCATION
  // ====================================================

  const detectCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "Your browser does not support location detection."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // --------------------------------------------
          // REVERSE GEOCODING
          // --------------------------------------------

          const response = await axios.get(
            "https://api.bigdatacloud.net/data/reverse-geocode-client",
            {
              params: {
                latitude,
                longitude,
                localityLanguage: "en",
              },
            }
          );

          const data = response.data || {};

          // --------------------------------------------
          // ADDRESS DATA
          // --------------------------------------------

          const locality =
            data.locality ||
            data.city ||
            "";

          const village =
            data.village ||
            data.locality ||
            data.city ||
            "";

          const district =
            data.city ||
            data.principalSubdivision ||
            "";

          const state =
            data.principalSubdivision ||
            "Assam";

          const postcode =
            data.postcode ||
            "";

          // Try to find neighbourhood / hamlet
          let detailedLocality = "";

          const informative =
            data.localityInfo?.informative || [];

          const localityTypes = [
            "neighbourhood",
            "neighborhood",
            "hamlet",
            "village",
            "suburb",
          ];

          const foundLocality = informative.find(
            (item) =>
              item?.name &&
              localityTypes.includes(
                String(item?.description || "").toLowerCase()
              )
          );

          if (foundLocality?.name) {
            detailedLocality = foundLocality.name;
          }

          // --------------------------------------------
          // FINAL ADDRESS
          // --------------------------------------------

          const addressParts = [
            detailedLocality,
            village,
            district,
            state,
            postcode,
          ].filter(Boolean);

          const uniqueAddressParts = [
            ...new Set(addressParts),
          ];

          const address = uniqueAddressParts.join(", ");

          // --------------------------------------------
          // SAVE LOCATION
          // --------------------------------------------

          const locationData = {
            latitude,
            longitude,
            address:
              address || "Current Location",
            village: village || "",
            locality:
              detailedLocality ||
              locality ||
              "",
            district: district || "",
            state: state || "Assam",
            postcode: postcode || "",
          };

          setUserLocation(locationData);

          // --------------------------------------------
          // AUTO DISTRICT
          // --------------------------------------------

          const matchedDistrict =
            fixedDistricts.find(
              (item) =>
                item.toLowerCase() ===
                String(district).toLowerCase()
            );

          if (matchedDistrict) {
            // We don't change the job filter.
            // This is only useful information for location.
            console.log(
              "Detected district:",
              matchedDistrict
            );
          }
        } catch (err) {
          console.error(
            "Reverse geocoding error:",
            err
          );

          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          setUserLocation({
            latitude,
            longitude,
            address: "Current Location",
            village: "",
            locality: "",
            district: "",
            state: "Assam",
            postcode: "",
          });

          setLocationError(
            "Map found, but detailed address could not be detected."
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error(
          "Current location error:",
          error
        );

        setLocationLoading(false);

        if (error.code === 1) {
          setLocationError(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Unable to detect your location."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            "Unable to detect your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // ====================================================
  // PAYMENT / APPLY
  // ====================================================

  const createOrder = async () => {
    if (
      !customerName.trim() ||
      !mobileNumber ||
      Number(amountInRupees) <= 0
    ) {
      alert("Please fill valid details!");
      return;
    }

    // Location required
    if (!userLocation) {
      alert(
        "Please select your current location before continuing."
      );
      return;
    }

    try {
      setError("");
      setLoading(true);

      const amount =
        Math.round(Number(amountInRupees) * 100);

      localStorage.setItem(
        "mobileNumber",
        mobileNumber
      );

      const res = await axios.post(
        "https://jbackend-h963.onrender.com/create-order",
        {
          amount,
          customerName,
          mobileNumber,
          email,
          note,

          jobId:
            selectedJob?._id || "offer_job",

          // LOCATION
          location: userLocation,
        }
      );

      if (res.data.checkoutPageUrl) {
        window.open(
          res.data.checkoutPageUrl,
          "_blank"
        );

        handleCloseModal();
      } else {
        setError(
          "Unable to get checkout URL"
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
    <div className="min-h-screen bg-gray-100 text-black">

      {/* HEADER */}
      <Header
  onOfferJobClick={() => navigate("/offer-job")}
/>

      {/* SCROLLING TIME BAR */}
      <div className="bg-white py-1 overflow-hidden">
        <p className="scroller text-center font-semibold text-xs">
          {currentTime} / Find your dream job today!
          {" "}100% Secure & Safe!
        </p>
      </div>

      {/* REGISTER + DISTRICT FILTER */}
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
            setSelectedDistrict(e.target.value)
          }
          className="hidden sm:inline-block w-32 h-10 px-3 bg-[#E8E0CF] text-[#333333] font-semibold border border-[#D5C9B0] hover:bg-[#DDD3C0] transition-colors duration-200 focus:outline-none"
        >
          <option value="All">
            Districts
          </option>

          {districtList.map(
            (district, index) => (
              <option
                key={index}
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
              (district, index) => (
                <option
                  key={index}
                  value={district}
                >
                  {district}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* JOB CARDS */}
      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 px-4">

        {loadingJobs ? (
          <div className="col-span-full flex justify-center items-center py-20">

            <div className="relative">

              <div className="w-16 h-16 rounded-full border-4 border-blue-200"></div>

              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>

            </div>

          </div>
        ) : filteredJobs.length === 0 ? (
          <p className="text-center col-span-full text-lg font-semibold text-gray-700">
            No jobs found for this district.
          </p>
        ) : null}

        {/* JOB LIST */}
        {filteredJobs
          .filter(
            (job) =>
              !appliedJobs.includes(
                job._id
              )
          )
          .map((job) => (
            <div
              key={job._id}
              className="relative rounded-2xl p-1 shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white rounded-2xl p-5 flex flex-col justify-between">

                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  {job.title}
                </h2>

                <p className="text-gray-700 mb-4">
                  {job.description}
                </p>

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

                  {/* LOCATION PREVIEW */}
                  {job.location?.address && (
                    <li>
                      <strong className="text-red-500">
                        📍 Location:
                      </strong>{" "}
                      {job.location.address}
                    </li>
                  )}

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

                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowOfferPopup(false);
                    setAmountInRupees(10);
                    setNote(
                      `Applying for ${job.title}`
                    );

                    setUserLocation(null);
                    setLocationError("");
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition blink"
                >
                  Apply Now
                </button>

              </div>
            </div>
          ))}
      </div>

      {/* ==================================================
          APPLY / OFFER MODAL
      ================================================== */}

      {(selectedJob || showOfferPopup) && (
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
              {selectedJob
                ? `Apply for ${selectedJob.title}`
                : "Offer a Job"}
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
                  setEmail(e.target.value)
                }
                placeholder="Email"
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
              />

              {/* =================================================
                  CURRENT LOCATION
              ================================================== */}

              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">

                <div className="flex items-center justify-between gap-3 mb-3">

                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      📍 Current Location
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Use your current village or locality
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      detectCurrentLocation
                    }
                    disabled={
                      locationLoading
                    }
                    className="shrink-0 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {locationLoading
                      ? "Detecting..."
                      : userLocation
                      ? "Update"
                      : "Detect"}
                  </button>

                </div>

                {/* ERROR */}
                {locationError && (
                  <div className="mb-3 rounded-lg bg-red-50 border border-red-100 p-2">
                    <p className="text-xs text-red-600">
                      {locationError}
                    </p>
                  </div>
                )}

                {/* MAP */}
                {userLocation && (
                  <div className="overflow-hidden rounded-xl border border-gray-200">

                    <div className="h-52 w-full">

                      <MapContainer
                        center={[
                          userLocation.latitude,
                          userLocation.longitude,
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
                            userLocation.latitude,
                            userLocation.longitude,
                          ]}
                        />

                        <Marker
                          position={[
                            userLocation.latitude,
                            userLocation.longitude,
                          ]}
                          icon={locationIcon}
                        >
                          <Popup>
                            <strong>
                              Current Location
                            </strong>
                            <br />
                            {userLocation.address}
                          </Popup>
                        </Marker>

                      </MapContainer>

                    </div>

                    {/* LOCATION INFORMATION */}
                    <div className="p-3 bg-white">

                      <div className="flex gap-2">

                        <div className="text-red-500 text-lg">
                          📍
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-gray-800 text-sm">
                            Location Selected
                          </p>

                          <p className="text-xs text-gray-600 mt-1 leading-5">
                            {userLocation.address}
                          </p>

                        </div>

                      </div>

                      {/* DETAILS */}
                      <div className="grid grid-cols-2 gap-2 mt-3">

                        {userLocation.village && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-[10px] text-gray-400">
                              Village
                            </p>

                            <p className="text-xs font-medium text-gray-700">
                              {userLocation.village}
                            </p>
                          </div>
                        )}

                        {userLocation.locality && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-[10px] text-gray-400">
                              Locality / Mohalla
                            </p>

                            <p className="text-xs font-medium text-gray-700">
                              {userLocation.locality}
                            </p>
                          </div>
                        )}

                        {userLocation.district && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-[10px] text-gray-400">
                              District
                            </p>

                            <p className="text-xs font-medium text-gray-700">
                              {userLocation.district}
                            </p>
                          </div>
                        )}

                        {userLocation.postcode && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-[10px] text-gray-400">
                              PIN
                            </p>

                            <p className="text-xs font-medium text-gray-700">
                              {userLocation.postcode}
                            </p>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* AMOUNT */}
              <input
                type="number"
                value={amountInRupees}
                onChange={(e) =>
                  setAmountInRupees(
                    e.target.value
                  )
                }
                placeholder="Amount in INR"
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
              />

              {/* NOTE */}
              <input
                type="text"
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
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

            {/* SUBMIT */}
            <button
              onClick={createOrder}
              disabled={loading}
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg shadow-md transition-all"
            >
              {loading
                ? "Processing..."
                : selectedJob
                ? "Pay & Apply"
                : "Submit Job Offer"}
            </button>

          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}