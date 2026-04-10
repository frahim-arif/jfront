import { useState } from "react";
import { Link } from "react-router-dom";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white backdrop-blur-lg shadow-lg border-b border-sky-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* ========== LOGO ========== */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/job.png"
              alt="Jobhir Logo"
              className="h-10 w-10 rounded-full shadow-md object-cover"
            />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-600 tracking-wider drop-shadow-md">
  Jobhir
</span>

          </Link>

          {/* ========== DESKTOP MENU ========== */}
          <nav className="hidden md:flex items-center space-x-6">
            {["disclaimer", "contact", "terms", "privacy", "pricing"].map(
              (page, index) => (
                <Link
                  key={index}
                  to={`/${page}`}
                  className="text-gray-700 font-medium hover:text-sky-600 transition-all"
                >
                  {page.replace("-", " ").toUpperCase()}
                </Link>
              )
            )}

            {/* Offer Job Button */}
            <Link
              to="/offer-job"
              className="px-6 py-3 font-semibold rounded-xl shadow-lg text-white relative overflow-hidden text-lg transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 animate-gradient-x -z-10"></span>
              <span className="relative z-10">Offer Job</span>
            </Link>
          </nav>

          {/* ========== MOBILE HAMBURGER + BUTTON ========== */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/offer-job"
              className="px-4 py-2 font-semibold rounded-xl shadow-lg text-white relative overflow-hidden text-sm"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 animate-gradient-x -z-10"></span>
              <span className="relative z-10">Offer Job</span>
            </Link>

            <button
              className="focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========== MOBILE MENU DROPDOWN ========== */}
      {isOpen && (
        <div className="md:hidden bg-sky-400/95 backdrop-blur-md border-t border-sky-300 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {["disclaimer", "contact", "terms", "privacy", "pricing"].map(
            (page, index) => (
              <Link
                key={index}
                to={`/${page}`}
                className="block text-white/90 hover:text-white text-lg"
                onClick={() => setIsOpen(false)}
              >
                {page.replace("-", " ").toUpperCase()}
              </Link>
            )
          )}
        </div>
      )}

      {/* Tailwind Custom Animation */}
      <style>
        {`
          @keyframes gradient-x {
            0% { background-position: 100% 0; }
            50% { background-position: 0 0; }
            100% { background-position: 100% 0; }
          }
          .animate-gradient-x {
            background-size: 200% 100%;
            animation: gradient-x 3s linear infinite;
          }
        `}
      </style>
    </header>
  );
}
