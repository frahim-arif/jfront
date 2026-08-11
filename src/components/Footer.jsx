import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Logo + About */}
          <div>
            <Link
              to="/"
              className="mb-5 inline-flex items-center gap-3"
            >
              <img
                src="/images/job.png"
                alt="Jobhir Logo"
                className="h-14 w-14 rounded-full border-2 border-white bg-white object-cover shadow-lg"
              />

              <div>
                <h2 className="text-2xl font-bold tracking-wide">
                  Jobhir
                </h2>

                <p className="text-xs text-white/70">
                  Find Your Future
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-white/80">
              Jobhir helps job seekers discover genuine job opportunities
              and helps employers connect with the right candidates easily.
            </p>

            {/* Social */}
            <div className="mt-5 flex gap-3">

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-white hover:text-sky-700"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-white hover:text-sky-700"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-white hover:text-sky-700"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-200 hover:bg-white hover:text-sky-700"
              >
                <Twitter size={18} />
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold">
              Quick Links
            </h3>

            <div className="space-y-3 text-sm">

              <Link
                to="/"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/jobs"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Jobs
              </Link>

              <Link
                to="/offer-job"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Offer a Job
              </Link>

              <Link
                to="/pricing"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Pricing
              </Link>

              <Link
                to="/contact"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Contact Us
              </Link>

            </div>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold">
              Important Links
            </h3>

            <div className="space-y-3 text-sm">

              <Link
                to="/privacy"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/disclaimer"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Disclaimer
              </Link>

              <Link
                to="/refund-policy"
                className="block text-white/75 transition hover:translate-x-1 hover:text-white"
              >
                Refund Policy
              </Link>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold">
              Contact Us
            </h3>

            <div className="space-y-5 text-sm text-white/80">

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Mail size={17} />
                </div>

                <div>
                  <p className="text-xs text-white/50">
                    Email
                  </p>

                  <p className="mt-1">
                    support@jobhir.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-xs text-white/50">
                    Phone
                  </p>

                  <p className="mt-1">
                    +91 00000 00000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-xs text-white/50">
                    Location
                  </p>

                  <p className="mt-1">
                    India
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Job Offer CTA */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-lg font-bold">
              Looking for the right candidate?
            </h3>

            <p className="mt-1 text-sm text-white/70">
              Post your job and reach suitable candidates.
            </p>
          </div>

          <Link
            to="/offer-job"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-sky-700 shadow-lg transition-all hover:scale-105"
          >
            Offer a Job
            <ArrowRight size={17} />
          </Link>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/15 py-6">

          <div className="flex flex-col items-center justify-between gap-3 text-center text-xs text-white/60 md:flex-row">

            <p>
              © {new Date().getFullYear()} Jobhir. All Rights Reserved.
            </p>

            <p>
              Designed & Developed by{" "}
              <span className="font-semibold text-white">
                Web Core Cube Tech
              </span>
            </p>

          </div>

        </div>

      </div>
    </footer>
  );
}