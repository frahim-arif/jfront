import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-16 overflow-hidden bg-slate-950 text-white">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-sky-600/20 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      {/* MAIN FOOTER */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-3 group"
            >
              <div className="relative">
                <img
                  src="/images/job.png"
                  alt="JobHIR"
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    border
                    border-white/20
                    object-cover
                    shadow-xl
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                <div className="absolute -right-1 -bottom-1">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-slate-950">
                    <ShieldCheck size={12} />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  JobHIR
                </h2>

                <p className="mt-0.5 text-sm text-slate-400">
                  Find Work. Build Your Future.
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              JobHIR connects skilled workers with genuine job opportunities.
              Find the right work, apply easily, and build your future with us.
            </p>

            {/* TRUST BADGE */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
              <ShieldCheck
                size={17}
                className="text-emerald-400"
              />

              <span className="text-xs font-semibold text-emerald-300">
                Secure & Trusted Job Platform
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-400 transition hover:text-sky-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/worker-register"
                  className="text-sm text-slate-400 transition hover:text-sky-400"
                >
                  Worker Registration
                </Link>
              </li>

              <li>
                <Link
                  to="/offer-job"
                  className="text-sm text-slate-400 transition hover:text-sky-400"
                >
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">
              {/* PHONE */}
              <a
                href="tel:+917002298053"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-slate-400
                  transition
                  hover:text-white
                "
              >
                <div className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-white/5
                  text-sky-400
                  transition
                  group-hover:bg-sky-500
                  group-hover:text-white
                ">
                  <Phone size={17} />
                </div>

                <span>
                  +91 70022 98053
                </span>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:support@jobhir.com"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-slate-400
                  transition
                  hover:text-white
                "
              >
                <div className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-white/5
                  text-sky-400
                  transition
                  group-hover:bg-sky-500
                  group-hover:text-white
                ">
                  <Mail size={17} />
                </div>

                <span>
                  support@jobhir.com
                </span>
              </a>

              {/* LOCATION */}
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <div className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-white/5
                  text-sky-400
                ">
                  <MapPin size={17} />
                </div>

                <span>
                  Assam, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="
          mt-10
          flex
          flex-col
          items-center
          justify-between
          gap-5
          rounded-2xl
          border
          border-white/10
          bg-white/[0.04]
          p-5
          sm:flex-row
          sm:p-6
        ">
          <div>
            <h3 className="text-lg font-bold">
              Looking for work?
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Register today and discover job opportunities.
            </p>
          </div>

          <Link
            to="/worker-register"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-sky-500
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-sky-500/20
              transition-all
              hover:bg-sky-400
              sm:w-auto
            "
          >
            Register Now

            <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* BOTTOM */}
        <div className="
          mt-8
          flex
          flex-col
          items-center
          justify-between
          gap-3
          border-t
          border-white/10
          pt-5
          text-center
          sm:flex-row
          sm:text-left
        ">
          <p className="text-xs text-slate-500">
            © {currentYear} JobHIR. All Rights Reserved.
          </p>

          <p className="text-xs text-slate-500">
            Powered & Developed by{" "}
            <span className="font-semibold text-slate-300">
              Web Core Cube Tech
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}