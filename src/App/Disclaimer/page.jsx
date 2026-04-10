import React from "react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Disclaimer
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="text-gray-700 mb-6">
          The information provided on <strong>Jobhir.com</strong> is for general informational purposes only.
          While we strive to keep the information up to date and accurate, we make no representations
          or warranties about the completeness, reliability, or suitability of any job listing or information.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-3">
          1. Job Listings and Employers
        </h2>
        <p className="text-gray-700 mb-4">
          Jobhir.com acts only as a bridge between job seekers and employers, mainly in
          <strong> Nagaon, Morigaon, Sonitpur, Hojai, Kamrup</strong> and nearby regions of Assam. 
          We do not guarantee the authenticity of any employer, job offer, or job seeker.
          Please verify before sharing personal or financial information.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-3">
          2. No Responsibility for External Links
        </h2>
        <p className="text-gray-700 mb-4">
          Our website may contain links to external websites. Jobhir.com does not control or endorse
          the content or practices of those sites. Users should visit them at their own risk.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-3">
          3. User’s Own Risk
        </h2>
        <p className="text-gray-700 mb-4">
          Any action you take based on information found on this website is strictly at your own risk.
          Jobhir.com will not be liable for any loss or damage resulting from the use of our services.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-3">
          4. Contact Us
        </h2>

        <p className="text-gray-700">
          If you have any questions about this Disclaimer, please contact us at:
          <br />
          <strong>Email:</strong>{" "}
          <a href="mailto:frahim9900@gmail.com" className="text-blue-600">
            frahim9900@gmail.com
          </a>
          <br />
          <strong>Phone:</strong>{" "}
          <a href="tel:+919058596626" className="text-blue-600">
            9058596626
          </a>
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
