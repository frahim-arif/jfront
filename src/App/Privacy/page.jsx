import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex flex-col items-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full border border-gray-200">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-500 mb-8 text-center text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          Welcome to <strong>Jobhir.com</strong>. Your privacy is extremely important to us.
          This Privacy Policy explains how we collect, use, store, and protect your personal
          information when you use our website and services. By accessing Jobhir.com,
          you agree to the practices described in this policy.
        </p>

        {/* Section 1 */}
        <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-3">
          1. About Jobhir.com
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Jobhir.com is built to help people in the districts of Assam —
          <strong> Nagaon, Morigaon, Sonitpur, Hojai, Kamrup</strong> and nearby regions —
          easily post and find job opportunities. We aim to connect local employers with job seekers.
        </p>

        {/* Section 2 */}
        <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-3">
          2. Information We Collect
        </h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>Your basic information like name, email, and phone number.</li>
          <li>Job-related details (title, company name, job description, etc.).</li>
          <li>Device and usage data to improve website experience.</li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-3">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>To connect employers and job seekers.</li>
          <li>To send job alerts, notifications, and updates.</li>
          <li>To enhance platform performance and user experience.</li>
        </ul>

        {/* Section 4 */}
        <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-3">
          4. Data Protection & Security
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use trusted security methods to protect your personal data from unauthorized
          access or misuse. However, no online method can guarantee 100% security.
        </p>

        {/* Section 5 */}
        <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-3">
          5. Sharing Your Information
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We only share data when required — such as connecting employers and job seekers.
          We never sell or rent your personal data to third-party companies.
        </p>

        {/* Section 6 */}
        <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-3">
          6. Cookies
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We may use cookies to improve performance and user experience. You may disable
          cookies through your browser settings anytime.
        </p>

        {/* Section 7 */}
        <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-3">
          7. Your Rights
        </h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>You can request deletion or correction of your data anytime.</li>
          <li>You can unsubscribe from notifications at any moment.</li>
        </ul>

        {/* Section 8 */}
        <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-3">
          8. Contact Us
        </h2>
        <p className="text-gray-700 mb-4">
          For any questions, concerns, or support regarding this Privacy Policy, contact us:
        </p>

        <ul className="text-gray-700 space-y-1 mb-6">
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:frahim9900@gmail.com" className="text-blue-600 underline">
              frahim9900@gmail.com
            </a>
          </li>

          <li>
            <strong>Phone:</strong>{" "}
            <a href="tel:+919058596626" className="text-blue-600 underline">
              9058596626
            </a>
          </li>

          <li>
            <strong>Website:</strong>{" "}
            <a href="https://jobhir.com" className="text-blue-600 underline">
              www.jobhir.com
            </a>
          </li>
        </ul>

        <p className="text-gray-700 mt-6 leading-relaxed text-center">
          Thank you for trusting <strong>Jobhir.com</strong>. We are committed to providing
          a safe and reliable job platform for everyone.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
