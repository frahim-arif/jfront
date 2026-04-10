import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";



// Header Import
import Header from "./components/Header.jsx";

// ---- SCROLLER CSS ----
const scrollerStyle = `
@keyframes scrollText {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.scroller {
  white-space: nowrap;
  display: inline-block;
  animation: scrollText 12s linear infinite;
}
`;


// Inject style tag once
const styleTag = document.createElement("style");
styleTag.innerHTML = scrollerStyle;
document.head.appendChild(styleTag);

export default function App() {
  const fixedDistricts = [
    "Nagaon",
    "Morigaon",
    "Hojai",
    "Kamrup",
    "Sunitpur",
    "Dhubri",
    "Borpeta",
    "Haju",
  ];

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [districtList, setDistrictList] = useState(fixedDistricts);
  const [selectedDistrict, setSelectedDistrict] = useState("All");

  const [selectedJob, setSelectedJob] = useState(null);
  const [showOfferPopup, setShowOfferPopup] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [amountInRupees, setAmountInRupees] = useState(10);
  const [note, setNote] = useState("Order for job");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----- LIVE TIME STATE -----
  const [currentTime, setCurrentTime] = useState("");

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

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("https://jbackend-5vqv.onrender.com/jobs");
        setJobs(res.data.jobs);
        setFilteredJobs(res.data.jobs);

        const apiDistricts = [
          ...new Set(res.data.jobs.map((job) => job.district)),
        ];
        const mergedDistricts = Array.from(
          new Set([...fixedDistricts, ...apiDistricts])
        );
        setDistrictList(mergedDistricts);
      } catch (err) {
        console.error("Error fetching jobs", err);
      }
    };
    fetchJobs();
  }, []);

  // Filter by district
  useEffect(() => {
    if (selectedDistrict === "All") setFilteredJobs(jobs);
    else
      setFilteredJobs(
        jobs.filter((job) => job.district === selectedDistrict)
      );
  }, [selectedDistrict, jobs]);

  // Close Modal
  const handleCloseModal = () => {
    setSelectedJob(null);
    setShowOfferPopup(false);
    setCustomerName("");
    setMobileNumber("");
    setEmail("");
    setAmountInRupees(10);
    setNote("Order for job");
    setError("");
  };

  // Payment API
  const createOrder = async () => {
    if (!customerName || !mobileNumber || Number(amountInRupees) <= 0) {
      alert("Please fill valid details!");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const amount = Math.round(Number(amountInRupees) * 100);

      const res = await axios.post("https://jbackend-5vqv.onrender.com/create-order", {
        amount,
        customerName,
        mobileNumber,
        email,
        note,
        jobId: selectedJob?._id || "offer_job",
      });

      if (res.data.checkoutPageUrl) {
        window.open(res.data.checkoutPageUrl, "_blank");
        handleCloseModal();
      } else {
        setError("Unable to get checkout URL");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Unable to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* HEADER */}
      <Header onOfferJobClick={() => setShowOfferPopup(true)} />

      {/* ---- SCROLLING TIME BAR ---- */}
      <div className="bg-white text-black py-1 overflow-hidden">
  <p className="scroller text-center font-semibold text-xs">
    {currentTime}  / Find your dream job today ! 
  </p>
</div>

      {/* DISTRICT FILTER */}
      <div className="max-w-7xl mx-auto px-4 mt-4 flex justify-between items-center">
        <span className="text-black font-bold text-xl">Jobs</span>

        {/* Desktop */}
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="hidden sm:inline-block px-5 py-2.5 bg-yellow-300 text-black font-semibold rounded-xl shadow-md border border-white hover:bg-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          <option value="All"> Districts</option>
          {districtList.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>

        {/* Mobile */}
        <div className="sm:hidden flex justify-end w-full">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 bg-gradient-to-r from-yellow-300 via-yellow-300 to-yellow-400 text-black font-semibold rounded-lg shadow-lg border border-white hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-32"
          >
            <option value="All"> Districts</option>
            {districtList.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* JOB GRID */}
      <div className="max-w-7xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 px-4">
        {filteredJobs.length === 0 && (
          <p className="text-center col-span-full text-lg font-semibold text-gray-700">
            No jobs found for this district.
          </p>
        )}

        {filteredJobs.map((job) => (
          <div
            key={job._id}
            className="relative rounded-2xl p-1 shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-2xl p-5 flex flex-col justify-between">
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                {job.title}
              </h2>
              <p className="text-gray-700 mb-4">{job.description}</p>

              <ul className="text-black mb-4 space-y-1 text-sm">
                <li>
                  <strong className="text-green-500">Price:</strong>{" "}
                  {job.amount} ₹
                </li>
                <li>
                  <strong className="text-fuchsia-700">District:</strong>{" "}
                  {job.district}
                </li>
                {job.createdAt && (
                  <li>
                    <strong>Posted:</strong>{" "}
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </li>
                )}
              </ul>

              <button
                onClick={() => {
                  setSelectedJob(job);
                  setAmountInRupees(10);
                  setNote(`Applying for ${job.title}`);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition blink"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* APPLY / OFFER MODAL */}
      {(selectedJob || showOfferPopup) && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-md p-5 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-black hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-4 text-black">
              {selectedJob ? `Apply for ${selectedJob.title}` : "Offer a Job"}
            </h2>

            <div className="grid gap-4">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your Name"
                className="p-3 border border-gray-300 rounded-lg"
              />

              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(
                    e.target.value.replace(/[^\d]/g, "").slice(0, 10)
                  )
                }
                placeholder="Mobile Number"
                className="p-3 border border-gray-300 rounded-lg"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-3 border border-gray-300 rounded-lg"
              />

              <input
                type="number"
                value={amountInRupees}
                onChange={(e) => setAmountInRupees(e.target.value)}
                placeholder="Amount in INR"
                className="p-3 border border-gray-300 rounded-lg"
              />

              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note"
                className="p-3 border border-gray-300 rounded-lg"
              />
            </div>

            {error && (
              <p className="text-red-600 mt-2 text-sm">{error}</p>
            )}

            <button
              onClick={createOrder}
              className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg shadow-md transition-all"
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
    </div>
  );
}
