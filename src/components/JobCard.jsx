import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

export default function JobCard({ job }) {
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [showApply, setShowApply] = useState(false);

  // Close modal on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowApply(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleApply = async () => {
    if (!applicantName || !applicantPhone || !applicantEmail) {
      alert("All fields are required!");
      return;
    }

    if (!job.amount || Number(job.amount) <= 0) {
      alert("Invalid job amount!");
      return;
    }

    try {
      const payload = {
        amount: Math.floor(Number(job.amount) * 100),
        customerName: applicantName,
        mobileNumber: applicantPhone,
        email: applicantEmail,
        note: `Applying for ${job.title}`,
        jobId: job._id,
      };

      const res = await axios.post("http://localhost:5000/create-order", payload);

      if (res.data.checkoutPageUrl) {
        window.open(res.data.checkoutPageUrl, "_blank");
      } else {
        alert("Checkout URL not received!");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Error creating order!");
    }
  };

  return (
    <div className="border rounded-lg shadow-md bg-white p-5 flex flex-col justify-between">
      {/* Job Info */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-gray-900">{job.title}</h2>
        <p className="text-gray-700 mb-4">{job.description}</p>

        <div className="flex flex-col gap-2 mb-4 text-black">
          <span className="font-medium">
            <strong>District:</strong> {job.district}
          </span>
          <span className="font-medium">
            <strong>Price:</strong> ₹{job.amount}
          </span>
          {job.createdAt && (
            <span className="font-medium">
              <strong>Posted:</strong>{" "}
              {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => setShowApply(true)}
        className="w-full bg-black text-white py-2 rounded-lg font-semibold"
      >
        Apply Now
      </button>

      {/* Apply Modal */}
      {showApply && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setShowApply(false)}
        >
          <div
            className="bg-white rounded-lg shadow-md p-5 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowApply(false)}
              className="absolute top-3 right-3 text-black hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Apply for {job.title}
            </h3>

            <input
              type="text"
              placeholder="Your Name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <input
              type="tel"
              placeholder="Your Phone"
              value={applicantPhone}
              onChange={(e) =>
                setApplicantPhone(
                  e.target.value.replace(/[^\d]/g, "").slice(0, 10)
                )
              }
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowApply(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
              >
                Pay & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
