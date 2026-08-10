import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function WorkerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    district: "",
    workType: "",
    kycType: "",
    kycNumber: "",
    document: null,
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // =========================
  // Handle Mobile
  // =========================
  const handleMobileChange = (e) => {
    const mobile = e.target.value
      .replace(/\D/g, "")
      .slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      mobile,
    }));
  };

  // =========================
  // Handle KYC Number
  // =========================
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

  // =========================
  // Handle KYC Type
  // =========================
  const handleKycTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      kycType: e.target.value,
      kycNumber: "",
    }));
  };

  // =========================
  // Handle Document
  // =========================
  const handleDocumentChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({
        ...prev,
        document: null,
      }));

      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");

      e.target.value = "";

      setFormData((prev) => ({
        ...prev,
        document: null,
      }));

      return;
    }

    // Allowed file types
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
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

  // =========================
  // Submit Worker Registration
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // Required Validation
    // =========================

    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (formData.mobile.length !== 10) {
      alert("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (!formData.district) {
      alert("Please select your district.");
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

    // Aadhaar validation
    if (
      formData.kycType === "Aadhaar" &&
      formData.kycNumber.length !== 12
    ) {
      alert("Please enter a valid 12 digit Aadhaar number.");
      return;
    }

    // PAN validation
    if (
      formData.kycType === "PAN" &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
        formData.kycNumber
      )
    ) {
      alert("Please enter a valid PAN number.");
      return;
    }

    if (!formData.document) {
      alert("Please upload your KYC document.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // Create FormData
      // =========================

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
        "district",
        formData.district
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

      // IMPORTANT:
      // Must match backend:
      // upload.single("kycDocument")
      data.append(
        "kycDocument",
        formData.document
      );

      // =========================
      // Backend API
      // =========================

      const response = await fetch(
        "https://jbackend-h963.onrender.com/workers/register",
        {
          method: "POST",
          body: data,
        }
      );

      // =========================
      // Read Response
      // =========================

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
        "Worker API Status:",
        response.status
      );

      console.log(
        "Worker API Response:",
        result
      );

      // =========================
      // Backend Error
      // =========================

      if (!response.ok) {
        alert(
          result.message ||
            `Registration failed. Error ${response.status}`
        );

        return;
      }

      // =========================
      // Success
      // =========================

      alert(
        result.message ||
          "Registration submitted successfully!"
      );

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        district: "",
        workType: "",
        kycType: "",
        kycNumber: "",
        document: null,
      });

      // Redirect Home
      navigate("/");
    } catch (error) {
      console.error(
        "Worker Registration Error:",
        error
      );

      alert(
        `Unable to connect with server.\n\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="bg-white shadow-md border border-gray-200 p-6 sm:p-8">

          {/* =========================
              Heading
          ========================= */}

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            Register as Worker
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Register yourself to receive new job notifications.
          </p>

          {/* =========================
              Form
          ========================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =========================
                Full Name
            ========================= */}

            <div>
              <label className="block font-semibold mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#9B845E]"
              />
            </div>

            {/* =========================
                Mobile
            ========================= */}

            <div>
              <label className="block font-semibold mb-1">
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleMobileChange}
                placeholder="Enter 10 digit mobile number"
                maxLength={10}
                inputMode="numeric"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#9B845E]"
              />
            </div>

            {/* =========================
                District
            ========================= */}

            <div>
              <label className="block font-semibold mb-1">
                District
              </label>

              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#9B845E]"
              >
                <option value="">
                  Select District
                </option>

                <option value="Nagaon">
                  Nagaon
                </option>

                <option value="Morigaon">
                  Morigaon
                </option>

                <option value="Hojai">
                  Hojai
                </option>

                <option value="Kamrup">
                  Kamrup
                </option>

                <option value="Sunitpur">
                  Sunitpur
                </option>

                <option value="Dhubri">
                  Dhubri
                </option>

                <option value="Borpeta">
                  Borpeta
                </option>

                <option value="Hajo">
                  Hajo
                </option>
              </select>
            </div>

            {/* =========================
                Work Type
            ========================= */}

            <div>
              <label className="block font-semibold mb-1">
                Work Type
              </label>

              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:border-[#9B845E]"
              >
                <option value="">
                  Select Work Type
                </option>

                <option value="Mason">
                  Mason
                </option>

                <option value="Carpenter">
                  Carpenter
                </option>

                <option value="Painter">
                  Painter
                </option>

                <option value="Electrician">
                  Electrician
                </option>

                <option value="Plumber">
                  Plumber
                </option>

                <option value="Gardener">
                  Gardener
                </option>

                <option value="Cleaner">
                  Cleaner
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* =========================
                KYC Type
            ========================= */}

            <div>
              <label className="block font-semibold mb-2">
                KYC Document
              </label>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kycType"
                    value="Aadhaar"
                    checked={
                      formData.kycType === "Aadhaar"
                    }
                    onChange={
                      handleKycTypeChange
                    }
                  />

                  Aadhaar Card
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kycType"
                    value="PAN"
                    checked={
                      formData.kycType === "PAN"
                    }
                    onChange={
                      handleKycTypeChange
                    }
                  />

                  PAN Card
                </label>

              </div>
            </div>

            {/* =========================
                KYC Number
            ========================= */}

            <div>
              <label className="block font-semibold mb-1">
                {formData.kycType === "PAN"
                  ? "PAN Number"
                  : "Aadhaar Number"}
              </label>

              <input
                type="text"
                name="kycNumber"
                value={formData.kycNumber}
                onChange={
                  handleKycNumberChange
                }
                placeholder={
                  formData.kycType === "PAN"
                    ? "Enter PAN number"
                    : "Enter Aadhaar number"
                }
                maxLength={
                  formData.kycType === "PAN"
                    ? 10
                    : 12
                }
                className="w-full px-4 py-3 border border-gray-300 uppercase focus:outline-none focus:border-[#9B845E]"
              />
            </div>

            {/* =========================
                KYC Document
            ========================= */}

            <div>
              <label className="block font-semibold mb-1">
                Upload KYC Document
              </label>

              <input
                type="file"
                name="document"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={
                  handleDocumentChange
                }
                className="w-full px-3 py-3 border border-gray-300 bg-white"
              />

              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG or PDF only — Maximum 5MB
              </p>

              {formData.document && (
                <p className="text-sm text-green-600 mt-2">
                  Selected:{" "}
                  {formData.document.name}
                </p>
              )}
            </div>

            {/* =========================
                Submit
            ========================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#9B845E] text-white font-semibold border border-[#9B845E] hover:bg-[#866F4D] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Submitting..."
                : "Register"}
            </button>

          </form>

        </div>
      </div>
    </>
  );
}