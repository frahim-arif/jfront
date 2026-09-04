import React, { useState } from "react";

const CONTACTS = ["9760020822", "6002511436"];

const hospitals = [
  {
    id: 1,
    name: "Mahanand Hospital",
    location: "Noida",
    type: "Hospital",
    description:
      "Hospital healthcare sector mein nursing, patient care aur support staff ke opportunities.",
    jobs: [
      {
        title: "Staff Nurse",
        department: "Nursing",
        role: "General Ward",
        experience: "0-3 Years",
        qualification: "GNM / B.Sc Nursing",
      },
      {
        title: "Nursing Assistant",
        department: "Nursing",
        role: "Patient Care",
        experience: "Fresher / Experienced",
        qualification: "Relevant Experience Preferred",
      },
      {
        title: "Ward Boy",
        department: "Support Staff",
        role: "Hospital Ward",
        experience: "Fresher Welcome",
        qualification: "Basic Education",
      },
    ],
  },

  {
    id: 2,
    name: "Felix Hospital",
    location: "Noida",
    type: "Hospital",
    description:
      "Hospital operations ke liye nursing, pharmacy aur patient care professionals ki opportunities.",
    jobs: [
      {
        title: "Patient Care Executive",
        department: "Patient Care",
        role: "Patient Services",
        experience: "0-2 Years",
        qualification: "Relevant Qualification",
      },
      {
        title: "Pharmacy Assistant",
        department: "Pharmacy",
        role: "Pharmacy",
        experience: "0-2 Years",
        qualification: "D.Pharm / Relevant Qualification",
      },
      {
        title: "Lab Technician",
        department: "Laboratory",
        role: "Diagnostics",
        experience: "1+ Years Preferred",
        qualification: "DMLT / BMLT",
      },
    ],
  },

  {
    id: 3,
    name: "Max Hospital",
    location: "Noida",
    type: "Hospital",
    description:
      "Healthcare professionals ke liye multiple departments mein employment opportunities.",
    jobs: [
      {
        title: "Housekeeping Staff",
        department: "Support Staff",
        role: "Housekeeping",
        experience: "Fresher / Experienced",
        qualification: "Basic Education",
      },
      {
        title: "OT Assistant",
        department: "Technical",
        role: "Operation Theatre",
        experience: "0-3 Years",
        qualification: "Relevant OT Experience",
      },
      {
        title: "Hospital Receptionist",
        department: "Administration",
        role: "Front Office",
        experience: "0-2 Years",
        qualification: "Graduate / Relevant Experience",
      },
    ],
  },
];

const managers = [
  {
    id: 1,
    name: "Hospital Manager",
    location: "Noida",
    type: "Manager",
    description:
      "Hospital administration, staff coordination aur daily operations se related managerial opportunities.",
    responsibilities: [
      "Hospital staff management",
      "Daily operations coordination",
      "Patient service monitoring",
      "Staff scheduling",
      "Administrative coordination",
    ],
    experience: "2+ Years",
    qualification: "Graduate / Hospital Management",
  },

  {
    id: 2,
    name: "Healthcare Operations Manager",
    location: "Noida",
    type: "Manager",
    description:
      "Healthcare operations aur team management ke liye experienced candidates ki requirement.",
    responsibilities: [
      "Healthcare operations management",
      "Team handling",
      "Department coordination",
      "Performance monitoring",
      "Management reporting",
    ],
    experience: "2-5 Years",
    qualification: "Graduate / MBA / Hospital Management",
  },
];

export default function HealthcareJobs() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("hospital");

  const openWhatsApp = () => {
    const phone = CONTACTS[0];

    const message = encodeURIComponent(
      `Hello, I am interested in ${selectedItem?.name || "Healthcare Job"}`
    );

    window.open(`https://wa.me/91${phone}?text=${message}`, "_blank");
  };

  const callNow = () => {
    window.location.href = `tel:${CONTACTS[0]}`;
  };

  const items = activeTab === "hospital" ? hospitals : managers;

  return (
    <>
      <section className="w-full bg-slate-50 py-8 sm:py-10">
        <div className="w-full px-3 sm:px-5 lg:px-8">
          
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Healthcare Careers
              </span>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Hospital & Manager Jobs
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Healthcare sector ke selected opportunities dekhein.
                Complete job details ke liye card open karein.
              </p>
            </div>

            {/* TABS */}
            <div className="flex w-full rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 sm:w-auto">
              <button
                onClick={() => setActiveTab("hospital")}
                className={`flex-1 rounded-lg px-5 py-2 text-sm font-semibold transition sm:flex-none ${
                  activeTab === "hospital"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Hospitals
              </button>

              <button
                onClick={() => setActiveTab("manager")}
                className={`flex-1 rounded-lg px-5 py-2 text-sm font-semibold transition sm:flex-none ${
                  activeTab === "manager"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Managers
              </button>
            </div>
          </div>

          {/* CARDS */}
          <div
            className={`grid w-full gap-4 ${
              activeTab === "hospital"
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex min-h-[190px] w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        {item.type}
                      </span>

                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        {item.name}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {item.location}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  {/* SHORT INFO */}
                  {item.type === "Hospital" ? (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                        {item.jobs.length} Job Openings
                      </span>

                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                        Multiple Departments
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                        {item.experience}
                      </span>

                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                        Management
                      </span>
                    </div>
                  )}
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => setSelectedItem(item)}
                  className="mt-5 flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5 sm:p-6">
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {selectedItem.type}
                </span>

                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  {selectedItem.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedItem.location}
                </p>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="overflow-y-auto p-5 sm:p-6">
              <p className="text-sm leading-7 text-slate-600">
                {selectedItem.description}
              </p>

              {/* HOSPITAL JOBS */}
              {selectedItem.type === "Hospital" && (
                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Available Job Openings
                  </h3>

                  <div className="space-y-3">
                    {selectedItem.jobs.map((job, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h4 className="font-bold text-slate-900">
                              {job.title}
                            </h4>

                            <p className="mt-1 text-xs text-emerald-600">
                              {job.department} • {job.role}
                            </p>
                          </div>

                          <span className="w-fit rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                            {job.experience}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                          <div className="rounded-lg bg-white p-2.5">
                            <span className="text-slate-400">
                              Qualification
                            </span>

                            <p className="mt-0.5 font-medium text-slate-700">
                              {job.qualification}
                            </p>
                          </div>

                          <div className="rounded-lg bg-white p-2.5">
                            <span className="text-slate-400">
                              Experience
                            </span>

                            <p className="mt-0.5 font-medium text-slate-700">
                              {job.experience}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MANAGER DETAILS */}
              {selectedItem.type === "Manager" && (
                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-bold text-slate-900">
                    Job Details
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Experience
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedItem.experience}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-400">
                        Qualification
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {selectedItem.qualification}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <h4 className="mb-3 font-semibold text-slate-900">
                      Responsibilities
                    </h4>

                    <div className="space-y-2">
                      {selectedItem.responsibilities.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={openWhatsApp}
                  className="rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  WhatsApp Enquiry
                </button>

                <button
                  onClick={callNow}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}