import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const recruitmentContacts = [
    "9760020822",
    "6002511436",
  ];

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/91${phone}`, "_blank");
  };

  return (
    <footer className="relative mt-12 w-full overflow-hidden bg-slate-950 text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="relative">
                <img
                  src="/images/job.png"
                  alt="JobHIR"
                  className="h-12 w-12 rounded-xl border border-white/10 object-cover shadow-lg transition group-hover:scale-105"
                />

                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-slate-950">
                  <ShieldCheck size={11} />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight">
                  JobHIR
                </h2>

                <p className="text-[11px] text-slate-500">
                  Find Work. Build Your Future.
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-xs leading-6 text-slate-400">
              JobHIR connects skilled workers with genuine job opportunities.
              Find work, apply easily and build your future.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1.5">
              <ShieldCheck
                size={14}
                className="text-emerald-400"
              />

              <span className="text-[10px] font-bold text-emerald-300">
                Secure & Trusted Job Platform
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-xs text-slate-400 transition hover:text-emerald-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/worker-register"
                  className="text-xs text-slate-400 transition hover:text-emerald-400"
                >
                  Worker Registration
                </Link>
              </li>

              <li>
                <Link
                  to="/offer-job"
                  className="text-xs text-slate-400 transition hover:text-emerald-400"
                >
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* GENERAL CONTACT */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Contact Us
            </h3>

            <div className="mt-4 space-y-3">

              {/* PHONE */}
              <a
                href="tel:+917002298053"
                className="group flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-emerald-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <Phone size={15} />
                </div>

                <span className="text-xs text-slate-400 transition group-hover:text-white">
                  +91 70022 98053
                </span>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:support@jobhir.com"
                className="group flex items-center gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-emerald-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <Mail size={15} />
                </div>

                <span className="text-xs text-slate-400 transition group-hover:text-white">
                  support@jobhir.com
                </span>
              </a>

              {/* LOCATION */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-emerald-400">
                  <MapPin size={15} />
                </div>

                <span className="text-xs text-slate-400">
                  Assam, India
                </span>
              </div>
            </div>
          </div>

          {/* HEALTHCARE RECRUITMENT */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">
              Healthcare Recruitment
            </h3>

            <p className="mt-3 text-[11px] leading-5 text-slate-500">
              For healthcare job availability and recruitment enquiries,
              contact our recruitment team.
            </p>

            <div className="mt-4 space-y-2">

              {recruitmentContacts.map((phone) => (
                <div
                  key={phone}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Phone size={14} />
                    </div>

                    <span className="text-xs font-bold text-slate-300">
                      {phone}
                    </span>
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    {/* CALL */}
                    <a
                      href={`tel:${phone}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition hover:bg-white hover:text-slate-900"
                      title="Call"
                    >
                      <Phone size={13} />
                    </a>

                    {/* WHATSAPP */}
                    <button
                      onClick={() => handleWhatsApp(phone)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-500"
                      title="WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            SMALL CTA
        ===================================================== */}

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Looking for work?
            </h3>

            <p className="mt-1 text-[11px] text-slate-500">
              Register with JobHIR and discover suitable opportunities.
            </p>
          </div>

          <Link
            to="/worker-register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/10 transition hover:bg-emerald-500 sm:w-auto"
          >
            Register Now
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* =====================================================
            DISCLAIMER
        ===================================================== */}

        <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.03] px-4 py-3">
          <p className="text-[10px] leading-5 text-slate-500">
            Please verify job details and recruitment information before
            sharing personal documents or making any payment.
          </p>
        </div>

        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <div className="mt-5 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-center sm:flex-row sm:text-left">
          <p className="text-[10px] text-slate-600">
            © {currentYear} JobHIR. All Rights Reserved.
          </p>

          <p className="text-[10px] text-slate-600">
            Powered & Developed by{" "}
            <span className="font-semibold text-slate-400">
              Web Core Cube Tech
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}