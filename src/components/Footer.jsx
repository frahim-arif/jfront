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
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Logo */}
          <div>
            <Link to="/" className="mb-5 inline-flex items-center gap-3">
              <img
                src="/images/job.png"
                alt="Jobhir"
                className="h-14 w-14 rounded-full border-2 border-white bg-white object-cover"
              />

              <div>
                <h2 className="text-2xl font-bold">
                  Jobhir
                </h2>

                <p className="text-xs text-white/70">
                  Find Your Future
                </p>
              </div>
            </Link>

            <p className="text-sm leading-7 text-white/80">
              Jobhir helps job seekers discover genuine job opportunities
              and helps employers connect with the right candidates easily.
            </p>

            <div className="mt-5 flex gap-3">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition hover:bg-white hover:text-sky-700"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition hover:bg-white hover:text-sky-700"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition hover:bg-white hover:text-sky-700"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition hover:bg-white hover:text-sky-700"
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

            <div className="space-y-3 text-sm text-white/75">
              <Link to="/" className="block hover:text-white">
                Home
              </Link>

              <Link to="/jobs" className="block hover:text-white">
                Jobs
              </Link>

              <Link to="/offer-job" className="block hover:text-white">
                Offer a Job
              </Link>

              <Link to="/pricing" className="block hover:text-white">
                Pricing
              </Link>

              <Link to="/contact" className="block hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-5 text-lg font-bold">
              Important Links
            </h3>

            <div className="space-y-3 text-sm text-white/75">
              <Link to="/privacy" className="block hover:text-white">
                Privacy Policy
              </Link>

              <Link to="/terms" className="block hover:text-white">
                Terms & Conditions
              </Link>

              <Link to="/disclaimer" className="block hover:text-white">
                Disclaimer
              </Link>

              <Link to="/refund-policy" className="block hover:text-white">
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

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@jobhir.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 00000 00000</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>India</span>
              </div>

            </div>
          </div>

        </div>

        {/* Offer Job */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-lg font-bold">
              Looking for the right candidate?
            </h3>

            <p className="text-sm text-white/70">
              Post your job and reach suitable candidates.
            </p>
          </div>

          <Link
            to="/offer-job"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-sky-700"
          >
            Offer a Job
            <ArrowRight size={17} />
          </Link>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 py-6">
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