import React, { useState } from "react";
import Header from "../components/Header.jsx";

const INDIAN_STATES = [
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

const API_BASE_URL = "https://jbackend-h963.onrender.com";

export default function WorkerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    state: "",
    district: "",
    workType: "",
    kycType: "",
    kycNumber: "",
    document: null,
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // MOBILE
  // =====================================================

  const handleMobileChange = (e) => {
    const mobile = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      mobile,
    }));
  };

  // =====================================================
  // KYC TYPE
  // =====================================================

  const handleKycTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      kycType: e.target.value,
      kycNumber: "",
      document: null,
    }));
  };

  // =====================================================
  // KYC NUMBER
  // =====================================================

  const handleKycNumberChange = (e) => {
    let value = e.target.value.toUpperCase();

    if (formData.kycType === "Aadhaar") {
      value = value
        .replace(/\D/g, "")
        .slice(0, 12);
    }

    if (formData.kycType === "PAN") {
      value = value
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      kycNumber: value,
    }));
  };

  // =====================================================
  // DOCUMENT
  // =====================================================

  const handleDocumentChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        document: null,
      }));

      return;
    }

    // 5MB LIMIT
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");

      e.target.value = "";

      setFormData((prev) => ({
        ...prev,
        document: null,
      }));

      return;
    }

    // ALLOWED FILE TYPES
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG or PDF files are allowed.");

      e.target.value = "";

      setFormData((prev) => ({
        ...prev,
        document: null,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      document: file,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert(
        "Please enter a valid 10 digit mobile number."
      );
      return;
    }

    if (!formData.state) {
      alert("Please select your state.");
      return;
    }

    if (!formData.district.trim()) {
      alert("Please enter your district.");
      return;
    }

    if (!formData.workType) {
      alert("Please select your work type.");
      return;
    }

    if (!formData.kycType) {
      alert("Please select KYC document type.");
      return;
    }

    if (!formData.kycNumber) {
      alert(
        formData.kycType === "PAN"
          ? "Please enter your PAN number."
          : "Please enter your Aadhaar number."
      );

      return;
    }

    // =====================================================
    // AADHAAR VALIDATION
    // =====================================================

    if (
      formData.kycType === "Aadhaar" &&
      !/^\d{12}$/.test(formData.kycNumber)
    ) {
      alert(
        "Please enter a valid 12 digit Aadhaar number."
      );

      return;
    }

    // =====================================================
    // PAN VALIDATION
    // =====================================================

    if (
      formData.kycType === "PAN" &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
        formData.kycNumber
      )
    ) {
      alert("Please enter a valid PAN number.");
      return;
    }

    // =====================================================
    // DOCUMENT VALIDATION
    // =====================================================

    if (!formData.document) {
      alert("Please upload your KYC document.");
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // STEP 1
      // REGISTER WORKER
      // =====================================================

      const data = new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "mobile",
        formData.mobile
      );

      data.append(
        "state",
        formData.state
      );

      data.append(
        "district",
        formData.district.trim()
      );

      data.append(
        "workType",
        formData.workType
      );

      data.append(
        "kycType",
        formData.kycType
      );

      data.append(
        "kycNumber",
        formData.kycNumber
      );

      data.append(
        "kycDocument",
        formData.document
      );

      const response = await fetch(
        `${API_BASE_URL}/workers/register`,
        {
          method: "POST",
          body: data,
        }
      );

      const responseText =
        await response.text();

      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        result = {
          success: false,
          message:
            responseText ||
            "Invalid server response.",
        };
      }

      console.log(
        "Worker Registration Status:",
        response.status
      );

      console.log(
        "Worker Registration Response:",
        result
      );

      // =====================================================
      // REGISTRATION ERROR
      // =====================================================

      if (!response.ok) {
  // Registration already started hai
  // aur backend ne existing workerId diya hai
  if (result?.workerId) {
    localStorage.setItem(
      "workerId",
      String(result.workerId)
    );

    localStorage.setItem(
      "pendingWorkerId",
      String(result.workerId)
    );

    console.log(
      "💾 Existing workerId SAVED:",
      localStorage.getItem("workerId")
    );

    console.log(
      "💾 Existing pendingWorkerId SAVED:",
      localStorage.getItem("pendingWorkerId")
    );
  }

  alert(
    result?.message ||
      `Registration failed. Error ${response.status}`
  );

  return;
}

      // =====================================================
      // STEP 2
      // GET WORKER ID
      // =====================================================

      const registeredWorkerId =
        result?.worker?._id ||
        result?.worker?.id ||
        result?.workerId ||
        result?.data?._id ||
        result?.data?.workerId;

      if (!registeredWorkerId) {
        console.error(
          "❌ Worker ID missing:",
          result
        );

        alert(
          "Registration completed but Worker ID was not received. Please contact support."
        );

        return;
      }

      console.log(
        "✅ Registered Worker ID:",
        registeredWorkerId
      );

   // =====================================================
// WORKER ID SAVE
// Payment se pehle workerId localStorage me save kar rahe hain
// Taaki payment ke baad Header worker ko identify kar sake
// =====================================================

localStorage.setItem(
  "workerId",
  String(registeredWorkerId)
);

localStorage.setItem(
  "pendingWorkerId",
  String(registeredWorkerId)
);

console.log(
  "💾 workerId SAVED:",
  localStorage.getItem("workerId")
);

console.log(
  "💾 pendingWorkerId SAVED:",
  localStorage.getItem("pendingWorkerId")
);

      // =====================================================
      // STEP 3
      // CREATE ₹250 PHONEPE PAYMENT
      // =====================================================

      const paymentResponse =
        await fetch(
          `${API_BASE_URL}/workers/payment/create`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },

            body: JSON.stringify({
              workerId:
                registeredWorkerId,
            }),
          }
        );

      const paymentText =
        await paymentResponse.text();

      let paymentResult;

      try {
        paymentResult =
          JSON.parse(paymentText);
      } catch {
        paymentResult = {
          success: false,
          message:
            paymentText ||
            "Invalid payment server response.",
        };
      }

      console.log(
        "Worker Payment Status:",
        paymentResponse.status
      );

      console.log(
        "Worker Payment Response:",
        paymentResult
      );

      // =====================================================
      // PAYMENT CREATE ERROR
      // =====================================================

      if (
        !paymentResponse.ok ||
        !paymentResult?.success ||
        !paymentResult?.checkoutPageUrl
      ) {
        alert(
          paymentResult?.message ||
            "Unable to create registration payment. Please try again."
        );

        return;
      }

      // =====================================================
      // STEP 4
      // SAVE MERCHANT ORDER ID
      // =====================================================

      if (
        paymentResult?.merchantOrderId
      ) {
        localStorage.setItem(
          "workerMerchantOrderId",
          String(
            paymentResult.merchantOrderId
          )
        );
      }

      // =====================================================
      // STEP 5
      // PHONEPE CHECKOUT
      // =====================================================

      
console.log(
  "🚀 Before PhonePe redirect - pendingWorkerId:",
  localStorage.getItem("pendingWorkerId")
);

console.log(
  "🚀 Before PhonePe redirect - workerMerchantOrderId:",
  localStorage.getItem("workerMerchantOrderId")
);

console.log(
  "🚀 Redirecting to PhonePe..."
);



      window.location.href =
        paymentResult.checkoutPageUrl;

    } catch (error) {
      console.error(
        "❌ Worker Registration Error:",
        error
      );

      alert(
        "Unable to connect with server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">

          {/* HEADER */}

          <div className="mb-7 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#9B845E]/10 text-2xl">
              👷
            </div>

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Register as Worker
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Register to receive job opportunities
              in your area.
            </p>

          </div>

          {/* CARD */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="h-1 bg-[#9B845E]" />

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-8"
            >

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  disabled={loading}
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-[#9B845E] focus:ring-2 focus:ring-[#9B845E]/10 disabled:bg-slate-100"
                />

              </div>

              {/* MOBILE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mobile Number
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={handleMobileChange}
                  placeholder="10 digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  disabled={loading}
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-[#9B845E] focus:ring-2 focus:ring-[#9B845E]/10 disabled:bg-slate-100"
                />

              </div>

              {/* STATE + DISTRICT */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* STATE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    State
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#9B845E] focus:ring-2 focus:ring-[#9B845E]/10 disabled:bg-slate-100"
                  >

                    <option value="">
                      Select State
                    </option>

                    {INDIAN_STATES.map(
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

                {/* DISTRICT */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    District
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="district"
                    value={
                      formData.district
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter district"
                    disabled={loading}
                    className="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-[#9B845E] focus:ring-2 focus:ring-[#9B845E]/10 disabled:bg-slate-100"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Enter your current district
                  </p>

                </div>

              </div>

              {/* WORK TYPE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Work Type
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="workType"
                  value={
                    formData.workType
                  }
                  onChange={
                    handleChange
                  }
                  disabled={loading}
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#9B845E] focus:ring-2 focus:ring-[#9B845E]/10 disabled:bg-slate-100"
                >

                  <option value="">
                    Select Work Type
                  </option>

                  {WORK_TYPES.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* KYC TYPE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  KYC Document
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                      formData.kycType ===
                      "Aadhaar"
                        ? "border-[#9B845E] bg-[#9B845E]/5 text-[#806D4E]"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >

                    <input
                      type="radio"
                      name="kycType"
                      value="Aadhaar"
                      checked={
                        formData.kycType ===
                        "Aadhaar"
                      }
                      onChange={
                        handleKycTypeChange
                      }
                      disabled={loading}
                    />

                    Aadhaar

                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                      formData.kycType ===
                      "PAN"
                        ? "border-[#9B845E] bg-[#9B845E]/5 text-[#806D4E]"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >

                    <input
                      type="radio"
                      name="kycType"
                      value="PAN"
                      checked={
                        formData.kycType ===
                        "PAN"
                      }
                      onChange={
                        handleKycTypeChange
                      }
                      disabled={loading}
                    />

                    PAN

                  </label>

                </div>

              </div>

              {/* KYC NUMBER */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">

                  {formData.kycType ===
                  "PAN"
                    ? "PAN Number"
                    : "Aadhaar Number"}

                  <span className="ml-1 text-red-500">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  value={
                    formData.kycNumber
                  }
                  onChange={
                    handleKycNumberChange
                  }
                  placeholder={
                    formData.kycType ===
                    "PAN"
                      ? "Enter PAN number"
                      : "Enter 12 digit Aadhaar number"
                  }
                  maxLength={
                    formData.kycType ===
                    "PAN"
                      ? 10
                      : 12
                  }
                  disabled={
                    !formData.kycType ||
                    loading
                  }
                  className="h-12 w-full rounded-lg border border-slate-300 px-4 text-sm uppercase outline-none transition focus:border-[#9B845E] focus:ring-2 focus:ring-[#9B845E]/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

              </div>

              {/* DOCUMENT */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Upload KYC Document
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={
                    handleDocumentChange
                  }
                  disabled={loading}
                  className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm disabled:cursor-not-allowed"
                />

                <p className="mt-1 text-xs text-slate-400">
                  JPG, PNG or PDF • Maximum 5MB
                </p>

                {formData.document && (
                  <div className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                    ✓{" "}
                    {
                      formData.document
                        .name
                    }
                  </div>
                )}

              </div>

              {/* PAYMENT INFORMATION */}

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">

                <p className="text-sm font-semibold text-amber-800">
                  Worker Registration Fee: ₹250
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  After submitting your
                  registration, you will be
                  redirected to PhonePe to
                  complete the one-time ₹250
                  registration payment.
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Your account will become
                  active only after the payment
                  is successfully verified.
                </p>

              </div>

              {/* JOB NOTIFICATION INFORMATION */}

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">

                <p className="text-xs leading-5 text-blue-700">
                  Your State, District and
                  Work Type will be used to
                  send you relevant job
                  notifications in your area.
                </p>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg bg-[#9B845E] font-semibold text-white transition hover:bg-[#866F4D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Registration & Payment..."
                  : "Register & Pay ₹250"}
              </button>

            </form>

          </div>

          <p className="mt-5 text-center text-xs text-slate-400">
            Your information is used only for
            worker registration and job matching.
          </p>

        </div>
      </main>
    </>
  );
}