import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 bg-sky-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

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

            <p className="text-sm text-white/80">
              Find genuine job opportunities easily with Jobhir.
            </p>
          </div>

          {/* Links */}
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

              <Link to="/disclaimer" className="block hover:text-white">
                Disclaimer
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
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-white/80">

              <div className="flex items-center gap-2">
                <Mail size={17} />
                <span>support@jobhir.com</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={17} />
                <span>+91 00000 00000</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={17} />
                <span>India</span>
              </div>

            </div>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              <a href="#" className="hover:text-gray-200">
                <Facebook size={20} />
              </a>

              <a href="#" className="hover:text-gray-200">
                <Instagram size={20} />
              </a>

              <a href="#" className="hover:text-gray-200">
                <Linkedin size={20} />
              </a>
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