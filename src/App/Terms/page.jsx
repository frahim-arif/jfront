import React from "react";

const RefundAndTerms = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex flex-col items-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl w-full border border-gray-200">

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Refund Policy & Terms and Conditions
        </h1>

        {/* Last updated */}
        <p className="text-gray-500 mb-8 text-center text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Refund Policy */}
        <h2 className="text-2xl font-bold text-blue-600 mb-3">Refund Policy</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          At <strong>Jobhir.com</strong>, we value customer satisfaction and strive to maintain
          transparency in our services. Refunds are processed only under the valid conditions
          mentioned below.
        </p>

        <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          1. Subscription & Services
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Refunds are applicable only if a user faces genuine technical or service-related
          issues that prevent the proper use of paid job posting or featured listing services.
        </p>

        <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          2. Non-Refundable Situations
        </h3>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>Wrong or incomplete information provided by the user.</li>
          <li>When the service has already been delivered or used.</li>
          <li>No refund once the subscription period begins.</li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          3. Refund Request Timeline
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Refund requests must be submitted within <strong>3 days</strong> of payment along with a valid reason
          and supporting proof. Requests after this period will not be considered.
        </p>

        <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          4. Contact for Refund
        </h3>
        <p className="text-gray-700 leading-relaxed mb-6">
          For refund or billing-related queries, contact us at:
          <br />
          <strong>Email:</strong>{" "}
          <a href="mailto:frahim9900@gmail.com" className="text-blue-600 underline">
            frahim9900@gmail.com
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a href="tel:+919058596626" className="text-blue-600 underline">
            +91 9058596626
          </a>
        </p>

        {/* Terms and Conditions */}
        <h2 className="text-2xl font-bold text-blue-600 mb-3">
          Terms and Conditions
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          By accessing or using <strong>Jobhir.com</strong>, you agree to follow the terms and
          conditions listed below. Please read them carefully.
        </p>

        <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          1. Use of Services
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Jobhir.com offers job posting and hiring solutions for individuals and businesses.
          Any misuse, fraud, or illegal activity on the platform is strictly prohibited.
        </p>

        <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          2. User Responsibilities
        </h3>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-4 space-y-1">
          <li>Provide accurate and truthful information while using our services.</li>
          <li>Avoid posting misleading, offensive, or inappropriate content.</li>
          <li>Respect the privacy and confidentiality of other users.</li>
        </ul>

        <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          3. Limitation of Liability
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Jobhir.com is not responsible for any indirect, incidental, or consequential losses
          caused due to use or inability to use the platform.
        </p>

        <h3 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          4. Policy Updates
        </h3>
        <p className="text-gray-700 leading-relaxed mb-6">
          Jobhir.com reserves the right to update or modify these terms and refund policies at
          any time. Updates will reflect on this page with a new “Last Updated” date.
        </p>

        {/* Company Info */}
        <div className="border-t mt-10 pt-6 text-gray-700">
          <h2 className="text-xl font-bold text-blue-600 mb-3">Company Information</h2>
          <p className="leading-relaxed">
            <strong>Company Name:</strong> Jobhir.com <br />
            <strong>Proprietor:</strong> Md Frahim Arif Mamud <br />
            <strong>Address:</strong> Nagaon, Assam, India - 782123 <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:frahim9900@gmail.com" className="text-blue-600 underline">
              frahim9900@gmail.com
            </a>{" "}
            <br />
            <strong>Phone:</strong>{" "}
            <a href="tel:+919058596626" className="text-blue-600 underline">
              +91 9058596626
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundAndTerms;
