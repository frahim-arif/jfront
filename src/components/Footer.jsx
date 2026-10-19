
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
    <footer className="relative mt-12 w-full overflow-hidden border-t border-emerald-900 bg-[#071c19] text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-0 h-64 w-64 bg-emerald-500/[0.07] blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-64 w-64 bg-amber-400/[0.05] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8ae6a]/70 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
              aria-label="JobHIR home"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#c8ae6a]/50 bg-white p-1.5 transition duration-300 group-hover:border-[#c8ae6a] group-hover:-translate-y-0.5">
                <img
                  src="/images/job.png"
                  alt="JobHIR"
                  className="h-full w-full object-contain"
                />
              </span>

              <span>
                <span className="block text-xl font-black tracking-tight text-white">
                  Job<span className="text-[#c8ae6a]">HIR</span>
                </span>

                <span className="mt-0.5 block text-[10px] font-medium tracking-wide text-emerald-100/60">
                  Find Work. Build Your Future.
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-xs leading-6 text-emerald-50/65">
              JobHIR connects skilled workers with job opportunities
              and helps employers find suitable workers across India.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2">
              <ShieldCheck size={15} className="shrink-0 text-[#c8ae6a]" />

              <span className="text-[10px] font-semibold text-emerald-50/85">
                Secure & Trusted Job Platform
              </span>
            </div>
          </div>
          
<div className="mt-3 inline-flex items-center gap-2 border border-[#c8ae6a]/30 bg-[#c8ae6a]/[0.07] px-3 py-2">
  <span className="flex h-6 w-6 items-center justify-center bg-[#c8ae6a] text-xs font-black text-[#071c19]">
    24
  </span>
  <span className="text-[10px] font-semibold text-[#e5d29a]">
    24/7 Job Access
  </span>
</div>


          {/* Contact & Healthcare */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Contact Toggle */}
              <button
                type="button"
                onClick={() => setShowContact((prev) => !prev)}
                aria-expanded={showContact}
                className="group flex w-full items-center justify-between gap-3 border border-white/10 bg-white/[0.025] p-3.5 text-left transition duration-200 hover:border-emerald-400/35 hover:bg-emerald-400/[0.045]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-400/20 bg-emerald-400/[0.08]">
                    <Phone size={17} className="text-emerald-300" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-white">
                      Contact Us
                    </span>

                    <span className="mt-1 block text-[10px] text-emerald-50/45">
                      Get in touch with JobHIR
                    </span>
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-emerald-50/45 transition-transform duration-200 ${
                    showContact ? "rotate-180 text-[#c8ae6a]" : ""
                  }`}
                />
              </button>

              {/* Healthcare Toggle */}
              <button
                type="button"
                onClick={() => setShowHealthcare((prev) => !prev)}
                aria-expanded={showHealthcare}
                className="group flex w-full items-center justify-between gap-3 border border-white/10 bg-white/[0.025] p-3.5 text-left transition duration-200 hover:border-[#c8ae6a]/40 hover:bg-[#c8ae6a]/[0.04]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#c8ae6a]/25 bg-[#c8ae6a]/[0.08]">
                    <Building2 size={17} className="text-[#c8ae6a]" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-white">
                      Healthcare Recruitment
                    </span>

                    <span className="mt-1 block text-[10px] text-emerald-50/45">
                      Recruitment & job enquiries
                    </span>
                  </span>
                </span>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-emerald-50/45 transition-transform duration-200 ${
                    showHealthcare ? "rotate-180 text-[#c8ae6a]" : ""
                  }`}
                />
              </button>
            </div>

            {/* Contact Details */}
            {showContact && (
              <div className="mt-3 border border-white/10 bg-white/[0.025] p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <a
                    href="tel:+917002298053"
                    className="flex min-w-0 items-center gap-3 border border-white/[0.08] p-3 transition hover:border-emerald-400/30 hover:bg-white/[0.035]"
                  >
                    <Phone size={16} className="shrink-0 text-emerald-300" />

                    <span className="min-w-0">
                      <span className="block text-[9px] uppercase tracking-wider text-emerald-50/40">
                        Phone
                      </span>

                      <span className="mt-1 block text-xs font-semibold text-white/85">
                        +91 70022 98053
                      </span>
                    </span>
                  </a>

                  <a
                    href="mailto:support@jobhir.com"
                    className="flex min-w-0 items-center gap-3 border border-white/[0.08] p-3 transition hover:border-[#c8ae6a]/30 hover:bg-white/[0.035]"
                  >
                    <Mail size={16} className="shrink-0 text-[#c8ae6a]" />

                    <span className="min-w-0">
                      <span className="block text-[9px] uppercase tracking-wider text-emerald-50/40">
                        Email
                      </span>

                      <span className="mt-1 block truncate text-xs font-semibold text-white/85">
                        support@jobhir.com
                      </span>
                    </span>
                  </a>

                  <div className="flex items-center gap-3 border border-white/[0.08] p-3 sm:col-span-2">
                    <MapPin size={16} className="shrink-0 text-emerald-300" />

                    <span>
                      <span className="block text-[9px] uppercase tracking-wider text-emerald-50/40">
                        Location
                      </span>

                      <span className="mt-1 block text-xs font-semibold text-white/85">
                        Assam, India
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Healthcare Details */}
            {showHealthcare && (
              <div className="mt-3 border border-white/10 bg-white/[0.025] p-3 sm:p-4">
                <p className="mb-4 text-[11px] leading-5 text-emerald-50/55">
                  For healthcare job availability and recruitment
                  enquiries, contact our recruitment team.
                </p>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {recruitmentContacts.map((contact) => (
                    <div
                      key={contact.phone}
                      className="flex min-w-0 items-center justify-between gap-2 border border-white/[0.08] p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-white/90">
                          {contact.name}
                        </p>

                        <p className="mt-1 text-[10px] text-emerald-50/45">
                          {contact.phone}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1.5">
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/[0.05] text-emerald-100/75 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
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
                          className="flex h-8 w-8 items-center justify-center bg-emerald-700 text-white transition hover:bg-emerald-600"
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
        <div className="mt-8 flex flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#c8ae6a]/25 bg-[#c8ae6a]/[0.07]">
              <BriefcaseBusiness size={18} className="text-[#c8ae6a]" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                Looking for work?
              </h3>

              <p className="mt-1 max-w-md text-[11px] leading-5 text-emerald-50/50">
                Register with JobHIR and explore opportunities suited to your skills.
              </p>
            </div>
          </div>

          <Link
            to="/worker-register"
            className="inline-flex w-full items-center justify-center gap-2 border border-[#e1cc8b] bg-gradient-to-r from-[#c8ae6a] to-[#e5d29a] px-5 py-3 text-xs font-extrabold text-[#172b20] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_7px_20px_rgba(200,174,106,0.15)] active:translate-y-0 sm:w-auto"
          >
            Register Now
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-2 pt-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[10px] leading-5 text-emerald-50/40">
            © {currentYear} JobHIR. All Rights Reserved.
          </p>

          <p className="text-[10px] leading-5 text-emerald-50/40">
            Powered & Developed by{" "}
            <span className="font-semibold text-[#c8ae6a]/85">
              Web Core Cube Tech - 9058596626
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
