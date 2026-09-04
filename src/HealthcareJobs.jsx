import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// =====================================================
// CONTACTS
// =====================================================

const CONTACTS = [
  {
    name: "Recruitment Contact",
    phone: "9760020822",
  },
  {
    name: "Recruitment Contact",
    phone: "6002511436",
  },
];

// =====================================================
// HOSPITALS
// =====================================================

const hospitals = [
  {
    name: "Mahanand Hospital",
    location: "Noida, Uttar Pradesh",
  },
  {
    name: "Felix Hospital",
    location: "Noida, Uttar Pradesh",
  },
  {
    name: "Max Hospital",
    location: "Noida, Uttar Pradesh",
  },
];

// =====================================================
// HEALTHCARE JOBS
// =====================================================

const healthcareJobs = [
  {
    id: 1,
    title: "Staff Nurse",
    category: "Nursing",
    department: "General Ward",
    experience: "0-3 Years",
    qualification: "GNM / B.Sc Nursing",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Responsible for providing quality patient care, monitoring patients, administering medicines as prescribed and maintaining proper nursing records.",
  },

  {
    id: 2,
    title: "Nursing Assistant",
    category: "Nursing",
    department: "Patient Care",
    experience: "Fresher / Experienced",
    qualification: "Relevant Nursing / Healthcare Training",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Assist nurses and medical staff in routine patient care, maintaining cleanliness and supporting patients with their daily healthcare needs.",
  },

  {
    id: 3,
    title: "Ward Boy",
    category: "Support Staff",
    department: "Hospital Ward",
    experience: "Fresher Welcome",
    qualification: "Basic Education Preferred",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Support hospital staff with patient movement, ward assistance, basic housekeeping coordination and other routine hospital duties.",
  },

  {
    id: 4,
    title: "Patient Care Executive",
    category: "Patient Care",
    department: "Patient Services",
    experience: "0-2 Years",
    qualification: "Graduate / Relevant Experience Preferred",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Assist patients and their attendants, coordinate patient services and help maintain a smooth patient experience within the hospital.",
  },

  {
    id: 5,
    title: "Hospital Receptionist",
    category: "Administration",
    department: "Front Office",
    experience: "0-2 Years",
    qualification: "Graduate / Good Communication Skills",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Handle reception duties, patient registration, appointment coordination, basic enquiries and communication with patients and attendants.",
  },

  {
    id: 6,
    title: "Pharmacy Assistant",
    category: "Pharmacy",
    department: "Pharmacy",
    experience: "0-2 Years",
    qualification: "D.Pharm / Relevant Experience Preferred",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Assist pharmacy staff with medicine handling, stock management, billing support and maintaining proper pharmacy records.",
  },

  {
    id: 7,
    title: "Lab Technician",
    category: "Laboratory",
    department: "Diagnostics",
    experience: "1+ Years Preferred",
    qualification: "DMLT / BMLT / Relevant Qualification",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Perform laboratory procedures, handle samples, maintain equipment and follow required safety and quality standards.",
  },

  {
    id: 8,
    title: "Housekeeping Staff",
    category: "Support Staff",
    department: "Housekeeping",
    experience: "Fresher / Experienced",
    qualification: "Basic Education Preferred",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Maintain cleanliness and hygiene in hospital areas while following healthcare housekeeping and safety procedures.",
  },

  {
    id: 9,
    title: "OT Assistant",
    category: "Technical",
    department: "Operation Theatre",
    experience: "0-3 Years",
    qualification: "Relevant OT / Healthcare Training",
    location: "Noida",
    hospital: "Healthcare Opportunities",
    description:
      "Assist operation theatre staff with preparation, equipment handling, cleanliness and other routine OT support activities.",
  },
];

// =====================================================
// ICONS
// =====================================================

const LocationIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.5 1.7.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35ZM12.05 2C6.52 2 2.02 6.5 2.02 12.03c0 1.77.46 3.5 1.34 5.02L2 22l5.08-1.33a9.98 9.98 0 0 0 4.97 1.35h.01c5.53 0 10.03-4.5 10.03-10.03C22.09 6.5 17.59 2 12.05 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.01.79.8-2.94-.2-.3a8.2 8.2 0 1 1 6.9 3.78Z" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </svg>
);

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function HealthcareJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  // ===================================================
  // CATEGORIES
  // ===================================================

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(healthcareJobs.map((job) => job.category)),
    ];
  }, []);

  // ===================================================
  // FILTER JOBS
  // ===================================================

  const filteredJobs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return healthcareJobs.filter((job) => {
      const matchesCategory =
        selectedCategory === "All" ||
        job.category === selectedCategory;

      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search) ||
        job.category.toLowerCase().includes(search) ||
        job.department.toLowerCase().includes(search) ||
        job.qualification.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  // ===================================================
  // WHATSAPP APPLY
  // ===================================================

  const handleWhatsAppApply = (job, phone) => {
    const message = `Hello, I want to apply for the following healthcare job.

Job: ${job.title}
Category: ${job.category}
Department: ${job.department}
Experience: ${job.experience}
Qualification: ${job.qualification}
Location: ${job.location}

Please provide me with further details regarding this job.`;

    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ===================================================
  // CALL
  // ===================================================

  const handleCall = (phone) => {
    window.location.href = `tel:+91${phone}`;
  };

  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const closeModal = () => {
    setSelectedJob(null);
  };

  // ===================================================
  // ESCAPE + BODY SCROLL
  // ===================================================

  useEffect(() => {
    if (!selectedJob) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedJob]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* =================================================
          HERO - LIGHT
      ================================================= */}

      <section className="bg-green-50 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="max-w-2xl">
            <p className="text-green-700 text-sm font-semibold mb-2">
              Healthcare Careers
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Healthcare Jobs in Noida
            </h1>

            <p className="mt-3 text-gray-600 text-sm md:text-base">
              Find healthcare and hospital job opportunities in Noida.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          HOSPITALS - COMPACT
      ================================================= */}

      <section className="py-7">
        <div className="max-w-6xl mx-auto px-4">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Hospital Opportunities
            </h2>

            <span className="text-xs text-gray-500">
              Noida & NCR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {hospitals.map((hospital) => (
              <div
                key={hospital.name}
                className="border border-gray-200 rounded-lg px-4 py-3"
              >
                <h3 className="text-sm font-semibold text-gray-900">
                  {hospital.name}
                </h3>

                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                  <LocationIcon className="w-3.5 h-3.5" />
                  {hospital.location}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <section className="bg-gray-50 border-y border-gray-100 py-5">
        <div className="max-w-6xl mx-auto px-4">

          <div className="flex flex-col md:flex-row gap-3">

            {/* SEARCH */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search healthcare jobs..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* CATEGORY */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 md:w-52 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-green-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

          </div>

        </div>
      </section>

      {/* =================================================
          JOBS
      ================================================= */}

      <section className="py-8 md:py-10">
        <div className="max-w-6xl mx-auto px-4">

          {/* SECTION HEADER */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Available Jobs
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {filteredJobs.length} opportunities found
              </p>
            </div>
          </div>

          {/* NO JOB */}
          {filteredJobs.length === 0 ? (
            <div className="border border-gray-200 rounded-xl py-12 text-center">
              <p className="text-gray-500 text-sm">
                No healthcare jobs found.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-3 text-sm font-medium text-green-600 hover:text-green-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="border border-gray-200 rounded-xl p-4 bg-white hover:border-green-300 hover:shadow-sm transition"
                >

                  {/* TITLE + CATEGORY */}
                  <div className="mb-4">
                    <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      {job.category}
                    </span>

                    <h3 className="mt-2 text-base font-bold text-gray-900">
                      {job.title}
                    </h3>
                  </div>

                  {/* ONLY SHORT INFO */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">

                    <div className="flex items-center gap-1.5">
                      <LocationIcon className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <BriefcaseIcon className="w-3.5 h-3.5" />
                      <span>{job.experience}</span>
                    </div>

                  </div>

                  {/* DETAILS BUTTON */}
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full h-9 rounded-lg bg-gray-900 hover:bg-green-600 text-white text-sm font-semibold transition"
                  >
                    View Details
                  </button>

                </article>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* =================================================
          CONTACT SECTION - COMPACT
      ================================================= */}

      <section className="bg-green-50 border-y border-green-100 py-7">
        <div className="max-w-6xl mx-auto px-4">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Need Help Applying?
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                Contact our recruitment team.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              {CONTACTS.map((contact) => (
                <button
                  key={contact.phone}
                  onClick={() => handleCall(contact.phone)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-800 hover:border-green-500 transition"
                >
                  <PhoneIcon className="w-4 h-4 text-green-600" />
                  {contact.phone}
                </button>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          JOB DETAILS MODAL
      ================================================= */}

      {selectedJob && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
          onClick={closeModal}
        >

          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-4 flex items-start justify-between">

              <div className="pr-4">
                <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  {selectedJob.category}
                </span>

                <h2 className="text-xl font-bold text-gray-900 mt-2">
                  {selectedJob.title}
                </h2>
              </div>

              <button
                onClick={closeModal}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* MODAL CONTENT */}
            <div className="p-5">

              {/* BASIC DETAILS */}
              <div className="grid grid-cols-2 gap-3">

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[11px] text-gray-500">
                    Department
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedJob.department}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[11px] text-gray-500">
                    Experience
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedJob.experience}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[11px] text-gray-500">
                    Qualification
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedJob.qualification}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[11px] text-gray-500">
                    Location
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedJob.location}
                  </p>
                </div>

              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">

                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  Job Description
                </h3>

                <p className="text-sm text-gray-600 leading-6">
                  {selectedJob.description}
                </p>

              </div>

              {/* HOSPITAL */}
              <div className="mt-5">

                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  Hospital / Organization
                </h3>

                <p className="text-sm text-gray-600">
                  {selectedJob.hospital}
                </p>

              </div>

              {/* APPLY */}
              <div className="mt-6 pt-5 border-t border-gray-100">

                <p className="text-sm font-bold text-gray-900 mb-3">
                  Apply for this Job
                </p>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    onClick={() =>
                      handleWhatsAppApply(
                        selectedJob,
                        CONTACTS[0].phone
                      )
                    }
                    className="h-11 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </button>

                  <button
                    onClick={() =>
                      handleCall(CONTACTS[0].phone)
                    }
                    className="h-11 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <PhoneIcon />
                    Call Now
                  </button>

                </div>

              </div>

              {/* OTHER CONTACT */}
              <div className="mt-4">

                <button
                  onClick={() =>
                    handleWhatsAppApply(
                      selectedJob,
                      CONTACTS[1].phone
                    )
                  }
                  className="w-full text-xs text-gray-500 hover:text-green-600 transition"
                >
                  Or contact recruitment at {CONTACTS[1].phone}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      <Footer />
    </div>
  );
}