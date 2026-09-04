import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// ======================================================
// HEALTHCARE JOBS
// ======================================================

const CONTACTS = [
  {
    name: "Recruitment Contact 1",
    phone: "9760020822",
  },
  {
    name: "Recruitment Contact 2",
    phone: "6002511436",
  },
];

// ======================================================
// HOSPITAL / OPPORTUNITY DATA
// ======================================================

const hospitals = [
  {
    id: 1,
    name: "Mahanand Hospital",
    location: "Noida, Uttar Pradesh",
    type: "Healthcare Opportunities",
    shortName: "MH",
  },
  {
    id: 2,
    name: "Felix Hospital",
    location: "Noida, Uttar Pradesh",
    type: "Healthcare Opportunities",
    shortName: "FH",
  },
  {
    id: 3,
    name: "Max Hospital",
    location: "Noida / NCR",
    type: "Healthcare Opportunities",
    shortName: "MX",
  },
];

// ======================================================
// JOB DATA
// ======================================================

const healthcareJobs = [
  {
    id: 1,
    title: "Staff Nurse",
    category: "Nursing",
    department: "General Ward",
    experience: "0 - 3 Years",
    qualification: "GNM / B.Sc Nursing",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "N",
  },
  {
    id: 2,
    title: "Nursing Assistant",
    category: "Nursing",
    department: "Patient Care",
    experience: "Fresher / Experienced",
    qualification: "Healthcare / Relevant Experience",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "NA",
  },
  {
    id: 3,
    title: "Ward Boy",
    category: "Support Staff",
    department: "Hospital Ward",
    experience: "Fresher Welcome",
    qualification: "Relevant Experience Preferred",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "WB",
  },
  {
    id: 4,
    title: "Patient Care Executive",
    category: "Patient Care",
    department: "Patient Services",
    experience: "0 - 2 Years",
    qualification: "Graduate Preferred",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "PC",
  },
  {
    id: 5,
    title: "Hospital Receptionist",
    category: "Administration",
    department: "Front Office",
    experience: "0 - 2 Years",
    qualification: "12th Pass / Graduate",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "HR",
  },
  {
    id: 6,
    title: "Pharmacy Assistant",
    category: "Pharmacy",
    department: "Pharmacy",
    experience: "0 - 2 Years",
    qualification: "Relevant Qualification Preferred",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "PA",
  },
  {
    id: 7,
    title: "Lab Technician",
    category: "Laboratory",
    department: "Diagnostics",
    experience: "1+ Years Preferred",
    qualification: "DMLT / BMLT",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "LT",
  },
  {
    id: 8,
    title: "Housekeeping Staff",
    category: "Support Staff",
    department: "Housekeeping",
    experience: "Fresher / Experienced",
    qualification: "Relevant Experience Preferred",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "HS",
  },
  {
    id: 9,
    title: "OT Assistant",
    category: "Technical",
    department: "Operation Theatre",
    experience: "0 - 3 Years",
    qualification: "Relevant Healthcare Qualification",
    location: "Noida",
    employmentType: "Full Time",
    hospital: "Healthcare Opportunities",
    icon: "OT",
  },
];

// ======================================================
// ICON COMPONENTS
// ======================================================

function LocationIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-5.2 7-12A7 7 0 105 9c0 6.8 7 12 7 12z"
      />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function PhoneIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 01-2.18 2
           19.79 19.79 0 01-8.63-3.07
           19.5 19.5 0 01-6-6
           19.79 19.79 0 01-3.07-8.67
           A2 2 0 014.11 2h3
           a2 2 0 012 1.72
           c.12.9.33 1.78.62 2.63
           a2 2 0 01-.45 2.11L8 9.73
           a16 16 0 006 6l1.27-1.27
           a2 2 0 012.11-.45
           c.85.29 1.73.5 2.63.62
           A2 2 0 0122 16.92z"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.52 3.48A11.87 11.87 0 0012.08 0C5.52 0 .18 5.34.18 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.75a11.9 11.9 0 005.78 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.34zM12.08 21.7a9.86 9.86 0 01-5.03-1.38l-.36-.21-3.74 1.04 1-3.65-.23-.38a9.83 9.83 0 01-1.51-5.22c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.12 1.03 6.98 2.89a9.81 9.81 0 012.89 6.98c0 5.45-4.43 9.88-9.88 9.88zm5.42-7.41c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-1.78-.89-2.95-1.59-4.13-3.61-.31-.54.31-.5.89-1.67.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.31.18-1.43-.07-.12-.25-.2-.55-.35z" />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 20l-4-4"
      />
    </svg>
  );
}

function BriefcaseIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
      />
      <path d="M3 12h18" />
    </svg>
  );
}

function UsersIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      />
    </svg>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function HealthcareJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedJob, setSelectedJob] = useState(null);

  // ====================================================
  // CATEGORIES
  // ====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        healthcareJobs.map(
          (job) => job.category
        )
      ),
    ];

    return [
      "All",
      ...uniqueCategories,
    ];
  }, []);

  // ====================================================
  // FILTER JOBS
  // ====================================================

  const filteredJobs = useMemo(() => {
    return healthcareJobs.filter((job) => {
      const search = searchTerm
        .trim()
        .toLowerCase();

      const matchesSearch =
        !search ||
        job.title
          .toLowerCase()
          .includes(search) ||
        job.category
          .toLowerCase()
          .includes(search) ||
        job.department
          .toLowerCase()
          .includes(search) ||
        job.qualification
          .toLowerCase()
          .includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        job.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    searchTerm,
    selectedCategory,
  ]);

  // ====================================================
  // APPLY ON WHATSAPP
  // ====================================================

  const handleWhatsAppApply = (
    job,
    phone = "9760020822"
  ) => {
    const cleanPhone = String(phone)
      .replace(/\D/g, "");

    const internationalPhone =
      cleanPhone.length === 10
        ? `91${cleanPhone}`
        : cleanPhone;

    const message = `
Hello,

I am interested in applying for the following healthcare job.

Job Position: ${job.title}
Category: ${job.category}
Department: ${job.department}
Location: ${job.location}

Please share more details about the recruitment process.

Thank you.
    `.trim();

    window.open(
      `https://wa.me/${internationalPhone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  // ====================================================
  // CALL
  // ====================================================

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ==================================================
          HEADER
      ================================================== */}

      <Header />

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600">

        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />

          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white blur-3xl" />

          <div className="absolute bottom-0 left-1/2 h-60 w-60 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">

                <LocationIcon className="h-4 w-4" />

                Noida Healthcare Opportunities

              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Find Your Next
                <span className="block text-cyan-100">
                  Healthcare Job
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-sky-50 sm:text-lg">
                Explore healthcare and hospital-related
                job opportunities in Noida. Find roles in
                nursing, patient care, laboratory,
                administration, pharmacy and hospital
                support services.
              </p>

              {/* BUTTONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-sky-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <BriefcaseIcon />

                  View Available Jobs
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <PhoneIcon />

                  Job Enquiry
                </a>

              </div>

              {/* STATS */}

              <div className="mt-10 grid grid-cols-3 gap-3 sm:max-w-xl">

                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur sm:p-4">

                  <p className="text-xl font-black text-white sm:text-2xl">
                    {healthcareJobs.length}+
                  </p>

                  <p className="mt-1 text-[10px] font-medium text-sky-100 sm:text-xs">
                    Job Roles
                  </p>

                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur sm:p-4">

                  <p className="text-xl font-black text-white sm:text-2xl">
                    Noida
                  </p>

                  <p className="mt-1 text-[10px] font-medium text-sky-100 sm:text-xs">
                    Location
                  </p>

                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur sm:p-4">

                  <p className="text-xl font-black text-white sm:text-2xl">
                    2
                  </p>

                  <p className="mt-1 text-[10px] font-medium text-sky-100 sm:text-xs">
                    Enquiry Contacts
                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT HERO CARD */}

            <div className="mx-auto w-full max-w-lg">

              <div className="rounded-3xl border border-white/20 bg-white p-5 shadow-2xl sm:p-7">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="text-sm font-semibold text-sky-600">
                      Healthcare Recruitment
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                      Noida Job Opportunities
                    </h2>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">

                    <UsersIcon className="h-6 w-6" />

                  </div>

                </div>

                <div className="mt-6 space-y-3">

                  {[
                    "Nursing & Patient Care",
                    "Laboratory & Diagnostics",
                    "Hospital Administration",
                    "Pharmacy Support",
                    "Ward & Housekeeping Staff",
                  ].map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sky-600 shadow-sm">
                        ✓
                      </div>

                      <span className="text-sm font-semibold text-slate-700">
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

                <a
                  href="#jobs"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-3.5 font-bold text-white transition hover:bg-sky-700"
                >
                  Browse Healthcare Jobs
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          HOSPITAL / OPPORTUNITY SECTION
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="mx-auto mb-10 max-w-2xl text-center">

          <span className="inline-flex rounded-full bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sky-600">
            Healthcare Opportunities
          </span>

          <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
            Healthcare Job Locations
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Explore job opportunities and recruitment
            enquiries related to healthcare and hospital
            work in the Noida region.
          </p>

        </div>

        <div className="grid gap-5 md:grid-cols-3">

          {hospitals.map((hospital) => (

            <div
              key={hospital.id}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-lg font-black text-white shadow-lg">

                  {hospital.shortName}

                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                  Opportunities
                </span>

              </div>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                {hospital.name}
              </h3>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

                <LocationIcon className="h-4 w-4 text-sky-500" />

                {hospital.location}

              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {hospital.type} related job enquiries
                and recruitment information.
              </p>

              <a
                href="#contact"
                className="mt-5 inline-flex text-sm font-bold text-sky-600 transition hover:text-sky-800"
              >
                Enquire About Jobs →

              </a>

            </div>

          ))}

        </div>

      </section>

      {/* ==================================================
          SEARCH + FILTER
      ================================================== */}

      <section
        id="jobs"
        className="border-y border-slate-200 bg-white"
      >

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
                Available Positions
              </span>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                Healthcare Jobs in Noida
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Search and choose a role that matches
                your skills.
              </p>

            </div>

            <div className="w-full lg:max-w-md">

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search Jobs
              </label>

              <div className="relative">

                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search nurse, lab technician..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />

              </div>

            </div>

          </div>

          {/* CATEGORY BUTTONS */}

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  selectedCategory === category
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-200"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                {category}

              </button>

            ))}

          </div>

        </div>

      </section>

      {/* ==================================================
          JOB LIST
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-7 flex items-center justify-between gap-4">

          <div>

            <h2 className="text-xl font-black text-slate-900">
              {filteredJobs.length} Job
              {filteredJobs.length !== 1
                ? "s"
                : ""}{" "}
              Found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Healthcare opportunities in Noida
            </p>

          </div>

        </div>

        {/* NO JOB */}

        {filteredJobs.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-2xl">
              🔍
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-800">
              No jobs found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another keyword or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-5 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
            >
              Reset Filters
            </button>

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredJobs.map((job) => (

              <article
                key={job.id}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
              >

                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sm font-black text-sky-600">
                      {job.icon}
                    </div>

                    <div className="min-w-0">

                      <span className="text-[11px] font-bold uppercase tracking-wide text-sky-600">
                        {job.category}
                      </span>

                      <h3 className="truncate text-lg font-black text-slate-900">
                        {job.title}
                      </h3>

                    </div>

                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                    Hiring
                  </span>

                </div>

                {/* DETAILS */}

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">

                  <div className="flex justify-between gap-4 text-sm">

                    <span className="text-slate-400">
                      Department
                    </span>

                    <span className="text-right font-semibold text-slate-700">
                      {job.department}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4 text-sm">

                    <span className="text-slate-400">
                      Experience
                    </span>

                    <span className="text-right font-semibold text-slate-700">
                      {job.experience}
                    </span>

                  </div>

                  <div className="flex justify-between gap-4 text-sm">

                    <span className="text-slate-400">
                      Qualification
                    </span>

                    <span className="text-right font-semibold text-slate-700">
                      {job.qualification}
                    </span>

                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">

                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">

                      <LocationIcon className="h-4 w-4 text-sky-500" />

                      {job.location}

                    </div>

                    <span className="text-xs font-semibold text-slate-400">
                      {job.employmentType}
                    </span>

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedJob(job)
                  }
                  className="mt-6 w-full rounded-xl bg-sky-600 px-4 py-3 font-bold text-white transition hover:bg-sky-700 active:scale-[0.98]"
                >
                  View & Apply
                </button>

              </article>

            ))}

          </div>

        )}

      </section>

      {/* ==================================================
          CONTACT SECTION
      ================================================== */}

      <section
        id="contact"
        className="bg-slate-900"
      >

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            {/* LEFT */}

            <div>

              <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-sky-300">
                Job Enquiry
              </span>

              <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
                Interested in a Healthcare Job?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Contact the recruitment enquiry numbers
                below for information about healthcare job
                opportunities in Noida.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">

                <div className="text-amber-300">
                  ℹ
                </div>

                <p className="text-xs leading-5 text-slate-300">
                  Please verify the job details, employer,
                  work location, salary and other terms
                  directly before making any payment or
                  sharing sensitive personal documents.
                </p>

              </div>

            </div>

            {/* CONTACT CARDS */}

            <div className="grid gap-4">

              {CONTACTS.map((contact) => (

                <div
                  key={contact.phone}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300">

                        <PhoneIcon />

                      </div>

                      <div>

                        <p className="text-xs font-semibold text-slate-400">
                          {contact.name}
                        </p>

                        <p className="mt-1 text-lg font-black text-white">
                          +91 {contact.phone}
                        </p>

                      </div>

                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleCall(
                            `+91${contact.phone}`
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100 sm:flex-none"
                      >

                        <PhoneIcon className="h-4 w-4" />

                        Call

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleWhatsAppApply(
                            {
                              title:
                                "Healthcare Job Enquiry",
                              category:
                                "Healthcare",
                              department:
                                "Job Enquiry",
                              location:
                                "Noida",
                            },
                            contact.phone
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 sm:flex-none"
                      >

                        <WhatsAppIcon className="h-4 w-4" />

                        WhatsApp

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          APPLY MODAL
      ================================================== */}

      {selectedJob && (

        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >

          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
              aria-label="Close"
            >
              ×
            </button>

            {/* HEADER */}

            <div className="pr-10">

              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Healthcare Job Application
              </span>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {selectedJob.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {selectedJob.department} •{" "}
                {selectedJob.location}
              </p>

            </div>

            {/* JOB INFO */}

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <p className="text-xs text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {selectedJob.category}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-slate-400">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {selectedJob.experience}
                  </p>

                </div>

                <div className="sm:col-span-2">

                  <p className="text-xs text-slate-400">
                    Qualification
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {selectedJob.qualification}
                  </p>

                </div>

              </div>

            </div>

            {/* APPLY */}

            <div className="mt-6">

              <h3 className="text-base font-black text-slate-900">
                Apply / Enquire
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose a contact method to enquire about
                this job position.
              </p>

              <div className="mt-5 grid gap-3">

                {CONTACTS.map((contact) => (

                  <div
                    key={contact.phone}
                    className="rounded-2xl border border-slate-200 p-4"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-xs text-slate-400">
                          {contact.name}
                        </p>

                        <p className="mt-1 font-bold text-slate-800">
                          +91 {contact.phone}
                        </p>

                      </div>

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleCall(
                              `+91${contact.phone}`
                            )
                          }
                          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          Call
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleWhatsAppApply(
                              selectedJob,
                              contact.phone
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
                        >

                          <WhatsAppIcon className="h-4 w-4" />

                          Apply

                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* DISCLAIMER */}

            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">

              <p className="text-xs leading-5 text-amber-800">
                Important: Confirm the employer, job role,
                salary, location and recruitment terms
                directly before proceeding. Do not make
                payments unless you have independently
                verified the purpose and recipient.
              </p>

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />

    </div>
  );
}