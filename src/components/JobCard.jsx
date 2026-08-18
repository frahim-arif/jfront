import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

export default function JobCard({ job }) {
  const [applicantName, setApplicantName] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // Close Modal with ESC
  // =========================

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowApply(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // =========================
  // Apply Job
  // =========================

  const handleApply = async () => {
    if (!applicantName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (applicantPhone.length !== 10) {
      alert("Please enter a valid 10 digit phone number.");
      return;
    }

    if (!applicantEmail.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!job.amount || Number(job.amount) <= 0) {
      alert("Invalid job amount!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        // PhonePe expects amount in paise
        amount: Math.floor(Number(job.amount) * 100),

        customerName: applicantName.trim(),

        mobileNumber: applicantPhone,

        email: applicantEmail.trim(),

        note: `Applying for ${job.title}`,

        jobId: job._id,
      };

      console.log("Payment Payload:", payload);

      const res = await axios.post(
        "https://jbackend-h963.onrender.com/create-order",
        payload
      );

      console.log("Payment Response:", res.data);

      if (res.data.checkoutPageUrl) {
        window.open(
          res.data.checkoutPageUrl,
          "_blank"
        );

        setShowApply(false);
      } else {
        alert(
          res.data.message ||
            "Checkout URL not received!"
        );
      }
    } catch (err) {
      console.error(
        "Payment Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Error creating payment order!"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Reset Form
  // =========================

  const closeModal = () => {
    if (loading) return;

    setShowApply(false);

    setApplicantName("");
    setApplicantPhone("");
    setApplicantEmail("");
  };

  return (
    <>
      {/* =========================
          JOB CARD
      ========================= */}

      <div className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

        {/* Top Border */}

        <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-600" />

        <div className="p-5 sm:p-6 flex flex-col justify-between h-full">

          {/* =========================
              Job Information
          ========================= */}

          <div>

            {/* Job Title */}

            <div className="flex items-start justify-between gap-3 mb-3">

              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {job.title}
              </h2>

            </div>

            {/* Description */}

            <p className="text-slate-600 text-sm leading-6 mb-5">
              {job.description}
            </p>

          {/*  JOB DETAILS */}


<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">

  {/* Location */}
  {/* Location */}
<div className="bg-slate-50 rounded-lg p-3">
  <p className="text-xs text-slate-500 mb-1">
    Location
  </p>

  <p className="font-semibold text-slate-800">
    {[
      job.location?.address,
      job.location?.district || job.district,
      job.location?.state || job.state,
    ]
      .filter(Boolean)
      .join(", ") || "Not specified"}
  </p>
</div>

  {/* Work Type */}
  <div className="bg-slate-50 rounded-lg p-3">
    <p className="text-xs text-slate-500 mb-1">
      Work Type
    </p>

    <p className="font-semibold text-slate-800">
      {job.workType || "Not specified"}
    </p>
  </div>

  {/* Amount */}
  <div className="bg-green-50 rounded-lg p-3">
    <p className="text-xs text-green-600 mb-1">
      Work Amount
    </p>

    <p className="text-lg font-bold text-green-700">
      ₹{Number(job.amount || 0).toLocaleString("en-IN")}
    </p>
  </div>

  {/* Posted */}
  {job.createdAt && (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-500 mb-1">
        Posted
      </p>

      <p className="font-semibold text-slate-800">
        {formatDistanceToNow(
          new Date(job.createdAt),
          {
            addSuffix: true,
          }
        )}
      </p>
    </div>
  )}

</div>

          </div>

          {/* =========================
              Apply Button
          ========================= */}

          <button
            onClick={() => setShowApply(true)}
            className="w-full h-11 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition-all duration-200"
          >
            Apply Now
          </button>

        </div>
      </div>

      {/* =========================
          APPLY MODAL
      ========================= */}

      {showApply && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-6"
          onClick={closeModal}
        >

          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-5 text-white">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-sky-100 text-xs uppercase tracking-wide font-semibold">
                    Apply for Job
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    {job.title}
                  </h3>

                </div>

                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="text-white/80 hover:text-white text-2xl leading-none disabled:opacity-50"
                >
                  ×
                </button>

              </div>

            </div>

            {/* Modal Body */}

            <div className="p-6">

              {/* Job Summary */}

              <div className="bg-slate-50 rounded-xl p-4 mb-5">

                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-xs text-slate-500">
                      Work Type
                    </p>

                    <p className="font-semibold text-slate-800">
                      {job.workType || "Not specified"}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-500">
                      Amount
                    </p>

                    <p className="text-lg font-bold text-green-600">
                      ₹{Number(job.amount || 0).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

              </div>

              {/* Name */}

              <div className="mb-4">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={applicantName}
                  onChange={(e) =>
                    setApplicantName(e.target.value)
                  }
                  disabled={loading}
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                />

              </div>

              {/* Phone */}

              <div className="mb-4">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  value={applicantPhone}
                  onChange={(e) =>
                    setApplicantPhone(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10)
                    )
                  }
                  maxLength={10}
                  inputMode="numeric"
                  disabled={loading}
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                />

              </div>

              {/* Email */}

              <div className="mb-5">

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={applicantEmail}
                  onChange={(e) =>
                    setApplicantEmail(e.target.value)
                  }
                  disabled={loading}
                  className="w-full h-11 px-4 border border-slate-300 rounded-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
                />

              </div>

              {/* Payment Notice */}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">

                <p className="text-sm text-amber-800">
                  After clicking <strong>Pay & Apply</strong>,
                  you will be redirected to the secure payment
                  page.
                </p>

              </div>

              {/* Buttons */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 h-11 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={loading}
                  className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Processing..."
                    : `Pay ₹${Number(
                        job.amount || 0
                      ).toLocaleString("en-IN")}`}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}