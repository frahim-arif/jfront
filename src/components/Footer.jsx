import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  MessageCircle,
  Building2,
  ChevronDown,
  BriefcaseBusiness,
} from "lucide-react";

export default function Footer({
  totalJobs = 0,
  availableJobs = 0,
  is24x7 = true,
}) {
  const currentYear = new Date().getFullYear();

  const [showContact, setShowContact] = useState(false);
  const [showHealthcare, setShowHealthcare] = useState(false);

  const recruitmentContacts = [
    { name: "Javed Ali", phone: "9760020822" },
    { name: "Kalpana", phone: "6002511436" },
    { name: "Priti Kumari", phone: "9027497076" },
  ];

  const handleWhatsApp = (name, phone) => {
    const message = `Hello ${name}, I am contacting you regarding healthcare recruitment through JobHIR.`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Shared glass-card style
  const glass =
    "border border-white/90 bg-white/60 backdrop-blur-md shadow-[0_8px_22px_rgba(2,132,199,0.14)]";

  return (
    <footer className="relative mt-8 w-full overflow-hidden border-t border-sky-300 bg-gradient-to-br from-sky-100 via-sky-200 to-sky-300 text-[#0c2a43]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-16 h-52 w-52 rounded-full bg-white/80 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-sky-500/40 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sky-500 via-sky-300 to-sky-500" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {/* Brand + Stats */}
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
              aria-label="JobHIR home"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white bg-white p-1.5 shadow-md shadow-sky-500/20 transition duration-300 group-hover:-translate-y-0.5">
                <img
                  src="/images/job.png"
                  alt="JobHIR"
                  className="h-full w-full object-contain"
                />
              </span>

              <span>
                <span className="block text-xl font-black tracking-tight text-[#0c2a43]">
                  Job<span className="text-sky-600">HIR</span>
                </span>

                <span className="block text-[10px] font-medium tracking-wide text-[#3d6283]">
                  Find Work. Build Your Future.
                </span>
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-5 text-[#3d6283]">
              JobHIR connects skilled workers with job opportunities and
              helps employers find suitable workers across India.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-3 py-1.5 shadow-sm">
              <ShieldCheck size={14} className="shrink-0 text-sky-600" />
              <span className="text-[10px] font-semibold text-[#0c2a43]">
                Secure & Trusted Job Platform
              </span>
            </div>

            {/* Dynamic Job Statistics */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-amber-300/70 bg-white/70 px-2.5 py-1.5 shadow-sm">
                <span className="text-base font-black text-amber-600">
                  {totalJobs}
                </span>
                <span className="text-[11px] font-semibold text-[#0c2a43]">
                  Total Jobs
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/70 bg-white/70 px-2.5 py-1.5 shadow-sm">
                <span className="text-base font-black text-emerald-600">
                  {availableJobs}
                </span>
                <span className="text-[11px] font-semibold text-[#0c2a43]">
                  Available Jobs
                </span>
              </div>

              {is24x7 && (
                <div className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-white/70 px-2.5 py-1.5 shadow-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-600 text-[10px] font-black text-white">
                    24
                  </span>
                  <span className="text-[11px] font-semibold text-sky-700">
                    24/7 Job Access
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Healthcare */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {/* Contact Toggle */}
              <button
                type="button"
                onClick={() => setShowContact((prev) => !prev)}
                aria-expanded={showContact}
                className={`group flex w-full items-center justify-between gap-3 rounded-xl p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-white/80 ${glass}`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 shadow-md shadow-sky-500/30">
                    <Phone size={16} className="text-white" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#0c2a43]">
                      Contact Us
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#3d6283]">
                      Get in touch with JobHIR
                    </span>
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[#3d6283] transition-transform duration-200 ${
                    showContact ? "rotate-180 text-sky-600" : ""
                  }`}
                />
              </button>

              {/* Healthcare Toggle */}
              <button
                type="button"
                onClick={() => setShowHealthcare((prev) => !prev)}
                aria-expanded={showHealthcare}
                className={`group flex w-full items-center justify-between gap-3 rounded-xl p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-white/80 ${glass}`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/30">
                    <Building2 size={16} className="text-white" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#0c2a43]">
                      Healthcare Recruitment
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#3d6283]">
                      Recruitment & job enquiries
                    </span>
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[#3d6283] transition-transform duration-200 ${
                    showHealthcare ? "rotate-180 text-sky-600" : ""
                  }`}
                />
              </button>
            </div>

            {/* Contact Details */}
            {showContact && (
              <div className={`mt-2.5 rounded-xl p-2.5 sm:p-3 ${glass}`}>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <a
                    href="tel:+917002298053"
                    className="flex min-w-0 items-center gap-3 rounded-lg border border-sky-200 bg-white/70 p-2.5 transition hover:border-sky-400 hover:bg-white"
                  >
                    <Phone size={16} className="shrink-0 text-sky-600" />
                    <span className="min-w-0">
                      <span className="block text-[9px] uppercase tracking-wider text-[#3d6283]">
                        Phone
                      </span>
                      <span className="block text-xs font-semibold text-[#0c2a43]">
                        +91 70022 98053
                      </span>
                    </span>
                  </a>

                  <a
                    href="mailto:support@jobhir.com"
                    className="flex min-w-0 items-center gap-3 rounded-lg border border-sky-200 bg-white/70 p-2.5 transition hover:border-sky-400 hover:bg-white"
                  >
                    <Mail size={16} className="shrink-0 text-sky-600" />
                    <span className="min-w-0">
                      <span className="block text-[9px] uppercase tracking-wider text-[#3d6283]">
                        Email
                      </span>
                      <span className="block truncate text-xs font-semibold text-[#0c2a43]">
                        support@jobhir.com
                      </span>
                    </span>
                  </a>

                  <div className="flex items-center gap-3 rounded-lg border border-sky-200 bg-white/70 p-2.5 sm:col-span-2">
                    <MapPin size={16} className="shrink-0 text-sky-600" />
                    <span>
                      <span className="block text-[9px] uppercase tracking-wider text-[#3d6283]">
                        Location
                      </span>
                      <span className="block text-xs font-semibold text-[#0c2a43]">
                        Assam, India
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Healthcare Details */}
            {showHealthcare && (
              <div className={`mt-2.5 rounded-xl p-2.5 sm:p-3 ${glass}`}>
                <p className="mb-3 text-[11px] leading-5 text-[#3d6283]">
                  For healthcare job availability and recruitment enquiries,
                  contact our recruitment team.
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {recruitmentContacts.map((contact) => (
                    <div
                      key={contact.phone}
                      className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-sky-200 bg-white/70 p-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-[#0c2a43]">
                          {contact.name}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#3d6283]">
                          {contact.phone}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1.5">
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-sky-200 bg-white text-sky-700 transition hover:border-sky-400 hover:bg-sky-50"
                          title={`Call ${contact.name}`}
                          aria-label={`Call ${contact.name}`}
                        >
                          <Phone size={13} />
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            handleWhatsApp(contact.name, contact.phone)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-500"
                          title={`WhatsApp ${contact.name}`}
                          aria-label={`WhatsApp ${contact.name}`}
                        >
                          <MessageCircle size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Worker Registration CTA */}
        <div className="mt-5 flex flex-col gap-3 border-y border-sky-400/40 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
              <BriefcaseBusiness size={17} className="text-sky-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#0c2a43]">
                Looking for work?
              </h3>
              <p className="max-w-md text-[11px] leading-4 text-[#3d6283]">
                Register with JobHIR and explore opportunities suited to your
                skills.
              </p>
            </div>
          </div>

          <Link
            to="/worker-register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-sky-600/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-600/40 active:translate-y-0 sm:w-auto"
          >
            Register Now
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-1 pt-3.5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[10px] leading-5 text-[#3d6283]">
            © {currentYear} JobHIR. All Rights Reserved.
          </p>

          <p className="text-[10px] leading-5 text-[#3d6283]">
            Powered & Developed by{" "}
            <span className="font-semibold text-sky-700">
              Web Core Cube Tech - 9058596626
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}