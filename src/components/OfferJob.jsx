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
                onChange={(e) => setJobDescription(e.target.value)}
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
                  Work Amount <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={jobAmount}
                    onChange={(e) => setJobAmount(e.target.value)}
                    placeholder="500"
                    className="h-11 w-full rounded-lg border border-slate-300 pl-9 pr-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  District <span className="text-red-500">*</span>
                </label>

                <select
                  value={jobDistrict}
                  onChange={(e) => setJobDistrict(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Select District</option>

                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Work Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Work Type <span className="text-red-500">*</span>
              </label>

              <select
                value={jobWorkType}
                onChange={(e) => setJobWorkType(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">Select Work Type</option>

                {workTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  value={jobPhone}
                  onChange={(e) =>
                    setJobPhone(
                      e.target.value.replace(/\D/g, "").slice(0, 10)
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
                  onChange={(e) => setJobEmail(e.target.value)}
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
              {loading ? "Posting Job..." : "Post Job"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}