import { useMemo, useState } from "react";

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

const LocationIcon = () => (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    className="h-3.5 w-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.5 1.7.64.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    <path d="M12.05 2C6.52 2 2.02 6.5 2.02 12.03c0 1.77.46 3.5 1.34 5.02L2 22l5.08-1.33a9.98 9.98 0 0 0 4.97 1.35h.01c5.53 0 10.03-4.5 10.03-10.03C22.09 6.5 17.59 2 12.05 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.01.79.8-2.94-.2-.3a8.2 8.2 0 1 1 6.9 3.78Z" />
  </svg>
);

// =====================================================
// COMPONENT
// =====================================================

export default function HealthcareJobs() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  // ===================================================
  // CATEGORIES
  // ===================================================

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        healthcareJobs.map((job) => job.category)
      ),
    ];
  }, []);

  // ===================================================
  // FILTER
  // ===================================================

  const filteredJobs = useMemo(() => {
    if (selectedCategory === "All") {
      return healthcareJobs;
    }

    return healthcareJobs.filter(
      (job) => job.category === selectedCategory
    );
  }, [selectedCategory]);

  // ===================================================
  // WHATSAPP
  // ===================================================

  const handleWhatsApp = (job) => {
    const phone = "9760020822";

    const message = `Hello, I want to apply for this healthcare job.

Job: ${job.title}
Category: ${job.category}
Location: ${job.location}

Please provide me with more details.`;

    const url =
      `https://wa.me/91${phone}?text=` +
      encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ===================================================
  // CALL
  // ===================================================

  const handleCall = () => {
    window.location.href = "tel:+919760020822";
  };

  return (
    <>
      {/* =================================================
          COMPACT HEALTHCARE SECTION
      ================================================= */}

      <section className="w-full px-3 pb-8 pt-3 sm:px-5 lg:px-8 xl:px-10">

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">

          {/* =================================================
              SECTION HEADER
          ================================================= */}

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                Healthcare
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-slate-800">
                Healthcare Jobs
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Hospital & healthcare opportunities
              </p>
            </div>

            {/* CATEGORY FILTER */}

            <div className="flex gap-2 overflow-x-auto pb-1">

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`
                    whitespace-nowrap
                    rounded-lg
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    transition
                    ${
                      selectedCategory === category
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }
                  `}
                >
                  {category}
                </button>
              ))}

            </div>

          </div>

          {/* =================================================
              JOB GRID
          ================================================= */}

          <div className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          ">

            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-3.5
                  transition
                  hover:border-emerald-200
                  hover:bg-white
                  hover:shadow-sm
                "
              >

                {/* CATEGORY */}

                <span className="
                  inline-flex
                  rounded-md
                  bg-emerald-50
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-emerald-700
                ">
                  {job.category}
                </span>

                {/* TITLE */}

                <h3 className="
                  mt-2
                  line-clamp-1
                  text-sm
                  font-extrabold
                  text-slate-800
                ">
                  {job.title}
                </h3>

                {/* SHORT INFO */}

                <div className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  text-[11px]
                  text-slate-500
                ">

                  <span className="flex items-center gap-1">
                    <LocationIcon />
                    {job.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <BriefcaseIcon />
                    {job.experience}
                  </span>

                </div>

                {/* BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedJob(job)
                  }
                  className="
                    mt-3
                    w-full
                    rounded-lg
                    bg-slate-800
                    py-2
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-emerald-600
                  "
                >
                  View Details
                </button>

              </div>
            ))}

          </div>

        </div>

      </section>

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedJob && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/60
            p-3
            backdrop-blur-sm
          "
          onClick={() => setSelectedJob(null)}
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="
              sticky
              top-0
              z-10
              flex
              items-start
              justify-between
              border-b
              border-slate-100
              bg-white
              px-5
              py-4
            ">

              <div className="pr-4">

                <span className="
                  rounded-md
                  bg-emerald-50
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-emerald-700
                ">
                  {selectedJob.category}
                </span>

                <h2 className="
                  mt-2
                  text-xl
                  font-extrabold
                  text-slate-900
                ">
                  {selectedJob.title}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedJob(null)
                }
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-lg
                  text-slate-500
                  hover:bg-slate-200
                "
              >
                ×
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-5">

              {/* DETAILS GRID */}

              <div className="
                grid
                grid-cols-2
                gap-3
              ">

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Department
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {selectedJob.department}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Experience
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {selectedJob.experience}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Qualification
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {selectedJob.qualification}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-800">
                    {selectedJob.location}
                  </p>
                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-5">

                <h3 className="text-sm font-extrabold text-slate-900">
                  Job Description
                </h3>

                <p className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-600
                ">
                  {selectedJob.description}
                </p>

              </div>

              {/* ORGANIZATION */}

              <div className="mt-5">

                <h3 className="text-sm font-extrabold text-slate-900">
                  Hospital / Organization
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {selectedJob.hospital}
                </p>

              </div>

              {/* APPLY */}

              <div className="
                mt-6
                grid
                grid-cols-2
                gap-3
              ">

                <button
                  type="button"
                  onClick={() =>
                    handleWhatsApp(selectedJob)
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-600
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-emerald-700
                  "
                >
                  <WhatsAppIcon />
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleCall}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-slate-800
                  "
                >
                  <PhoneIcon />
                  Call
                </button>

              </div>

              <p className="
                mt-3
                text-center
                text-[10px]
                text-slate-400
              ">
                Recruitment: 9760020822 / 6002511436
              </p>

            </div>

          </div>

        </div>
      )}

    </>
  );
}