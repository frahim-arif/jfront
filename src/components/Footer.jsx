import { Link } from "react-router-dom";
import { ShieldCheck, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src="/images/job.png"
              alt="Jobhir"
              className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-md"
            />

            <div>
              <p className="text-xl font-bold">
                Jobhir
              </p>

              <div className="flex items-center gap-1 text-xs text-white/80">
                <ShieldCheck size={14} />
                <span>100% Secure & Safe</span>
              </div>
            </div>
          </Link>

          {/* Company */}
          <div className="text-center">
            <p className="text-sm text-white/70">
              Powered & Developed by
            </p>

            <p className="font-bold">
              Web Core Cube Tech
            </p>
          </div>

          {/* Phone */}
          <a
            href="tel:9058596626"
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
          >
            <Phone size={16} />
            +91 9058596626
          </a>

        </div>

        {/* Bottom */}
        <div className="mt-5 border-t border-white/20 pt-4 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Jobhir. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}