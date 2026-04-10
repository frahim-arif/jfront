import React from "react";
import { Link } from "react-router-dom";

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Subscription Plans</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Employer Plan */}
        <div className="border rounded-lg p-5 shadow-md bg-white">
          <h2 className="text-xl font-bold mb-2">Employer Plan</h2>
          <p className="text-lg font-semibold text-green-600 mb-4">FREE</p>

          <ul className="mb-6 space-y-2 text-black">
            <li>✅ Post Unlimited Jobs</li>
            <li>✅ View Applicants</li>
            <li>✅ Access Employer Dashboard</li>
            <li>✅ Manage Job Listings</li>
          </ul>

          <button
            disabled
            className="w-full bg-black text-white py-2 rounded-lg"
          >
            Already Free
          </button>
        </div>

        {/* Employee Plan */}
        <div className="border rounded-lg text-black p-5 shadow-md bg-white">
          <h2 className="text-xl font-bold mb-2">Employee Plan</h2>
          <p className="text-lg font-semibold text-blue-600 mb-4">₹10 / Job Apply</p>

          <ul className="mb-6 text-black space-y-2">
            <li>✅ Apply for Jobs</li>
            <li>✅ Upload Resume</li>
            <li>✅ Job Alerts</li>
            <li>✅ Profile Dashboard</li>
          </ul>

          <Link to="/checkout/apply-plan">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
              Pay ₹10 & Apply Job
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
