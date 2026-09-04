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
    experience: "2+ Years",
    qualification: "Graduate / Hospital Management",
    responsibilities: [
      "Hospital staff management",
      "Daily operations coordination",
      "Patient service monitoring",
      "Staff scheduling",
      "Administrative coordination",
    ],
  },
  {
    id: 2,
    name: "Healthcare Operations Manager",
    location: "Noida",
    type: "Manager",
    description:
      "Healthcare operations aur team management ke liye experienced candidates ki requirement.",
    experience: "2-5 Years",
    qualification: "Graduate / MBA / Hospital Management",
    responsibilities: [
      "Healthcare operations management",
      "Team handling",
      "Department coordination",
      "Performance monitoring",
      "Management reporting",
    ],
  },
];

export default function HealthcareJobs() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("hospital");

  const items = activeTab === "hospital" ? hospitals : managers;

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello, I am interested in ${selectedItem?.name || "Healthcare Job"}`
    );

    window.open(`https://wa.me/91${CONTACTS[0]}?text=${message}`, "_blank");
  };

  const callNow = () => {
    window.location.href = `tel:${CONTACTS[0]}`;
  };

  return (
    <>
      {/* ================= HEALTHCARE SECTION ================= */}
      <section className="w-full bg-white py-8 sm:py-10">
        <div className="w-full px-3 sm:px-5 lg:px-8">

          {/* SECTION TOP */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-emerald-600">
                Healthcare Careers
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Hospital & Manager Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Healthcare sector ki latest opportunities
              </p>
            </div>

            {/* TAB BUTTONS */}
            <div className="flex w-full rounded-xl border border-slate-200 bg-slate-50 p-1 sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("hospital")}
                className={`flex-1 rounded-lg px-5 py-2 text-sm font-semibold transition sm:flex-none ${
                  activeTab === "hospital"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                Hospitals
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("manager")}
                className={`flex-1 rounded-lg px-5 py-2 text-sm font-semibold transition sm:flex-none ${
                  activeTab === "manager"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                Managers
              </button>
            </div>
          </div>

          {/* ================= CARDS ================= */}
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
                className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                {/* CARD TOP */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        {item.type}
                      </span>

                      <h3 className="mt-3 truncate text-lg font-bold text-slate-900">
                        {item.name}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                      {item.location}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  {/* SMALL INFO */}
                  <div className="mt-4 flex flex-wrap gap-2">

                    {item.type === "Hospital" ? (
                      <>
                        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                          {item.jobs.length} Openings
                        </span>

                        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                          Multiple Departments
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                          {item.experience}
                        </span>

                        <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                          Management
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* CARD BUTTON */}
                <div className="mt-auto border-t border-slate-100 bg-slate-50/70 p-3">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >

            {/* MODAL HEADER */}
            <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6 sm:py-5">

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                    {selectedItem.type}
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    {selectedItem.name}
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <span>{selectedItem.location}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl leading-none text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                >
                  ×
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="overflow-y-auto p-5 sm:p-6">

              {/* DESCRIPTION */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  {selectedItem.description}
                </p>
              </div>

              {/* ================= HOSPITAL ================= */}
              {selectedItem.type === "Hospital" && (
                <div className="mt-6">

                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Job Openings
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Available positions at {selectedItem.name}
                      </p>
                    </div>

                    <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      {selectedItem.jobs.length} Jobs
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedItem.jobs.map((job, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200"
                      >
                        {/* JOB TITLE */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <h4 className="font-bold text-slate-900">
                              {job.title}
                            </h4>

                            <p className="mt-1 text-xs font-medium text-emerald-600">
                              {job.department} • {job.role}
                            </p>
                          </div>

                          <span className="w-fit rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                            {job.experience}
                          </span>
                        </div>

                        {/* JOB INFO */}
                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                              Qualification
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {job.qualification}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                              Experience
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {job.experience}
                            </p>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= MANAGER ================= */}
              {selectedItem.type === "Manager" && (
                <div className="mt-6">

                  <h3 className="text-lg font-bold text-slate-900">
                    Job Details
                  </h3>

                  {/* BASIC DETAILS */}
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Experience
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {selectedItem.experience}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Qualification
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {selectedItem.qualification}
                      </p>
                    </div>

                  </div>

                  {/* RESPONSIBILITIES */}
                  <div className="mt-6">
                    <h4 className="text-base font-bold text-slate-900">
                      Key Responsibilities
                    </h4>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {selectedItem.responsibilities.map(
                        (responsibility, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                              ✓
                            </span>

                            <span className="text-sm text-slate-600">
                              {responsibility}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= CONTACT ================= */}
              <div className="mt-6 border-t border-slate-200 pt-5">

                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Interested in this opportunity?
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    WhatsApp Enquiry
                  </button>

                  <button
                    type="button"
                    onClick={callNow}
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Call Now
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}