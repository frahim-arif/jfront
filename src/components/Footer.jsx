import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 text-white pt-14 pb-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/20">
          
          {/* Logo + About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/job.png"
                alt="Jobhir Logo"
                className="h-12 w-12 rounded-full shadow-lg object-cover border-2 border-white"
              />
              <span className="text-2xl font-bold tracking-wide">
                Jobhir
              </span>
            </Link>

            <p className="text-white/80 leading-relaxed text-sm">
              Jobhir helps people discover amazing job opportunities with a
              modern and easy-to-use platform.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-5">
              {[
                { icon: <Facebook size={20} />, link: "#" },
                { icon: <Instagram size={20} />, link: "#" },
                { icon: <Linkedin size={20} />, link: "#" },
                { icon: <Twitter size={20} />, link: "#" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  className="bg-white/10 hover:bg-white hover:text-sky-600 transition-all p-2 rounded-full shadow-md"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>

            <div className="space-y-3">
              {[
                "disclaimer",
                "contact",
                "terms",
                "privacy",
                "pricing",
              ].map((page, index) => (
                <Link
                  key={index}
                  to={`/${page}`}
                  className="block text-white/80 hover:text-white transition-all"
                >
                  {page.replace("-", " ").toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>

            <div className="space-y-4 text-white/80">
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@jobhir.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 00000 00000</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Company</h3>

            <p className="text-white/80 leading-relaxed text-sm">
              Powered & Developed by
            </p>

            <h2 className="text-2xl font-bold mt-2">
              Web Core Cube Tech
            </h2>

            <p className="text-white/70 mt-3 text-sm">
              Building modern web applications, job portals, AI tools, and
              scalable digital solutions.
            </p>

            <Link
              to="/offer-job"
              className="inline-block mt-5 px-5 py-3 bg-white text-sky-600 font-semibold rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              Offer a Job
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/70">
          <p>
            © {new Date().getFullYear()} Jobhir. All Rights Reserved.
          </p>

          <p>
            Designed & Managed by{" "}
            <span className="font-semibold text-white">
              Web Core Cube Tech
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}