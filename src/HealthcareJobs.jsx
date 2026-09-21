
import { useMemo, useState } from "react";

/* =========================================================
   CONTACTS
========================================================= */

const CONTACTS = [
  {
    name: "Javed Ali",
    phone: "9760020822",
  },
  {
    name: "Kalpana",
    phone: "6002511436",
  },
  {
    name: "Priti Kumari",
    phone: "9027497076",
  },
];

/* =========================================================
   HOSPITALS
========================================================= */

const hospitals = [
  {
    id: "mahanand",
    name: "Mahanand Hospital",
    location: "Noida, Uttar Pradesh",
    shortName: "MH",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: "felix",
    name: "Felix Hospital",
    location: "Noida, Uttar Pradesh",
    shortName: "FH",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    id: "max",
    name: "Max Hospital",
    location: "Noida / NCR",
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

function LocationIcon({ size = 17 }) {
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

function PhoneIcon({ size = 17 }) {
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

function WhatsAppIcon({ size = 17 }) {
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

function SearchIcon({ size = 19 }) {
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

/* =========================================================
   COMPONENT
========================================================= */

export default function HealthcareJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        healthcareJobs.map((job) => job.category)
      ),
    ];
  }, []);

  /* =======================================================
     FILTER JOBS
  ======================================================= */

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

  /* =======================================================
     WHATSAPP
  ======================================================= */

  const handleWhatsAppApply = (job, contact) => {
    const message =
      `Hello ${contact.name}, I am interested in the ` +
      `${job.title} position in Noida. ` +
      `Please share the application details.`;

    window.open(
      `https://wa.me/91${contact.phone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  /* =======================================================
     CALL
  ======================================================= */

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  /* =======================================================
     OPEN HOSPITAL
  ======================================================= */

  const openHospital = (hospital) => {
    setSelectedHospital(hospital);
    setSearchTerm("");
    setSelectedCategory("All");

    setTimeout(() => {
      document
        .getElementById("healthcare-hospital-jobs")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  /* =======================================================
     CLOSE JOB MODAL
  ======================================================= */

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="w-full">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="border-b border-emerald-100 bg-white px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-emerald-100 text-xl">
              🏥
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                Hospital & Healthcare Jobs
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Find healthcare opportunities in Noida
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <span className="flex items-center gap-1.5 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {hospitals.length} Hospitals
            </span>

            <span className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
              {healthcareJobs.length} Jobs
            </span>

          </div>
        </div>
      </div>

      {/* ===================================================
          HOSPITALS
      =================================================== */}

      {!selectedHospital && (
        <div className="p-4 sm:p-5">

          <div className="mb-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Choose Hospital
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Select a hospital to see available jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            {hospitals.map((hospital) => (
              <button
                key={hospital.id}
                type="button"
                onClick={() => openHospital(hospital)}
                className="group relative overflow-hidden border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              >

                <div
                  className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${hospital.accent}`}
                />

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-to-br ${hospital.accent} text-sm font-black text-white shadow-sm`}
                  >
                    {hospital.shortName}
                  </div>

                  <div className="min-w-0 flex-1">

                    <h4 className="truncate text-sm font-extrabold text-slate-900 group-hover:text-emerald-700">
                      {hospital.name}
                    </h4>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <LocationIcon size={14} />
                      <span className="truncate">
                        {hospital.location}
                      </span>
                    </div>

                  </div>

                  <span className="text-lg text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600">
                    →
                  </span>

                </div>

              </button>
            ))}

          </div>
        </div>
      )}

      {/* ===================================================
          SELECTED HOSPITAL / JOBS
      =================================================== */}

      {selectedHospital && (
        <section
          id="healthcare-hospital-jobs"
          className="border-t border-slate-200 bg-slate-50 p-4 sm:p-5"
        >

          {/* Hospital bar */}

          <div className="mb-4 flex flex-col gap-3 border border-emerald-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-emerald-100 text-sm font-black text-emerald-700">
                {selectedHospital.shortName}
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Selected Hospital
                </p>

                <h3 className="text-base font-black text-slate-900">
                  {selectedHospital.name}
                </h3>

                <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <LocationIcon size={13} />
                  {selectedHospital.location}
                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedHospital(null);
                setSelectedJob(null);
              }}
              className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
            >
              ← All Hospitals
            </button>

          </div>

          {/* Search */}

          <div className="border border-slate-200 bg-white p-3 sm:p-4">

            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon size={18} />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search job, department or qualification..."
                className="w-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* Categories */}

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`shrink-0 px-3 py-2 text-[11px] font-bold transition ${
                    selectedCategory === category
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>

          </div>

          {/* Count */}

          <div className="my-4 flex items-center justify-between">

            <p className="text-xs font-bold text-slate-700">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1
                ? "Job"
                : "Jobs"}{" "}
              Available
            </p>

            <span className="text-[10px] font-semibold text-slate-400">
              📍 {selectedHospital.location}
            </span>

          </div>

          {/* =================================================
              JOB CARDS
          ================================================= */}

          {filteredJobs.length === 0 ? (
            <div className="border border-dashed border-slate-300 bg-white px-5 py-12 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center bg-slate-100 text-xl">
                🔍
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-800">
                No jobs found
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Try another search or category.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="group flex h-full flex-col border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >

                  {/* Job title */}

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-50 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                      {job.icon}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="text-[10px] font-bold text-emerald-600">
                        {job.category}
                      </p>

                      <h3 className="mt-0.5 text-sm font-extrabold text-slate-900 group-hover:text-emerald-700">
                        {job.title}
                      </h3>

                    </div>

                  </div>

                  {/* Simple details */}

                  <div className="mt-4 space-y-2">

                    <div className="flex items-start gap-2">
                      <span className="text-sm">🏢</span>

                      <div>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
                          Department
                        </p>

                        <p className="text-xs font-semibold text-slate-700">
                          {job.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-sm">⏱️</span>

                      <div>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
                          Experience
                        </p>

                        <p className="text-xs font-semibold text-slate-700">
                          {job.experience}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-sm">🎓</span>

                      <div>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
                          Qualification
                        </p>

                        <p className="text-xs font-semibold text-slate-700">
                          {job.qualification}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Bottom */}

                  <div className="mt-auto pt-4">

                    <div className="mb-3 flex items-center justify-between border-t border-slate-100 pt-3">

                      <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                        <LocationIcon size={13} />
                        {job.location}
                      </span>

                      <span className="text-[10px] font-bold text-slate-500">
                        {job.employment}
                      </span>

                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="flex w-full items-center justify-center gap-2 bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                    >
                      View & Apply
                      <span>→</span>
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>
      )}

      {/* ===================================================
          APPLY MODAL
      =================================================== */}

      {selectedJob && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-4"
          onClick={closeModal}
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto bg-white shadow-2xl"
          >

            {/* Header */}

            <div className="relative bg-gradient-to-r from-emerald-800 to-teal-700 p-5 text-white">

              <button
                type="button"
                onClick={closeModal}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-white/10 text-lg hover:bg-white/20"
              >
                ×
              </button>

              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Healthcare Job
              </p>

              <h3 className="mt-1 pr-8 text-xl font-black">
                {selectedJob.title}
              </h3>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-100">
                <LocationIcon size={13} />
                {selectedJob.location}
              </div>

            </div>

            {/* Content */}

            <div className="p-5">

              {/* Job information */}

              <div className="space-y-3">

                <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                  <span className="text-lg">🏢</span>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Department
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-700">
                      {selectedJob.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                  <span className="text-lg">⏱️</span>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Experience
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-700">
                      {selectedJob.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                  <span className="text-lg">🎓</span>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Qualification
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-700">
                      {selectedJob.qualification}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg">💼</span>

                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Employment
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-slate-700">
                      {selectedJob.employment}
                    </p>
                  </div>
                </div>

              </div>

              {/* Recruitment */}

              <div className="mt-6">

                <h4 className="text-sm font-black text-slate-900">
                  📞 Contact Recruitment
                </h4>

                <p className="mt-1 text-[11px] text-slate-500">
                  Call or WhatsApp the recruitment contact for application details.
                </p>

                <div className="mt-3 space-y-2">

                  {CONTACTS.map((contact) => (
                    <div
                      key={contact.phone}
                      className="flex flex-col gap-3 border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white text-emerald-600 shadow-sm">
                          <PhoneIcon size={16} />
                        </div>

                        <div>
                          <p className="text-xs font-extrabold text-slate-800">
                            {contact.name}
                          </p>

                          <p className="text-[11px] font-semibold text-slate-500">
                            {contact.phone}
                          </p>
                        </div>

                      </div>

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleCall(contact.phone)
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 border border-slate-200 bg-white px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-100 sm:flex-none"
                        >
                          <PhoneIcon size={14} />
                          Call
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleWhatsAppApply(
                              selectedJob,
                              contact
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 bg-emerald-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-emerald-700 sm:flex-none"
                        >
                          <WhatsAppIcon size={14} />
                          WhatsApp
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

              </div>

              {/* Notice */}

              <div className="mt-5 border border-amber-200 bg-amber-50 p-3">
                <p className="text-[11px] leading-5 text-amber-800">
                  <strong>Important:</strong> JobHIR does not guarantee
                  selection. Verify the recruitment process before sharing
                  documents or making any payment.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

