import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  MessageCircle,
  BriefcaseBusiness,
  UserPlus,
  Building2,
  CheckCircle2,
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
    <footer className="relative mt-16 w-full overflow-hidden bg-slate-950 text-white">

      {/* =====================================================
          BACKGROUND EFFECTS
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.08] blur-[100px]" />

        <div className="absolute right-[-180px] top-[20%] h-[450px] w-[450px] rounded-full bg-cyan-500/[0.06] blur-[110px]" />

        <div className="absolute bottom-[-220px] left-[35%] h-[400px] w-[400px] rounded-full bg-emerald-600/[0.05] blur-[100px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_45%)]" />
      </div>

      {/* TOP BORDER */}
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative mx-auto w-full max-w-[1600px] px-5 py-12 sm:px-8 lg:px-12 xl:px-16">

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 xl:gap-16">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="sm:col-span-2 lg:col-span-1">

            <Link
              to="/"
              className="group inline-flex items-center gap-4"
            >

              {/* LOGO */}

              <div className="relative">

                <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl transition group-hover:bg-emerald-500/30" />

                <img
                  src="/images/job.png"
                  alt="JobHIR"
                  className="relative h-14 w-14 rounded-2xl border border-white/10 object-cover shadow-2xl transition duration-300 group-hover:scale-105"
                />

                <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-slate-950">
                  <ShieldCheck size={13} />
                </div>

              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  JobHIR
                </h2>

                <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500">
                  Find Work. Build Your Future.
                </p>
              </div>

            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              JobHIR connects skilled workers with genuine job
              opportunities. Find suitable work, apply easily and
              build a better future.
            </p>

            {/* TRUST BADGE */}

            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-2">

              <ShieldCheck
                size={16}
                className="text-emerald-400"
              />

              <span className="text-[11px] font-bold tracking-wide text-emerald-300">
                Secure & Trusted Job Platform
              </span>

            </div>

            {/* MINI STATS */}

            <div className="mt-7 grid max-w-sm grid-cols-2 gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <BriefcaseBusiness
                  size={18}
                  className="text-emerald-400"
                />

                <p className="mt-2 text-xs font-bold text-white">
                  Job Opportunities
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Find suitable work
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <UserPlus
                  size={18}
                  className="text-cyan-400"
                />

                <p className="mt-2 text-xs font-bold text-white">
                  Skilled Workers
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Connect with employers
                </p>
              </div>

            </div>

          </div>

         

          {/* =================================================
              CONTACT
          ================================================= */}

          <div>

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Phone size={17} />
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">
                  Contact Us
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  We're here to help
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {/* PHONE */}

              <a
                href="tel:+917002298053"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 transition hover:border-emerald-500/20 hover:bg-white/[0.05]"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-300 transition group-hover:text-white">
                    +91 70022 98053
                  </p>
                </div>

              </a>

              {/* EMAIL */}

              <a
                href="mailto:support@jobhir.com"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 transition hover:border-emerald-500/20 hover:bg-white/[0.05]"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition group-hover:bg-cyan-500 group-hover:text-white">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Email
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-slate-300 transition group-hover:text-white">
                    support@jobhir.com
                  </p>
                </div>

              </a>

              {/* LOCATION */}

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-3.5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MapPin size={16} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-300">
                    Assam, India
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              HEALTHCARE RECRUITMENT
          ================================================= */}

          <div>

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Building2 size={17} />
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">
                  Healthcare Recruitment
                </h3>

                <p className="mt-0.5 text-[10px] text-slate-600">
                  Recruitment support
                </p>
              </div>

            </div>

            <div className="rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.07] to-transparent p-4">

              <p className="text-xs leading-6 text-slate-400">
                For healthcare job availability and recruitment
                enquiries, contact our recruitment team directly.
              </p>

              <div className="mt-4 space-y-2.5">

                {recruitmentContacts.map((phone) => (
                  <div
                    key={phone}
                    className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-950/50 p-2.5"
                  >

                    <div className="flex min-w-0 items-center gap-2.5">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
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
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-slate-300 transition hover:bg-white hover:text-slate-900"
                        title="Call"
                      >
                        <Phone size={13} />
                      </a>

                      {/* WHATSAPP */}

                      <button
                        type="button"
                        onClick={() => handleWhatsApp(phone)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-500"
                        title="WhatsApp"
                      >
                        <MessageCircle size={14} />
                      </button>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* HEALTHCARE NOTE */}

            <div className="mt-3 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-3">

              <ShieldCheck
                size={14}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <p className="text-[10px] leading-5 text-slate-500">
                Verify recruitment details before sharing documents
                or making any payment.
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            LARGE CTA
        ===================================================== */}

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/[0.10] via-white/[0.025] to-cyan-500/[0.06]">

          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">

            <div className="flex items-start gap-4">

              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 sm:flex">
                <UserPlus size={21} />
              </div>

              <div>

                <h3 className="text-lg font-black text-white sm:text-xl">
                  Looking for work?
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Register with JobHIR and discover suitable job
                  opportunities for your skills.
                </p>

              </div>

            </div>

            <Link
              to="/worker-register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/10 transition duration-300 hover:bg-emerald-500 hover:shadow-emerald-500/20 sm:w-auto"
            >
              Register Now
              <ArrowUpRight size={17} />
            </Link>

          </div>

        </div>

        

        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <p className="text-[10px] text-slate-600 sm:text-xs">
            © {currentYear} JobHIR. All Rights Reserved.
          </p>

          <p className="text-[10px] text-slate-600 sm:text-xs">
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