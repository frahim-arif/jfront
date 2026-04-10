import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OfferJob() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobAmount, setJobAmount] = useState("");
  const [jobDistrict, setJobDistrict] = useState("");
  const [jobPhone, setJobPhone] = useState("");
  const [jobEmail, setJobEmail] = useState("");

  // District list
  const districts = [
    "Nagaon",
    "Morigaon",
    "Hojai",
    "Kamrup",
    "Sunitpur",
    "Dhubri",
    "Borpeta",
    "Haju",
  ];

  const submitJob = async () => {
    if (!jobTitle || !jobDescription || !jobAmount || !jobDistrict || !jobPhone) {
      alert("Please fill all fields!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/jobs", {
        title: jobTitle,
        description: jobDescription,
        amount: Number(jobAmount),
        district: jobDistrict,
        postedByPhone: jobPhone,
        postedByEmail: jobEmail, // ✔ Apply email will go here
      });

      alert("Job posted successfully!");

      // Clear fields
      setJobTitle("");
      setJobDescription("");
      setJobAmount("");
      setJobDistrict("");
      setJobPhone("");
      setJobEmail("");

      // ✔ Redirect to Home
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error posting job!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Offer a Job</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Job Title"
            className="w-full p-2 border rounded"
          />

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Job Description"
            className="w-full p-2 border rounded"
          />

          <input
            type="number"
            value={jobAmount}
            onChange={(e) => setJobAmount(e.target.value)}
            placeholder="Amount (₹)"
            className="w-full p-2 border rounded"
          />

          <select
            value={jobDistrict}
            onChange={(e) => setJobDistrict(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <input
            type="tel"
            value={jobPhone}
            onChange={(e) =>
              setJobPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))
            }
            placeholder="Your Phone"
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            value={jobEmail}
            onChange={(e) => setJobEmail(e.target.value)}
            placeholder="Your Email (optional)"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={submitJob}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Submit Job
        </button>
      </div>
    </div>
  );
}
