import { useMemo, useState } from "react";

/* =========================================================
   CONTACTS
========================================================= */

const CONTACTS = {
  recruitment1: "9760020822",
  recruitment2: "6002511436",
};

/* =========================================================
   HOSPITALS
========================================================= */

const hospitals = [
  {
    id: "mahanand",
    name: "Mahanand Hospital",
    location: "Noida, Uttar Pradesh",
    type: "Healthcare Opportunities",
    shortName: "MH",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: "felix",
    name: "Felix Hospital",
    location: "Noida, Uttar Pradesh",
    type: "Healthcare Opportunities",
    shortName: "FH",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    id: "max",
    name: "Max Hospital",
    location: "Noida / NCR",
    type: "Healthcare Opportunities",
    shortName: "MX",
    accent: "from-violet-500 to-indigo-600",
  },
];

/* =========================================================
   JOBS
========================================================= */

const healthcareJobs = [
  {
    id: 1,
    title: "Staff Nurse",
    category: "Nursing",
    department: "General Ward",
    experience: "0-3 Years",
    qualification: "GNM / B.Sc Nursing",
    location: "Noida",
    employment: "Full Time",
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
    employment: "Full Time",
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
    employment: "Full Time",
    icon: "WB",
  },
  {
    id: 4,
    title: "Patient Care Executive",
    category: "Patient Care",
    department: "Patient Services",
    experience: "0-2 Years",
    qualification: "Graduate Preferred",
    location: "Noida",
    employment: "Full Time",
    icon: "PC",
  },
  {
    id: 5,
    title: "Hospital Receptionist",
    category: "Administration",
    department: "Front Office",
    experience: "0-2 Years",
    qualification: "12th Pass / Graduate",
    location: "Noida",
    employment: "Full Time",
    icon: "HR",
  },
  {
    id: 6,
    title: "Pharmacy Assistant",
    category: "Pharmacy",
    department: "Pharmacy",
    experience: "0-2 Years",
    qualification: "Relevant Qualification Preferred",
    location: "Noida",
    employment: "Full Time",
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
    employment: "Full Time",
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
    employment: "Full Time",
    icon: "HS",
  },
  {
    id: 9,
    title: "OT Assistant",
    category: "Technical",
    department: "Operation Theatre",
    experience: "0-3 Years",
    qualification: "Relevant Healthcare Qualification",
    location: "Noida",
    employment: "Full Time",
    icon: "OT",
  },
];

/* =========================================================
   ICONS
========================================================= */

function LocationIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-4-.99L3 20l1.15-4.7A8.45 8.45 0 1 1 21 11.5Z" />
      <path d="M8.5 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c-.1.1-.1.3 0 .5.5.9 1.3 1.7 2.2 2.2.2.1.4.1.5 0l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.2.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.1.4-1.5.3-1.1-.2-2.5-.9-3.7-2.1-1.2-1.2-1.9-2.6-2.1-3.7-.1-.4.1-1.1.3-1.5Z" />
    </svg>
  );
}

function SearchIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function BriefcaseIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M12 12v2" />
      <path d="M2 12h20" />
    </svg>
  );
}

function UsersIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function HealthcareJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const categories = useMemo(() => {
    return ["All", ...new Set(healthcareJobs.map((job) => job.category))];
  }, []);

  const filteredJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return healthcareJobs.filter((job) => {
      const matchesSearch =
        !term ||
        job.title.toLowerCase().includes(term) ||
        job.category.toLowerCase().includes(term) ||
        job.department.toLowerCase().includes(term) ||
        job.qualification.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "All" ||
        job.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleWhatsAppApply = (
    job,
    phone = CONTACTS.recruitment1
  ) => {
    const message = `Hello JobHIR, I am interested in the ${job.title} position in Noida. Please share the application details.`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const openHospital = (hospital) => {
    setSelectedHospital(hospital);
    setSearchTerm("");
    setSelectedCategory("All");

    setTimeout(() => {
      document
        .getElementById("hospital-jobs")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950">
        {/* Background decoration */}
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            {/* LEFT */}
            <div className="text-white">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Noida Healthcare Opportunities
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Find Your Next
                <span className="block text-emerald-300">
                  Healthcare Job
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Explore healthcare opportunities across leading hospitals in
                Noida. Find the right role, connect with the recruitment team
                and take your next career step.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    document
                      .getElementById("hospitals")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400"
                >
                  View Hospitals
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Job Enquiry
                </button>
              </div>

              {/* Stats */}
              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-2 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur sm:p-4">
                  <p className="text-xl font-black text-white sm:text-2xl">
                    3
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                    Hospitals
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur sm:p-4">
                  <p className="text-xl font-black text-white sm:text-2xl">
                    9+
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                    Job Roles
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur sm:p-4">
                  <p className="text-xl font-black text-white sm:text-2xl">
                    2
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                    Contacts
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden lg:block">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                      JobHIR Healthcare
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-white">
                      Healthcare Careers
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <BriefcaseIcon size={24} />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Nursing & Patient Care",
                    "Laboratory & Diagnostics",
                    "Hospital Administration",
                    "Pharmacy Support",
                    "Ward & Housekeeping Staff",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                        ✓
                      </span>

                      <span className="text-sm font-medium text-slate-200">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-emerald-500 p-4">
                  <p className="text-sm font-bold text-white">
                    Looking for a healthcare job?
                  </p>

                  <p className="mt-1 text-xs text-emerald-50/80">
                    Select a hospital below to view available opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOSPITALS
      ===================================================== */}

      <section
        id="hospitals"
        className="w-full bg-white py-12 sm:py-16"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Healthcare Partners
              </span>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Choose a Hospital
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Select a hospital to explore healthcare job opportunities and
                recruitment information.
              </p>
            </div>

            <div className="hidden rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 sm:block">
              3 Hospitals Available
            </div>
          </div>

          {/* EXACTLY 3 HOSPITAL CARDS */}
          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                {/* top gradient */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${hospital.accent}`}
                />

                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${hospital.accent} text-lg font-black text-white shadow-lg`}
                  >
                    {hospital.shortName}
                  </div>

                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                    Opportunities
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-black text-slate-900">
                    {hospital.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-emerald-600">
                      <LocationIcon size={17} />
                    </span>
                    {hospital.location}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {hospital.type}
                  </p>
                </div>

                <button
                  onClick={() => openHospital(hospital)}
                  className="mt-6 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                >
                  <span>View Job Opportunities</span>

                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          JOBS INSIDE HOSPITAL
      ===================================================== */}

      {selectedHospital && (
        <section
          id="hospital-jobs"
          className="w-full border-t border-slate-200 bg-slate-50 py-10 sm:py-14"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Hospital Header */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-5 text-white shadow-xl sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-lg font-black backdrop-blur">
                    {selectedHospital.shortName}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                      Selected Hospital
                    </p>

                    <h2 className="mt-1 text-xl font-black sm:text-2xl">
                      {selectedHospital.name}
                    </h2>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                      <LocationIcon size={14} />
                      {selectedHospital.location}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHospital(null)}
                  className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                >
                  Close Jobs
                </button>
              </div>
            </div>

            {/* Search / Filter */}
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Available Healthcare Jobs
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Search and filter available positions.
                  </p>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <SearchIcon size={19} />
                  </div>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search job, department or qualification..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                        selectedCategory === category
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Count */}
            <div className="mb-4 mt-7 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "Position" : "Positions"} Found
              </p>

              <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
                <UsersIcon size={15} />
                Healthcare Recruitment
              </div>
            </div>

            {/* Jobs */}
            {filteredJobs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <SearchIcon size={25} />
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No jobs found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try another search or category.
                </p>
              </div>
            ) : (
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                  >
                    {/* Job Header */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">
                        {job.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            {job.category}
                          </span>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                            Hiring
                          </span>
                        </div>

                        <h3 className="mt-2 text-base font-black text-slate-900">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Department
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {job.department}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Experience
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {job.experience}
                        </p>
                      </div>

                      <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Qualification
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {job.qualification}
                        </p>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-auto pt-5">
                      <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <LocationIcon size={15} />
                          {job.location}
                        </div>

                        <span className="text-[11px] font-bold text-slate-500">
                          {job.employment}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/15 transition hover:bg-emerald-700"
                      >
                        View & Apply
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

     

      {/* =====================================================
          APPLY MODAL
      ===================================================== */}

      {selectedJob && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 to-teal-800 p-6 text-white">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white transition hover:bg-white/20"
              >
                ×
              </button>

              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">
                Healthcare Job Application
              </p>

              <h3 className="mt-2 pr-10 text-2xl font-black">
                {selectedJob.title}
              </h3>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                <LocationIcon size={14} />
                {selectedJob.location}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Department
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedJob.department}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Experience
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedJob.experience}
                  </p>
                </div>

                <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    Qualification
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {selectedJob.qualification}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-black text-slate-900">
                  Contact Recruitment
                </p>

                <div className="mt-3 space-y-3">
                  {[CONTACTS.recruitment1, CONTACTS.recruitment2].map(
                    (phone) => (
                      <div
                        key={phone}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <PhoneIcon size={18} />
                          </div>

                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Recruitment
                            </p>

                            <p className="text-sm font-black text-slate-800">
                              {phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCall(phone)}
                            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            Call
                          </button>

                          <button
                            onClick={() =>
                              handleWhatsAppApply(selectedJob, phone)
                            }
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                          >
                            <WhatsAppIcon size={15} />
                            Apply
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs leading-5 text-amber-800">
                  <strong>Important:</strong> JobHIR does not guarantee
                  selection. Please verify the recruitment process before
                  sharing documents or making any payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}