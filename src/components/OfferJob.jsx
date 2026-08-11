import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OfferJob() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobAmount, setJobAmount] = useState("");
  const [jobDistrict, setJobDistrict] = useState("");
  const [jobWorkType, setJobWorkType] = useState("");
  const [jobPhone, setJobPhone] = useState("");
  const [jobEmail, setJobEmail] = useState("");

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

  const submitJob = async (e) => {
    e.preventDefault();

    // =========================
    // Validation
    // =========================

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

    try {
      setLoading(true);

      // =========================
      // Create Job
      // =========================

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
        }
      );

      const result = response.data;

      console.log("Job Response:", result);

      // =========================
      // Success
      // =========================

      if (result.success) {
        alert(
          result.notifiedWorkers > 0
            ? `Job posted successfully!\n${result.notifiedWorkers} matching worker(s) notified.`
            : "Job posted successfully!\nNo matching workers found."
        );

        // Reset
        setJobTitle("");
        setJobDescription("");
        setJobAmount("");
        setJobDistrict("");
        setJobWorkType("");
        setJobPhone("");
        setJobEmail("");

        navigate("/");
      }
    } catch (error) {
      console.error("Job Posting Error:", error);

      const message =
        error.response?.data?.message ||
        "Unable to post job. Please try again.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================
          Header Section
      ========================= */}

      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

          <div className="max-w-2xl">

            <p className="text-sky-100 text-sm font-semibold uppercase tracking-wider mb-2">
              Jobhir
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold">
              Offer a Job
            </h1>

            <p className="mt-3 text-sky-100 text-base sm:text-lg">
              Find skilled workers near you and post your job requirement.
            </p>

          </div>

        </div>
      </div>

      {/* =========================
          Main Form
      ========================= */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">

          {/* Form */}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">

            <div className="p-6 sm:p-8">

              <div className="mb-7">

                <h2 className="text-xl font-bold text-slate-800">
                  Job Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Enter the details of the work you need.
                </p>

              </div>

              <form
                onSubmit={submitJob}
                className="space-y-5"
              >

                {/* Job Title */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) =>
                      setJobTitle(e.target.value)
                    }
                    placeholder="e.g. Electrician Required"
                    className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>

                {/* Description */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Job Description{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    value={jobDescription}
                    onChange={(e) =>
                      setJobDescription(e.target.value)
                    }
                    placeholder="Describe the work clearly..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none resize-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  />
                </div>

                {/* Amount */}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Work Amount{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
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
                      className="w-full h-12 pl-9 pr-4 rounded-lg border border-slate-300 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                    />

                  </div>
                </div>

                {/* District + Work Type */}

                <div className="grid sm:grid-cols-2 gap-5">

                  {/* District */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      District{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      value={jobDistrict}
                      onChange={(e) =>
                        setJobDistrict(e.target.value)
                      }
                      className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

                  {/* Work Type */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Work Type{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      value={jobWorkType}
                      onChange={(e) =>
                        setJobWorkType(e.target.value)
                      }
                      className="w-full h-12 px-4 rounded-lg border border-slate-300 bg-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                      <option value="">
                        Select Work Type
                      </option>

                      {workTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Contact Section */}

                <div className="pt-3">

                  <h3 className="text-base font-bold text-slate-800 mb-4">
                    Contact Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-5">

                    {/* Phone */}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                        className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                    {/* Email */}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email
                        <span className="text-slate-400 font-normal">
                          {" "}
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
                        className="w-full h-12 px-4 rounded-lg border border-slate-300 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>

                  </div>

                </div>

                {/* Submit */}

                <div className="pt-3">

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Posting Job..."
                      : "Post Job"}
                  </button>

                </div>

              </form>

            </div>

          </div>

          {/* =========================
              Right Information
          ========================= */}

          <div className="space-y-5">

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <h3 className="font-bold text-slate-800 text-lg mb-4">
                How it works
              </h3>

              <div className="space-y-4">

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Post your job
                    </p>

                    <p className="text-sm text-slate-500">
                      Tell us what work you need.
                    </p>
                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Matching workers
                    </p>

                    <p className="text-sm text-slate-500">
                      Workers matching your district and skill are notified.
                    </p>
                  </div>

                </div>

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Get connected
                    </p>

                    <p className="text-sm text-slate-500">
                      Connect with a suitable worker.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6">

              <h3 className="font-bold text-sky-800 mb-2">
                Worker notifications
              </h3>

              <p className="text-sm text-sky-700 leading-6">
                When you post a job, registered workers with the same
                district and work type will receive a notification.
              </p>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <p className="text-sm text-slate-500 leading-6">
                Please provide accurate job details and a valid phone
                number so workers can contact you.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}