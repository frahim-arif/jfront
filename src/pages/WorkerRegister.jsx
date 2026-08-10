
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.mobile ||
      !formData.district ||
      !formData.workType ||
      !formData.kycType ||
      !formData.kycNumber ||
      !formData.document
    ) {
      alert("Please fill all details.");
      return;
    }

    try {
      setLoading(true);

      console.log("Worker Registration Data:", formData);

      // Registration successful
      alert("Registration submitted successfully!");

      // Redirect to Home page
      navigate("/");

    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="bg-white shadow-md border border-gray-200 p-6 sm:p-8">

          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            Register as Worker
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Register yourself to receive new job notifications.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
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

            {/* Mobile */}
            <div>
              <label className="block font-semibold mb-1">
                Mobile Number
              </label>

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mobile: e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10),
                  })
                }
                placeholder="Enter 10 digit mobile number"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#9B845E]"
              />
            </div>

            {/* District */}
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
                <option value="">Select District</option>
                <option value="Nagaon">Nagaon</option>
                <option value="Morigaon">Morigaon</option>
                <option value="Hojai">Hojai</option>
                <option value="Kamrup">Kamrup</option>
                <option value="Sunitpur">Sunitpur</option>
                <option value="Dhubri">Dhubri</option>
                <option value="Borpeta">Borpeta</option>
                <option value="Hajo">Hajo</option>
              </select>
            </div>

            {/* Work Type */}
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
                <option value="">Select Work Type</option>
                <option value="Mason">Mason</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Painter">Painter</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Gardener">Gardener</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* KYC Type */}
            <div>
              <label className="block font-semibold mb-2">
                KYC Document
              </label>

              <div className="flex gap-6">

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kycType"
                    value="Aadhaar"
                    checked={formData.kycType === "Aadhaar"}
                    onChange={handleChange}
                  />
                  Aadhaar Card
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kycType"
                    value="PAN"
                    checked={formData.kycType === "PAN"}
                    onChange={handleChange}
                  />
                  PAN Card
                </label>

              </div>
            </div>

            {/* KYC Number */}
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
                onChange={handleChange}
                placeholder={
                  formData.kycType === "PAN"
                    ? "Enter PAN number"
                    : "Enter Aadhaar number"
                }
                className="w-full px-4 py-3 border border-gray-300 uppercase focus:outline-none focus:border-[#9B845E]"
              />
            </div>

            {/* Document */}
            <div>
              <label className="block font-semibold mb-1">
                Upload KYC Document
              </label>

              <input
                type="file"
                name="document"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 bg-white"
              />

              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG or PDF only
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#9B845E] text-white font-semibold border border-[#9B845E] hover:bg-[#866F4D] transition-colors duration-200 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Register"}
            </button>

          </form>

        </div>

      </div>
    </>
  );
}

