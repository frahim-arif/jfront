import { useState } from "react";
import axios from "axios";
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

// Leaflet marker icon fix
const locationIcon = new L.DivIcon({
  className: "custom-location-marker",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      background: #ef4444;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
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

// Map ko new location par move karne ke liye
function MapCenter({ position }) {
  const map = useMap();

  if (position) {
    map.setView(position, 16);
  }

  return null;
}

export default function OfferJob() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobAmount, setJobAmount] = useState("");
  const [jobDistrict, setJobDistrict] = useState("");
  const [jobWorkType, setJobWorkType] = useState("");
  const [jobPhone, setJobPhone] = useState("");
  const [jobEmail, setJobEmail] = useState("");

  // Location states
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [loading, setLoading] = useState(false);

  const districts = [
    "Nagaon",
    "Morigaon",
    "Hojai",
    "Kamrup",
    "Sunitpur",
    "Dhubri",
    "Borpeta",
    "Hajo",
  ];

  const workTypes = [
    "Mason",
    "Carpenter",
    "Painter",
    "Electrician",
    "Plumber",
    "Gardener",
    "Cleaner",
    "Other",
  ];

  // =========================
  // CURRENT LOCATION
  // =========================
  const detectLocation = () => {
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

          // Reverse Geocoding
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

          const data = response.data;

          const address = data.localityInfo?.administrative || [];

          const district =
            data.city ||
            data.locality ||
            data.principalSubdivision ||
            "";

          const village =
            data.locality ||
            data.village ||
            data.city ||
            "";

          const locality =
            data.localityInfo?.informative?.find(
              (item) =>
                item.name &&
                ["hamlet", "village", "neighbourhood", "suburb"].includes(
                  item.description?.toLowerCase()
                )
            )?.name || "";

          const state =
            data.principalSubdivision || "Assam";

          const postcode =
            data.postcode || "";

          const fullAddress = [
            locality || village,
            district,
            state,
            postcode,
          ]
            .filter(Boolean)
            .filter(
              (value, index, array) =>
                array.indexOf(value) === index
            )
            .join(", ");

          setLocation({
            latitude,
            longitude,
            village: village || locality || "",
            locality: locality || "",
            district,
            state,
            postcode,
            address: fullAddress,
          });

          // District automatically select
          const matchedDistrict = districts.find(
            (item) =>
              item.toLowerCase() === district.toLowerCase()
          );

          if (matchedDistrict) {
            setJobDistrict(matchedDistrict);
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);

          // GPS mil gaya ho to bhi location save kar sakte hain
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setLocation({
            latitude,
            longitude,
            village: "",
            locality: "",
            district: "",
            state: "Assam",
            postcode: "",
            address: "Current location",
          });

          setLocationError(
            "Map location found, but detailed address could not be detected."
          );
        } finally {
          setLocationLoading(false);
        }
      },

      (error) => {
        console.error("Location Error:", error);

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
            "Unable to detect current location."
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

  // =========================
  // SUBMIT JOB
  // =========================
  const submitJob = async (e) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      alert("Please enter job title.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter job description.");
      return;
    }

    if (!jobAmount || Number(jobAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!jobDistrict) {
      alert("Please select district.");
      return;
    }

    if (!jobWorkType) {
      alert("Please select work type.");
      return;
    }

    if (jobPhone.length !== 10) {
      alert("Please enter a valid 10 digit phone number.");
      return;
    }

    // Location required
    if (!location) {
      alert("Please select your current location.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://jbackend-h963.onrender.com/jobs",
        {
          title: jobTitle.trim(),
          description: jobDescription.trim(),
          amount: Number(jobAmount),
          district: jobDistrict,
          workType: jobWorkType,
          postedByPhone: jobPhone,
          postedByEmail: jobEmail.trim(),

          // LOCATION
          location: {
            address: location.address,
            village: location.village,
            locality: location.locality,
            district: location.district || jobDistrict,
            state: location.state,
            postcode: location.postcode,
            latitude: location.latitude,
            longitude: location.longitude,
          },
        }
      );

      const result = response.data;

      if (result.success) {
        alert(
          result.notifiedWorkers > 0
            ? `Job posted successfully!\n${result.notifiedWorkers} matching worker(s) notified.`
            : "Job posted successfully!\nNo matching workers found."
        );

        setJobTitle("");
        setJobDescription("");
        setJobAmount("");
        setJobDistrict("");
        setJobWorkType("");
        setJobPhone("");
        setJobEmail("");
        setLocation(null);

        navigate("/");
      }
    } catch (error) {
      console.error("Job Posting Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to post job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Offer a Job
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Find a suitable worker for your job.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <form
            onSubmit={submitJob}
            className="space-y-5 p-5 sm:p-7"
          >

            {/* Job Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Electrician Required"
                className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Description <span className="text-red-500">*</span>
              </label>

              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                placeholder="Describe the work..."
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {/* Amount + District */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Work Amount{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={jobAmount}
                    onChange={(e) =>
                      setJobAmount(e.target.value)
                    }
                    placeholder="500"
                    className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  District{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  value={jobDistrict}
                  onChange={(e) =>
                    setJobDistrict(e.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">
                    Select District
                  </option>

                  {districts.map((district) => (
                    <option
                      key={district}
                      value={district}
                    >
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Work Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Work Type{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                value={jobWorkType}
                onChange={(e) =>
                  setJobWorkType(e.target.value)
                }
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">
                  Select Work Type
                </option>

                {workTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* ========================= */}
            {/* CURRENT LOCATION */}
            {/* ========================= */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Location{" "}
                <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={detectLocation}
                disabled={locationLoading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-lg">📍</span>

                {locationLoading
                  ? "Detecting Current Location..."
                  : location
                  ? "Detect Current Location Again"
                  : "Use Current Location"}
              </button>

              {locationError && (
                <p className="mt-2 text-xs text-red-500">
                  {locationError}
                </p>
              )}

              {/* MAP */}
              {location && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                  <div className="h-56 w-full sm:h-64">
                    <MapContainer
                      center={[
                        location.latitude,
                        location.longitude,
                      ]}
                      zoom={16}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <MapCenter
                        position={[
                          location.latitude,
                          location.longitude,
                        ]}
                      />

                      <Marker
                        position={[
                          location.latitude,
                          location.longitude,
                        ]}
                        icon={locationIcon}
                      >
                        <Popup>
                          <strong>
                            Your Current Location
                          </strong>
                          <br />
                          {location.address}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>

                  {/* LOCATION DETAILS */}
                  <div className="p-4">

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-lg">
                        📍
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          Current Location
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {location.address}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">

                      {location.village && (
                        <div className="rounded-lg bg-slate-50 p-2">
                          <span className="text-slate-400">
                            Village
                          </span>
                          <p className="font-medium text-slate-700">
                            {location.village}
                          </p>
                        </div>
                      )}

                      {location.locality && (
                        <div className="rounded-lg bg-slate-50 p-2">
                          <span className="text-slate-400">
                            Locality / Mohalla
                          </span>
                          <p className="font-medium text-slate-700">
                            {location.locality}
                          </p>
                        </div>
                      )}

                      {location.district && (
                        <div className="rounded-lg bg-slate-50 p-2">
                          <span className="text-slate-400">
                            District
                          </span>
                          <p className="font-medium text-slate-700">
                            {location.district}
                          </p>
                        </div>
                      )}

                      {location.postcode && (
                        <div className="rounded-lg bg-slate-50 p-2">
                          <span className="text-slate-400">
                            PIN
                          </span>
                          <p className="font-medium text-slate-700">
                            {location.postcode}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        alert("Location selected successfully.");
                      }}
                      className="mt-4 h-10 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      ✓ Use This Location
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  value={jobPhone}
                  onChange={(e) =>
                    setJobPhone(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  placeholder="10 digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email{" "}
                  <span className="font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="email"
                  value={jobEmail}
                  onChange={(e) =>
                    setJobEmail(e.target.value)
                  }
                  placeholder="your@email.com"
                  className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-sky-600 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Posting Job..."
                : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}