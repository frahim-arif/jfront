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
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [showContact, setShowContact] = useState(false);
  const [showHealthcare, setShowHealthcare] = useState(false);

  const recruitmentContacts = [
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

  const handleWhatsApp = (name, phone) => {
    const message = `Hello ${name}, I am contacting you regarding healthcare recruitment through JobHIR.`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <footer className="mt-12 w-full border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==================================================
            MAIN FOOTER
        ================================================== */}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* ==================================================
              BRAND
          ================================================== */}

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <img
                src="/images/job.png"
                alt="JobHIR"
                className="h-11 w-11 rounded-lg object-cover"
              />

              <div>
                <h2 className="text-xl font-black text-white">
                  JobHIR
                </h2>

                <p className="text-[10px] text-slate-500">
                  Find Work. Build Your Future.
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-xs leading-5 text-slate-400">
              JobHIR connects skilled workers with genuine job
              opportunities and helps workers find suitable jobs.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
              <ShieldCheck
                size={14}
                className="text-emerald-400"
              />

              <span className="text-[10px] font-semibold text-emerald-300">
                Secure & Trusted Job Platform
              </span>
            </div>
          </div>


          {/* ==================================================
              CONTACT + HEALTHCARE
          ================================================== */}

          <div className="md:col-span-2">

            {/* ==================================================
                TWO BUTTONS
            ================================================== */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* ==================================================
                  CONTACT BUTTON
              ================================================== */}

              <button
                type="button"
                onClick={() => setShowContact((prev) => !prev)}
                aria-expanded={showContact}
                className="group flex w-full items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-all duration-200 hover:border-emerald-500/40 hover:bg-emerald-500/[0.04]"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-500/20 bg-emerald-500/10">
                    <Phone
                      size={17}
                      className="text-emerald-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-white">
                      Contact Us
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Get in touch with JobHIR
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                    showContact ? "rotate-180 text-emerald-400" : ""
                  }`}
                />
              </button>


              {/* ==================================================
                  HEALTHCARE BUTTON
              ================================================== */}

              <button
                type="button"
                onClick={() => setShowHealthcare((prev) => !prev)}
                aria-expanded={showHealthcare}
                className="group flex w-full items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-all duration-200 hover:border-cyan-500/40 hover:bg-cyan-500/[0.04]"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-cyan-500/20 bg-cyan-500/10">
                    <Building2
                      size={17}
                      className="text-cyan-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-white">
                      Healthcare Recruitment
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Recruitment & job enquiries
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                    showHealthcare
                      ? "rotate-180 text-cyan-400"
                      : ""
                  }`}
                />
              </button>

            </div>


            {/* ==================================================
                CONTACT DETAILS
            ================================================== */}

            {showContact && (
              <div className="mt-3 border border-white/10 bg-white/[0.02] p-4">

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                  {/* PHONE */}

                  <a
                    href="tel:+917002298053"
                    className="flex items-center gap-3 border border-white/10 bg-white/[0.02] px-3 py-2.5 transition hover:border-emerald-500/30 hover:bg-white/[0.04]"
                  >
                    <Phone
                      size={15}
                      className="shrink-0 text-emerald-400"
                    />

                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-wide text-slate-600">
                        Phone
                      </p>

                      <p className="text-xs font-semibold text-slate-300">
                        +91 70022 98053
                      </p>
                    </div>
                  </a>


                  {/* EMAIL */}

                  <a
                    href="mailto:support@jobhir.com"
                    className="flex items-center gap-3 border border-white/10 bg-white/[0.02] px-3 py-2.5 transition hover:border-cyan-500/30 hover:bg-white/[0.04]"
                  >
                    <Mail
                      size={15}
                      className="shrink-0 text-cyan-400"
                    />

                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-wide text-slate-600">
                        Email
                      </p>

                      <p className="truncate text-xs font-semibold text-slate-300">
                        support@jobhir.com
                      </p>
                    </div>
                  </a>


                  {/* LOCATION */}

                  <div className="flex items-center gap-3 border border-white/10 bg-white/[0.02] px-3 py-2.5 sm:col-span-2">
                    <MapPin
                      size={15}
                      className="shrink-0 text-emerald-400"
                    />

                    <div>
                      <p className="text-[9px] uppercase tracking-wide text-slate-600">
                        Location
                      </p>

                      <p className="text-xs font-semibold text-slate-300">
                        Assam, India
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}


            {/* ==================================================
                HEALTHCARE DETAILS
            ================================================== */}

            {showHealthcare && (
              <div className="mt-3 border border-white/10 bg-white/[0.02] p-4">

                <p className="mb-4 text-[11px] leading-5 text-slate-500">
                  For healthcare job availability and recruitment
                  enquiries, contact our recruitment team.
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">

                  {recruitmentContacts.map((contact) => (
                    <div
                      key={contact.phone}
                      className="flex items-center justify-between gap-2 border border-white/10 bg-white/[0.02] px-3 py-2.5"
                    >

                      {/* CONTACT INFO */}

                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-slate-300">
                          {contact.name}
                        </p>

                        <p className="text-[10px] text-slate-600">
                          {contact.phone}
                        </p>
                      </div>


                      {/* ACTION BUTTONS */}

                      <div className="flex shrink-0 gap-1">

                        {/* CALL */}

                        <a
                          href={`tel:${contact.phone}`}
                          className="flex h-7 w-7 items-center justify-center bg-white/10 text-slate-300 transition hover:bg-white hover:text-slate-900"
                          title={`Call ${contact.name}`}
                        >
                          <Phone size={12} />
                        </a>


                        {/* WHATSAPP */}

                        <button
                          type="button"
                          onClick={() =>
                            handleWhatsApp(
                              contact.name,
                              contact.phone
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center bg-emerald-600 text-white transition hover:bg-emerald-500"
                          title={`WhatsApp ${contact.name}`}
                        >
                          <MessageCircle size={12} />
                        </button>

                      </div>

                    </div>
                  ))}

                </div>
              </div>
            )}

          </div>
        </div>


        {/* ==================================================
            REGISTER BAR
        ================================================== */}

        <div className="mt-8 flex flex-col gap-3 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-sm font-bold text-white">
              Looking for work?
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Register with JobHIR and find suitable opportunities.
            </p>
          </div>

          <Link
            to="/worker-register"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500"
          >
            Register Now

            <ArrowUpRight size={14} />
          </Link>
        </div>


        {/* ==================================================
            BOTTOM
        ================================================== */}

        <div className="flex flex-col gap-2 pt-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p className="text-[10px] text-slate-600">
            © {currentYear} JobHIR. All Rights Reserved.
          </p>

          <p className="text-[10px] text-slate-600">
            Powered & Developed by{" "}

            <span className="font-semibold text-slate-400">
              Web Core Cube Tech - 9058596626
            </span>
          </p>

        </div>

      </div>
    </footer>
  );
}