import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 bg-sky-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between">

          {/* Logo */}
          <Link to="/">
            <img
              src="/images/job.png"
              alt="Jobhir"
              className="h-12 w-12 rounded-full border-2 border-white object-cover"
            />
          </Link>

          {/* Company */}
          <p className="text-sm font-semibold">
            Web Core Cube Tech
          </p>

          {/* Phone */}
          <a
            href="tel:9058596626"
            className="text-sm font-semibold hover:text-white/80"
          >
            +91 9058596626
          </a>

        </div>

        <div className="mt-4 border-t border-white/20 pt-3 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Jobhir. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}