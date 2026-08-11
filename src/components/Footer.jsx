import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 bg-sky-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">

          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/job.png"
                alt="Jobhir"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />

              <span className="text-2xl font-bold">
                Jobhir
              </span>
            </Link>

            <p className="text-sm text-white/80 leading-6">
              Find genuine job opportunities easily with Jobhir.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Quick Links
            </h3>

            <div className="space-y-2 text-sm text-white/80">
              <Link to="/" className="block hover:text-white">
                Home
              </Link>

              <Link to="/pricing" className="block hover:text-white">
                Pricing
              </Link>

              <Link to="/contact" className="block hover:text-white">
                Contact
              </Link>

              <Link to="/offer-job" className="block hover:text-white">
                Offer a Job
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Legal
            </h3>

            <div className="space-y-2 text-sm text-white/80">
              <Link to="/privacy" className="block hover:text-white">
                Privacy Policy
              </Link>

              <Link to="/terms" className="block hover:text-white">
                Terms & Conditions
              </Link>

              <Link to="/disclaimer" className="block hover:text-white">
                Disclaimer
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Contact
            </h3>

            <div className="space-y-2 text-sm text-white/80">
              <p>support@jobhir.com</p>
              <p>+91 00000 00000</p>
              <p>India</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-5 text-center text-sm text-white/70">
          © {new Date().getFullYear()} Jobhir. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}